import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { useStations } from '../../context/StationContext';
import { useAuth } from '../../context/AuthContext';
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
  X,
} from 'lucide-react';

export const MobileMapScreen = () => {
  const navigate = useNavigate();
  const { stations, hospitals, selectedStation, setSelectedStation } = useStations();
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'nearby' | 'available' | 'fast' | 'green'
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback initial station if none selected
  const activeStation = selectedStation || stations[0];

  // Filtering stations based on search query and active filter pill
  const filteredStations = useMemo(() => {
    let list = [...stations];

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

    if (activeFilter === 'available') {
      list = list.filter((s) => s.availableChargers > 0);
    } else if (activeFilter === 'fast') {
      list = list.filter((s) => s.isFast || (s.powerKw && s.powerKw >= 50));
    } else if (activeFilter === 'green') {
      list = list.filter((s) => s.renewablePct >= 80);
    } else if (activeFilter === 'nearby') {
      list = list.filter((s) => (s.distanceKm || s.distance) <= 5);
    }

    return list;
  }, [stations, searchQuery, activeFilter]);

  // Turn-by-Turn Navigation via Google Maps
  const handleStartNavigation = (station) => {
    if (!station) return;
    const destLat = station.lat || station.latitude || 23.1884;
    const destLng = station.lng || station.longitude || 72.6289;
    const userLat = user?.latitude;
    const userLng = user?.longitude;
    const originParam = userLat && userLng ? `&origin=${userLat},${userLng}` : '';
    const mapsUrl = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileStatusBar />
        <MobileTopNav title="Find Charging Stations" onBack={() => navigate('/')} />

        {/* Content Container */}
        <div className="px-3.5 pt-1.5 pb-2 flex flex-col flex-1 gap-2 overflow-hidden">
          {/* Search location field */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, network (e.g. Tata, Jio-bp), area..."
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

          {/* Filter pills row */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {[
              { id: 'all', label: 'All', color: 'emerald' },
              { id: 'nearby', label: 'Nearby (<5km)', color: 'sky' },
              { id: 'available', label: 'Available Now', color: 'green' },
              { id: 'fast', label: 'Fast DC (≥50 kW)', color: 'amber' },
              { id: 'green', label: 'Clean Solar (≥80%)', color: 'emerald' },
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

          {/* Real Leaflet Map with Google Maps style controls */}
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-green-200 min-h-[220px]">
            <InteractiveMap
              stations={filteredStations}
              hospitals={hospitals}
              selectedStation={activeStation}
              onSelectStation={(st) => setSelectedStation(st)}
              userLocation={{
                lat: user?.latitude || 23.1884,
                lng: user?.longitude || 72.6289,
                label: `${user?.city || 'Gandhinagar'} (You)`,
              }}
              height="100%"
              showRoute={true}
            />
          </div>

          {/* Active Station Preview & Navigation Bottom Sheet */}
          {activeStation && (
            <div className="app-card p-3 bg-white border border-green-200 shadow-sm flex flex-col gap-2 animate-slide-up">
              {/* Top Row: Title, Company, Status, Live Price */}
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2 truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono font-bold border border-emerald-200">
                      {activeStation.network || 'Tata Power'}
                    </span>
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

                <div className="text-right shrink-0">
                  <div className="text-[9px] text-slate-400">Live Rate</div>
                  <b className="font-heading text-emerald-700 text-sm font-extrabold block">
                    ₹{(activeStation.pricePerKwh || 8.4).toFixed(2)}
                    <span className="text-[9px] font-normal text-slate-500">/kWh</span>
                  </b>
                  <span className="text-[9px] text-emerald-700 font-semibold font-mono">
                    {activeStation.renewablePct || 90}% Green
                  </span>
                </div>
              </div>

              {/* Specs Snippet Bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-dashed border-green-100 text-center text-xs">
                <div className="bg-slate-50 p-1 rounded-lg">
                  <div className="text-[8px] text-slate-400">Speed</div>
                  <b className="font-heading text-[10px] text-slate-800 truncate block">
                    {activeStation.powerKw || 60} kW DC
                  </b>
                </div>
                <div className="bg-slate-50 p-1 rounded-lg">
                  <div className="text-[8px] text-slate-400">Connectors</div>
                  <b className="font-heading text-[10px] text-slate-800 truncate block">
                    {activeStation.connectors ? activeStation.connectors[0] : 'CCS2'}
                  </b>
                </div>
                <div className="bg-emerald-50/60 p-1 rounded-lg border border-emerald-200/50">
                  <div className="text-[8px] text-emerald-800">Hours</div>
                  <b className="font-heading text-[10px] text-emerald-900 truncate block">
                    {activeStation.openingStatus || 'Open 24/7'}
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
