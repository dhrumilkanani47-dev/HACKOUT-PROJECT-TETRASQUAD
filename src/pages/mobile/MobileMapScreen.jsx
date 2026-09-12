import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { useStations } from '../../context/StationContext';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import {
  Search,
  ChevronRight,
  Zap,
  Navigation,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  ArrowUpDown,
  Crown,
  X,
  Car,
} from 'lucide-react';

// Haversine distance calculator in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5; // fallback
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
  return parseFloat((R * c).toFixed(1));
}

export const MobileMapScreen = () => {
  const navigate = useNavigate();
  const { stations, hospitals, selectedStation, setSelectedStation } = useStations();
  const { user } = useAuth();
  const { vehicles } = useVehicles();

  const userLat = user?.latitude || 23.1884;
  const userLng = user?.longitude || 72.6289;

  const [activeFilter, setActiveFilter] = useState('recommended'); // 'recommended' | 'all' | 'nearby' | 'cheapest' | 'fast' | 'available'
  const [sortBy, setSortBy] = useState('smart'); // 'smart' | 'price' | 'distance'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showTopPickBanner, setShowTopPickBanner] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // 1. Enrich stations with dynamic distances and AI Recommendation Scores
  const scoredStations = useMemo(() => {
    return stations.map((st) => {
      const stLat = st.lat || st.latitude || 23.1884;
      const stLng = st.lng || st.longitude || 72.6289;
      const dist = calculateDistance(userLat, userLng, stLat, stLng);
      const price = st.pricePerKwh || (parseFloat(st.price?.replace('₹', '')) || 8.40);
      const availableCount = st.availableChargers ?? (st.isAvailable ? 4 : 0);

      // Distance score (0 to 45 pts): closer gives higher score
      const distScore = Math.max(0, 45 - dist * 4.5);

      // Price score (0 to 40 pts): lower price gives higher score (scale 6.00 to 12.00)
      const priceScore = Math.max(0, ((12.00 - price) / 6.00) * 40);

      // Availability score (0 to 15 pts)
      const availScore = availableCount > 0 ? 15 : 0;

      // Green energy bonus (0 to 10 pts)
      const greenScore = ((st.renewablePct || 80) / 100) * 10;

      const totalRecommendationScore = Math.round(distScore + priceScore + availScore + greenScore);

      return {
        ...st,
        dynamicDistanceKm: dist,
        dynamicPrice: price,
        recommendationScore: totalRecommendationScore,
      };
    });
  }, [stations, userLat, userLng]);

  // 2. Identify Top Recommended Station (Highest Score)
  const topRecommended = useMemo(() => {
    if (!scoredStations.length) return null;
    return [...scoredStations].sort((a, b) => b.recommendationScore - a.recommendationScore)[0];
  }, [scoredStations]);

  // 3. Filter & Sort Stations List
  const filteredStations = useMemo(() => {
    let list = [...scoredStations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.network?.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'recommended') {
      // Prioritize top 3 recommended
      list = [...list].sort((a, b) => b.recommendationScore - a.recommendationScore);
    } else if (activeFilter === 'nearby') {
      list = list.filter((s) => s.dynamicDistanceKm <= 5);
    } else if (activeFilter === 'cheapest') {
      list = list.filter((s) => s.dynamicPrice <= 8.00);
    } else if (activeFilter === 'fast') {
      list = list.filter((s) => s.isFast || (s.powerKw && s.powerKw >= 50));
    } else if (activeFilter === 'available') {
      list = list.filter((s) => (s.availableChargers ?? 1) > 0);
    }

    // Apply explicit sorting
    if (sortBy === 'price') {
      list.sort((a, b) => a.dynamicPrice - b.dynamicPrice);
    } else if (sortBy === 'distance') {
      list.sort((a, b) => a.dynamicDistanceKm - b.dynamicDistanceKm);
    } else if (sortBy === 'smart') {
      list.sort((a, b) => b.recommendationScore - a.recommendationScore);
    }

    return list;
  }, [scoredStations, searchQuery, activeFilter, sortBy]);

  // Active Station (only shown when explicitly selected by user or clicked)
  const activeStation = selectedStation;

  // Launch Google Maps Turn-by-Turn Directions
  const handleStartNavigation = (station) => {
    if (!station) return;
    const destLat = station.lat || station.latitude || 23.1884;
    const destLng = station.lng || station.longitude || 72.6289;
    const originParam = `&origin=${userLat},${userLng}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileStatusBar />
        <MobileTopNav title="Find Charging Stations" onBack={() => navigate('/')} />

        {/* Content Container */}
        <div className="px-3.5 pt-1 pb-2 flex flex-col flex-1 gap-2 overflow-hidden">
          {/* Top Smart Search & Sort Row */}
          <div className="flex gap-1.5 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search station, network, area..."
                className="app-field w-full text-xs pl-8 pr-7 py-2 bg-slate-50 border border-green-200 text-slate-800 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Toggle Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowSortMenu((p) => !p)}
                className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-green-50 hover:text-emerald-800 font-heading text-xs font-semibold flex items-center gap-1 shadow-2xs"
                title="Sort Stations"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Sort</span>
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-xl border border-green-200 p-1 z-50 text-xs animate-slide-up">
                  <div className="px-2.5 py-1 text-[9.5px] font-heading font-bold text-slate-400 uppercase">
                    Rank &amp; Sort By
                  </div>
                  {[
                    { id: 'smart', label: '⭐ AI Best Match (Distance & Price)' },
                    { id: 'price', label: '💰 Lowest Price First' },
                    { id: 'distance', label: '📍 Nearest Distance First' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSortBy(s.id);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl font-heading font-medium text-[11px] transition-colors ${
                        sortBy === s.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-700 hover:bg-green-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Best Recommendation Banner (Smart Distance + Price Callout) */}
          {showTopPickBanner && topRecommended && activeFilter === 'recommended' && (
            <div
              onClick={() => setSelectedStation(topRecommended)}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all active:scale-[0.99] border border-emerald-400/40"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Crown className="w-4 h-4 fill-current" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-mono font-extrabold px-1.5 py-0.2 rounded bg-white/20">
                      AI Top Pick
                    </span>
                    <span className="text-[9.5px] text-amber-300 font-heading font-bold truncate">
                      Best Distance &amp; Price
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs truncate text-white mt-0.5">
                    {topRecommended.name}
                  </div>
                  <div className="text-[9.5px] text-emerald-100 flex items-center gap-1.5 truncate">
                    <span>₹{topRecommended.dynamicPrice?.toFixed(2)}/kWh</span>
                    <span>•</span>
                    <span>{topRecommended.dynamicDistanceKm} km away</span>
                    <span>•</span>
                    <span className="text-amber-200">{topRecommended.renewablePct || 90}% Solar</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Go + Close (✕) */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartNavigation(topRecommended);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-[10.5px] flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Navigation className="w-3 h-3 fill-current" />
                  <span>Go</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTopPickBanner(false);
                  }}
                  aria-label="Close AI Top Pick"
                  className="w-6 h-6 rounded-full bg-black/25 hover:bg-black/40 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {[
              { id: 'recommended', label: '⭐ AI Recommended' },
              { id: 'cheapest', label: '💰 Lowest Price (≤₹8)' },
              { id: 'nearby', label: '📍 Nearest (<5km)' },
              { id: 'available', label: '⚡ Available Now' },
              { id: 'fast', label: '🚀 Fast DC (≥50kW)' },
              { id: 'all', label: 'All Stations' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`text-[10.5px] font-heading font-bold px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-emerald-800 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Real Leaflet Map with Google Maps Style Controls & Recommended Crown Pin */}
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-green-200 min-h-[300px] h-[340px]">
            <InteractiveMap
              stations={filteredStations.length ? filteredStations : scoredStations}
              hospitals={hospitals}
              selectedStation={activeStation}
              recommendedStationId={topRecommended?.id}
              onSelectStation={(st) => setSelectedStation(st)}
              vehicles={vehicles}
              onSelectVehicle={(vehicle) => setSelectedVehicle((current) => current?.id === vehicle.id ? null : vehicle)}
              userLocation={{
                lat: userLat,
                lng: userLng,
                label: `${user?.city || 'Gandhinagar'} (You)`,
              }}
              height="100%"
              showRoute={true}
            />
          </div>

          {selectedVehicle && (
            <div className="app-card p-3 bg-white border border-green-200 shadow-sm animate-slide-up">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-emerald-700">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-700 font-bold uppercase">Selected vehicle</span>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900 mt-0.5">{selectedVehicle.nickname || selectedVehicle.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{selectedVehicle.brand} {selectedVehicle.model || selectedVehicle.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Close vehicle details"
                  title="Close vehicle details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-2 text-center">
                <div className="rounded-lg bg-slate-50 border border-slate-100 py-1.5"><span className="block text-[8px] text-slate-400">Battery</span><b className="text-[10px] text-slate-800">{selectedVehicle.currentBatteryPct || 0}%</b></div>
                <div className="rounded-lg bg-slate-50 border border-slate-100 py-1.5"><span className="block text-[8px] text-slate-400">Range</span><b className="text-[10px] text-slate-800">{selectedVehicle.currentRangeEstimate || 0} km</b></div>
                <div className="rounded-lg bg-slate-50 border border-slate-100 py-1.5"><span className="block text-[8px] text-slate-400">Connector</span><b className="text-[10px] text-slate-800">{selectedVehicle.connector || 'CCS2'}</b></div>
              </div>
            </div>
          )}

          {/* Active Station Preview & Navigation Bottom Sheet */}
          {activeStation && (
            <div className="app-card p-3 bg-white border border-green-200 shadow-lg flex flex-col gap-2 animate-slide-up relative">
              {/* Top Row: Title, Network, Score Badge, Live Price, Close Button */}
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2 truncate">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono font-bold border border-emerald-200">
                      {activeStation.network || 'Tata Power'}
                    </span>
                    {activeStation.id === topRecommended?.id && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-heading font-extrabold flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> AI Best Value
                      </span>
                    )}
                    <span className="pill-tag green text-[9px] py-0.5 px-1.5">
                      ● {activeStation.availableChargers || 4}/{activeStation.totalChargers || 6} Free
                    </span>
                  </div>
                  <h4 className="font-heading font-extrabold text-xs text-slate-900 mt-1 truncate">
                    {activeStation.name}
                  </h4>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{activeStation.address || activeStation.city}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400">Live Rate</div>
                    <b className="font-heading text-emerald-700 text-sm font-extrabold block">
                      ₹{(activeStation.pricePerKwh || activeStation.dynamicPrice || 8.4).toFixed(2)}
                      <span className="text-[9px] font-normal text-slate-500">/kWh</span>
                    </b>
                    <span className="text-[9px] text-emerald-700 font-semibold font-mono">
                      {activeStation.renewablePct || 90}% Solar
                    </span>
                  </div>

                  {/* Close / Dismiss Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedStation(null)}
                    aria-label="Close"
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Specs & Proximity Bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-dashed border-green-100 text-center text-xs">
                <div className="bg-slate-50 p-1 rounded-lg">
                  <div className="text-[8px] text-slate-400">Distance</div>
                  <b className="font-heading text-[10px] text-slate-800 truncate block">
                    {activeStation.dynamicDistanceKm || activeStation.distanceKm || '1.8'} km away
                  </b>
                </div>
                <div className="bg-slate-50 p-1 rounded-lg">
                  <div className="text-[8px] text-slate-400">Speed &amp; Gun</div>
                  <b className="font-heading text-[10px] text-slate-800 truncate block">
                    {activeStation.powerKw || 60} kW ({activeStation.connectors ? activeStation.connectors[0] : 'CCS2'})
                  </b>
                </div>
                <div className="bg-emerald-50/60 p-1 rounded-lg border border-emerald-200/50">
                  <div className="text-[8px] text-emerald-800">Est. Savings</div>
                  <b className="font-heading text-[10px] text-emerald-900 truncate block">
                    Save ~₹42 vs peak
                  </b>
                </div>
              </div>

              {/* Primary Action Buttons: Navigate in Google Maps + Station Details */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleStartNavigation(activeStation)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  <span>Start Navigation</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/station/${activeStation.id}`)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-green-50 text-emerald-900 font-heading font-bold text-xs flex items-center justify-center gap-1 border border-slate-200 active:scale-95 transition-all"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileMapScreen;
