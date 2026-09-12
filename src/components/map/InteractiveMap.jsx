import React, { useState } from 'react';
import { Zap, Navigation, Plus, Sun, ShieldCheck, Search, Crosshair, Layers } from 'lucide-react';
import { PriceBadge } from '../common/PriceBadge';

export const InteractiveMap = ({
  stations = [],
  hospitals = [],
  selectedStation,
  onSelectStation,
  userLocation = { lat: 23.1884, lng: 72.6289, label: 'Gandhinagar (You)' }
}) => {
  const [activeLayer, setActiveLayer] = useState('all'); // 'all' | 'stations' | 'hospitals'

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-forest/15 dark:border-white/10 shadow-soft bg-[#EEF2EC] dark:bg-[#0F1714]">
      {/* Visual Vector Grid & Map Backdrop */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        {/* Sabarmati River / Water curve */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 120 -50 Q 180 200 320 300 T 550 600"
            fill="none"
            stroke="#D0E3F0"
            strokeWidth="38"
            className="dark:stroke-[#18313D]"
          />
          {/* Main Highway 1 (SG Highway / Gandhinagar corridor) */}
          <path
            d="M 50 400 L 480 80"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="12"
            className="dark:stroke-[#25362E]"
          />
          {/* Main Highway 2 (Infocity / GIFT City Ring Road) */}
          <path
            d="M 10 160 Q 300 180 580 420"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            className="dark:stroke-[#25362E]"
          />
          {/* Local Sector Grids */}
          <line x1="80" y1="20" x2="80" y2="460" stroke="#E2ECE5" strokeWidth="2" className="dark:stroke-[#1C2923]" />
          <line x1="220" y1="20" x2="220" y2="460" stroke="#E2ECE5" strokeWidth="2" className="dark:stroke-[#1C2923]" />
          <line x1="380" y1="20" x2="380" y2="460" stroke="#E2ECE5" strokeWidth="2" className="dark:stroke-[#1C2923]" />
          <line x1="20" y1="120" x2="600" y2="120" stroke="#E2ECE5" strokeWidth="2" className="dark:stroke-[#1C2923]" />
          <line x1="20" y1="280" x2="600" y2="280" stroke="#E2ECE5" strokeWidth="2" className="dark:stroke-[#1C2923]" />
          <line x1="20" y1="400" x2="600" y2="400" stroke="#E2ECE5" strokeWidth="2" className="dark:stroke-[#1C2923]" />
          {/* Park Zones */}
          <rect x="230" y="130" width="80" height="70" rx="16" fill="#D8EBDC" className="dark:fill-[#142A1F]" opacity="0.8" />
          <rect x="90" y="290" width="110" height="90" rx="16" fill="#D8EBDC" className="dark:fill-[#142A1F]" opacity="0.8" />
        </svg>
      </div>

      {/* Top Map Layer Controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5">
        <button
          onClick={() => setActiveLayer(activeLayer === 'all' ? 'stations' : 'all')}
          className="p-2 rounded-xl bg-white/90 dark:bg-paper-cardDark/90 backdrop-blur-md border border-forest/15 dark:border-white/10 text-xs font-heading font-semibold text-forest dark:text-emerald-400 shadow-sm flex items-center gap-1 cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Layers</span>
        </button>
      </div>

      {/* User Location Marker (Pulse Blue) */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: '46%', top: '50%' }}
      >
        <div className="relative flex items-center justify-center">
          <span className="absolute w-8 h-8 rounded-full bg-sky/30 animate-ping" />
          <span className="w-4 h-4 rounded-full bg-sky border-2 border-white shadow-md flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        </div>
        <div className="mt-1 -ml-6 px-2 py-0.5 rounded-md bg-sky text-white text-[9px] font-heading font-bold shadow-sm whitespace-nowrap">
          You are here
        </div>
      </div>

      {/* Hospital Markers (✚) */}
      {hospitals.map((hosp) => (
        <div
          key={hosp.id}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: `${hosp.coordinates?.x || 50}%`, top: `${hosp.coordinates?.y || 50}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-sky text-white flex items-center justify-center shadow-md font-bold text-xs border border-white hover:scale-125 transition-transform">
            ✚
          </div>
          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-ink text-white text-[10px] font-medium whitespace-nowrap shadow-lg z-30">
            {hosp.name}
          </div>
        </div>
      ))}

      {/* EV Station Markers (⚡ with dynamic ₹/kWh price badge) */}
      {stations.map((st) => {
        const isSelected = selectedStation?.id === st.id;
        const x = st.coordinates?.x || 50;
        const y = st.coordinates?.y || 50;

        return (
          <div
            key={st.id}
            onClick={() => onSelectStation && onSelectStation(st)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-xl shadow-elevated border transition-all duration-200 ${
                isSelected
                  ? 'bg-forest text-white border-white scale-110 ring-2 ring-emerald-400'
                  : 'bg-white dark:bg-paper-cardDark text-ink dark:text-white border-forest/20 hover:scale-105'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-white text-forest' : 'bg-forest text-white'}`}>
                <Zap className="w-2.5 h-2.5 fill-current" />
              </div>
              <span className="font-heading font-bold text-[11px]">
                ₹{st.pricePerKwh.toFixed(2)}
              </span>
              {st.renewablePct >= 85 && (
                <span className="text-[9px] text-amber">☀</span>
              )}
            </div>

            {/* Hover Tooltip Preview */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 p-2 rounded-xl bg-forest text-white text-[11px] whitespace-nowrap shadow-xl z-30 pointer-events-none">
              <div className="font-heading font-bold">{st.name}</div>
              <div className="text-[10px] text-emerald-200 flex items-center gap-1.5 mt-0.5">
                <span>{st.powerKw} kW DC</span>
                <span>• {st.availableChargers}/{st.totalChargers} free</span>
                <span>• {st.renewablePct}% clean</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Legend Overlay at bottom left */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 p-1.5 rounded-xl bg-white/90 dark:bg-paper-cardDark/90 backdrop-blur-md border border-forest/10 dark:border-white/10 shadow-sm text-[10px] font-heading font-medium">
        <span className="flex items-center gap-1 text-forest dark:text-emerald-400">
          <span className="w-3 h-3 rounded-full bg-forest text-white flex items-center justify-center text-[8px]">⚡</span>
          EV Station
        </span>
        <span className="flex items-center gap-1 text-sky">
          <span className="w-3 h-3 rounded-full bg-sky text-white flex items-center justify-center text-[8px]">✚</span>
          Hospital
        </span>
        <span className="flex items-center gap-1 text-sky">
          <span className="w-2.5 h-2.5 rounded-full bg-sky" />
          You
        </span>
      </div>
    </div>
  );
};
