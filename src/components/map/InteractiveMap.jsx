import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { useVehicles } from '../../context/VehicleContext';
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
  Car,
  BatteryCharging,
  Radio
} from 'lucide-react';

// Tile provider URLs with modern sleek aesthetics
const MAP_LAYERS = {
  streets: {
    name: 'Eco Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    maxZoom: 19,
  },
  dark: {
    name: 'Cyber Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    maxZoom: 19,
  },
};

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
  const { vehicles, primaryVehicle } = useVehicles();
  const activeVehicle = primaryVehicle || vehicles?.[0] || {
    name: 'Nexon EV',
    brand: 'Tata',
    type: 'SUV',
    plateNumber: 'GJ 01 EV 4821',
    currentBatteryPct: 76,
    currentRangeEstimate: 248
  };

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
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
      zoomControl: false,
      attributionControl: false,
    });

    // Base Tile Layer
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

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer on Switch
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
        setUserLivePos({ lat: latitude, lng: longitude, accuracy, label: 'Live Location' });
      },
      (err) => {
        console.warn('Geolocation:', err?.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // =========================================================================
  // RENDER OUR VEHICLE ICON MARKER ON MAP
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLivePos?.lat || !userLivePos?.lng) return;

    if (vehicleMarkerRef.current) {
      map.removeLayer(vehicleMarkerRef.current);
    }

    const isScooter = activeVehicle?.type === 'Scooter' || activeVehicle?.type === 'Motorcycle' || activeVehicle?.brand === 'Ather' || activeVehicle?.brand === 'Ola';
    const vehicleIconSymbol = isScooter ? '🛵' : '🚗';
    const vehName = activeVehicle?.nickname || activeVehicle?.name || 'My EV';
    const vehPlate = activeVehicle?.plateNumber || 'GJ 01 EV 0000';
    const battPct = activeVehicle?.currentBatteryPct || 76;
    const rangeEst = activeVehicle?.currentRangeEstimate || 248;

    const vehicleMarkerHtml = `
      <div class="relative flex flex-col items-center select-none cursor-pointer group -translate-x-1/2 -translate-y-[80%]">
        <!-- Floating Vehicle Info Card Pill -->
        <div class="mb-1 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 text-white border-2 border-emerald-400 shadow-[0_4px_16px_rgba(16,185,129,0.4)] backdrop-blur-md transition-transform group-hover:scale-110">
          <span class="text-xs">${vehicleIconSymbol}</span>
          <div class="flex flex-col text-left leading-tight">
            <div class="font-heading font-extrabold text-[11px] text-emerald-300 flex items-center gap-1">
              <span>${vehName}</span>
              <span class="text-[9px] font-mono text-white bg-emerald-700/80 px-1 py-0.2 rounded font-bold">${battPct}%</span>
            </div>
            <span class="text-[8.5px] text-slate-300 font-mono">${vehPlate} • ${rangeEst} km</span>
          </div>
        </div>

        <!-- Animated Radar Ping Waves -->
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full bg-emerald-500/25 animate-ping pointer-events-none"></div>
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/35 animate-pulse pointer-events-none"></div>
          
          <!-- Central Vehicle Pin Center Hub -->
          <div class="relative w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-white shadow-[0_0_15px_#2ee6a8] flex items-center justify-center text-sm shadow-md">
            <span>${vehicleIconSymbol}</span>
          </div>
        </div>

        <!-- Pin Pointer Stem -->
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-600 -mt-0.5 shadow-sm"></div>
      </div>
    `;

    const customVehicleIcon = L.divIcon({
      className: 'custom-vehicle-map-pin',
      html: vehicleMarkerHtml,
      iconSize: [120, 60],
      iconAnchor: [60, 56],
    });

    const marker = L.marker([userLivePos.lat, userLivePos.lng], {
      icon: customVehicleIcon,
      zIndexOffset: 1200,
    }).addTo(map);

    marker.bindPopup(`
      <div class="p-1 font-sans text-xs min-w-[170px]">
        <div class="flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="text-sm">${vehicleIconSymbol}</span>
          <div>
            <b class="text-slate-900 block leading-tight font-heading">${vehName}</b>
            <span class="text-[10px] text-emerald-700 font-mono font-bold">${vehPlate}</span>
          </div>
        </div>
        <div class="mt-1.5 flex flex-col gap-1 text-[11px] text-slate-600">
          <div class="flex justify-between">
            <span>Live Status:</span>
            <b class="text-emerald-600 font-bold">🟢 Connected</b>
          </div>
          <div class="flex justify-between">
            <span>Battery SoC:</span>
            <b class="text-slate-900 font-bold">${battPct}% (${rangeEst} km)</b>
          </div>
        </div>
      </div>
    `, {
      offset: [0, -45]
    });

    vehicleMarkerRef.current = marker;
  }, [userLivePos, activeVehicle]);

  // Render Station Markers & Hospital Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Render Hospital Markers
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

    // Render Clean Station Markers
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
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border-2 ${
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

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Center & fly directly to our vehicle marker
  const handleRecenterVehicle = () => {
    if (!mapInstanceRef.current || !userLivePos?.lat || !userLivePos?.lng) return;
    mapInstanceRef.current.flyTo([userLivePos.lat, userLivePos.lng], 15, {
      duration: 0.9,
    });
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-green-200/60 shadow-md ${className}`}
      style={{ height }}
    >
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* ========================================================= */}
      {/* TOP FLOATING CONTROLS: MY VEHICLE RECENTER & MAP STYLES */}
      {/* ========================================================= */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
        {/* Recenter on Our Vehicle Button */}
        <button
          type="button"
          onClick={handleRecenterVehicle}
          className="px-2.5 py-1.5 rounded-xl bg-white/95 text-slate-900 hover:text-emerald-700 shadow-md border border-slate-200/80 font-heading font-extrabold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <span className="text-xs">🚗</span>
          <span>My Vehicle</span>
        </button>

        {/* Layer Style Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="w-8 h-8 rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:text-emerald-700 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            title="Switch Map Theme"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-10 z-40 w-36 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 animate-slide-up text-xs">
              <div className="text-[9.5px] font-mono text-slate-400 font-bold uppercase px-2 py-1">
                Map Theme
              </div>
              {Object.entries(MAP_LAYERS).map(([k, cfg]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setActiveLayerKey(k);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl font-heading font-semibold text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                    activeLayerKey === k
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cfg.name}</span>
                  {activeLayerKey === k && <span className="text-emerald-600">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM CONTROLS: ZOOM & LIVE GPS STATS */}
      {/* ========================================================= */}
      <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-green-50 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-green-50 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Left: Live Vehicle Telematics Link Pill */}
      <div
        onClick={handleRecenterVehicle}
        className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-[10px] text-white shadow-lg cursor-pointer hover:border-emerald-400 transition-all"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-heading font-extrabold text-emerald-300">{activeVehicle?.name || 'EV Connected'}</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-300 font-mono">{stations.length} Green Hubs</span>
      </div>
    </div>
  );
};

export default InteractiveMap;
