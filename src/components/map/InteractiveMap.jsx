import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Zap,
  Navigation,
  Plus,
  Minus,
  Crosshair,
  Layers,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Compass,
  Sparkles,
} from 'lucide-react';

// Tile provider URLs
const MAP_LAYERS = {
  streets: {
    name: 'Standard Streets',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  dark: {
    name: 'Dark Night Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
  },
};

// Haversine distance calculator in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export const InteractiveMap = ({
  stations = [],
  hospitals = [],
  selectedStation,
  recommendedStationId,
  onSelectStation,
  userLocation: propUserLocation,
  height = '420px',
  showRoute = true,
  className = '',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  const [activeLayerKey, setActiveLayerKey] = useState('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLivePos, setUserLivePos] = useState(
    propUserLocation || { lat: 23.1884, lng: 72.6289, label: 'Gandhinagar' }
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = userLivePos?.lat || 23.1884;
    const initialLng = userLivePos?.lng || 72.6289;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false, // We render custom Google Maps-like zoom controls
      attributionControl: false,
    });

    // Add base tile layer
    const currentLayerCfg = MAP_LAYERS[activeLayerKey];
    const tileLayer = L.tileLayer(currentLayerCfg.url, {
      maxZoom: currentLayerCfg.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Feature group for markers
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    mapInstanceRef.current = map;

    // Trigger map resize after slight delay to ensure container dimensions
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when layer key changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const currentCfg = MAP_LAYERS[activeLayerKey];
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTileLayer = L.tileLayer(currentCfg.url, {
      maxZoom: currentCfg.maxZoom,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [activeLayerKey]);

  // Live Location Watcher
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLivePos({ lat: latitude, lng: longitude, accuracy, label: 'Your Live Location' });
      },
      (err) => {
        console.warn('Live location permission or GPS error:', err?.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Render User Location Pulse Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLivePos?.lat || !userLivePos?.lng) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    const userHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        <div class="absolute w-9 h-9 rounded-full bg-blue-500/25 animate-ping"></div>
        <div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: userHtml,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([userLivePos.lat, userLivePos.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    marker.bindTooltip('📍 You are here', {
      direction: 'top',
      offset: [0, -12],
      className: 'bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow',
    });

    userMarkerRef.current = marker;
  }, [userLivePos]);

  // Render Station Markers & Hospital Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Render Hospital Markers if any
    hospitals.forEach((hosp) => {
      const lat = hosp.lat || hosp.latitude || (userLivePos?.lat ? userLivePos.lat + 0.015 : 23.195);
      const lng = hosp.lng || hosp.longitude || (userLivePos?.lng ? userLivePos.lng + 0.012 : 72.635);

      const hospHtml = `
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs shadow-md border-2 border-white hover:scale-125 transition-transform cursor-pointer">
          ✚
        </div>
      `;

      const hospIcon = L.divIcon({
        className: 'custom-hosp-pin',
        html: hospHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const m = L.marker([lat, lng], { icon: hospIcon });
      m.bindPopup(`
        <div class="text-xs p-1 font-sans">
          <b class="text-slate-900 block">${hosp.name || 'Emergency Medical Hub'}</b>
          <span class="text-slate-500 text-[10px]">Hospital & Emergency Charger Corridor</span>
        </div>
      `);
      markersGroup.addLayer(m);
    });

    // Render Station Markers
    stations.forEach((st) => {
      const isSelected = selectedStation?.id === st.id;
      const isRecommended = recommendedStationId && recommendedStationId === st.id;
      const lat = st.lat || st.latitude || 23.1884;
      const lng = st.lng || st.longitude || 72.6289;
      const price = st.pricePerKwh ? `₹${st.pricePerKwh.toFixed(2)}` : (st.price || '₹8.40');
      const isFast = st.isFast || (st.powerKw && st.powerKw >= 50);

      const markerHtml = `
        <div class="relative cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-115 z-50' : isRecommended ? 'scale-110 z-40' : 'hover:scale-108'
        }">
          ${
            isRecommended
              ? '<div class="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping pointer-events-none"></div>'
              : ''
          }
          <div class="flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border-2 ${
            isSelected
              ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-400'
              : isRecommended
              ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/60 font-bold'
              : 'bg-white text-slate-900 border-emerald-500 hover:border-emerald-600'
          }">
            <div class="w-3.5 h-3.5 rounded-full ${
              isSelected
                ? 'bg-white text-emerald-700'
                : isRecommended
                ? 'bg-amber-950 text-amber-300'
                : 'bg-emerald-500 text-white'
            } flex items-center justify-center font-bold text-[9px]">
              ${isRecommended ? '👑' : '⚡'}
            </div>
            <span class="font-heading font-extrabold text-[11px] whitespace-nowrap leading-none">
              ${price}
            </span>
            ${
              isRecommended
                ? '<span class="text-[8.5px] px-1 py-0.2 rounded bg-amber-900 text-amber-100 font-bold">Best</span>'
                : isFast
                ? '<span class="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-bold font-mono">DC</span>'
                : ''
            }
          </div>
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${
            isSelected
              ? 'border-t-emerald-600'
              : isRecommended
              ? 'border-t-amber-500'
              : 'border-t-emerald-500'
          } mx-auto -mt-0.5"></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-station-pin',
        html: markerHtml,
        iconSize: [60, 30],
        iconAnchor: [30, 28],
      });

      const marker = L.marker([lat, lng], { icon });

      marker.on('click', () => {
        if (onSelectStation) {
          onSelectStation(st);
        }
        map.flyTo([lat, lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
      });

      markersGroup.addLayer(marker);
    });
  }, [stations, hospitals, selectedStation, recommendedStationId, onSelectStation]);

  // Route Polyline when station is selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (showRoute && selectedStation && userLivePos?.lat && userLivePos?.lng) {
      const stLat = selectedStation.lat || selectedStation.latitude;
      const stLng = selectedStation.lng || selectedStation.longitude;

      if (stLat && stLng) {
        const polyline = L.polyline(
          [
            [userLivePos.lat, userLivePos.lng],
            [stLat, stLng],
          ],
          {
            color: '#10B981',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.85,
          }
        ).addTo(map);

        routePolylineRef.current = polyline;
      }
    }
  }, [selectedStation, userLivePos, showRoute]);

  // Controls: Zoom In
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  // Controls: Zoom Out
  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Controls: My Location
  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude, longitude, accuracy } = pos.coords;
          setUserLivePos({ lat: latitude, lng: longitude, accuracy, label: 'Your Location' });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1 });
          }
        },
        (err) => {
          setIsLocating(false);
          // Default to Gandhinagar
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([23.1884, 72.6289], 14, { duration: 1 });
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Turn-by-Turn Navigation via Google Maps
  const handleOpenGoogleMaps = (st) => {
    const destinationLat = st.lat || st.latitude || 23.1884;
    const destinationLng = st.lng || st.longitude || 72.6289;
    const originParam = userLivePos?.lat && userLivePos?.lng ? `&origin=${userLivePos.lat},${userLivePos.lng}` : '';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const calculatedDist = useMemo(() => {
    if (!selectedStation || !userLivePos?.lat || !userLivePos?.lng) return null;
    const stLat = selectedStation.lat || selectedStation.latitude;
    const stLng = selectedStation.lng || selectedStation.longitude;
    return calculateDistance(userLivePos.lat, userLivePos.lng, stLat, stLng);
  }, [selectedStation, userLivePos]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-green-200 shadow-sm bg-slate-100 select-none ${className}`} style={{ height }}>
      {/* Real Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Google Maps-like Control Bar (Top Right) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
        {/* Layer Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu((p) => !p)}
            className="w-9 h-9 rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-green-50 hover:text-emerald-700 active:scale-95 transition-all"
            title="Map Layers (Satellite / Street / Dark)"
          >
            <Layers className="w-4 h-4" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-11 w-44 bg-white rounded-2xl shadow-xl border border-green-200 p-1.5 z-40 text-xs animate-slide-up">
              <div className="px-2 py-1 text-[10px] font-heading font-bold text-slate-400 uppercase">
                Map Types
              </div>
              {Object.entries(MAP_LAYERS).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveLayerKey(key);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl font-heading font-semibold text-xs flex items-center justify-between transition-colors ${
                    activeLayerKey === key
                      ? 'bg-emerald-500 text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-green-50'
                  }`}
                >
                  <span>{cfg.name}</span>
                  {activeLayerKey === key && <span className="text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Locate Me (GPS Track) Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          className={`w-9 h-9 rounded-xl bg-white/95 shadow-md border border-slate-200/80 flex items-center justify-center active:scale-95 transition-all ${
            isLocating ? 'text-blue-600 bg-blue-50 ring-2 ring-blue-400 animate-pulse' : 'text-slate-700 hover:text-emerald-700 hover:bg-green-50'
          }`}
          title="Track Live GPS Location"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Zoom In Button */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-green-50 hover:text-emerald-700 active:scale-95 transition-all"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out Button */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-green-50 hover:text-emerald-700 active:scale-95 transition-all"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Floating GPS Accuracy & Live Status Pill (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-green-200/80 text-[10px] text-slate-700 font-medium shadow-sm">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
        <span className="font-heading font-semibold text-slate-900">Live GPS</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-500 font-mono">{stations.length} Chargers</span>
      </div>
    </div>
  );
};

export default InteractiveMap;
