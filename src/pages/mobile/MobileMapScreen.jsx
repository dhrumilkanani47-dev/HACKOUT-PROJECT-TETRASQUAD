import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { Search, ChevronRight, Zap } from 'lucide-react';

export const MobileMapScreen = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('nearby');
  const [selectedStationId, setSelectedStationId] = useState('st_01');
  const [searchQuery, setSearchQuery] = useState('');

  const stationsOnMap = [
    {
      id: 'st_01',
      name: 'GreenHub Station',
      city: 'Ahmedabad, Gujarat',
      distance: '1.8 km',
      price: '₹8.40',
      available: '4 / 6',
      speed: 'Fast DC',
      renewable: '90%',
      left: '20%',
      top: '24%',
      isAlt: false,
    },
    {
      id: 'st_02',
      name: 'Adani Total Power Station',
      city: 'SG Highway, Ahmedabad',
      distance: '3.4 km',
      price: '₹10.10',
      available: '2 / 4',
      speed: 'Ultra Fast DC',
      renewable: '65%',
      left: '60%',
      top: '20%',
      isAlt: true,
    },
    {
      id: 'st_03',
      name: 'GIFT City Clean Charge',
      city: 'GIFT City, Gandhinagar',
      distance: '4.2 km',
      price: '₹8.80',
      available: '5 / 6',
      speed: 'Hyper Fast DC',
      renewable: '92%',
      left: '66%',
      top: '60%',
      isAlt: false,
    },
    {
      id: 'st_04',
      name: 'Prahlad Nagar Urban Bay',
      city: 'Prahlad Nagar, Ahmedabad',
      distance: '2.5 km',
      price: '₹9.20',
      available: '3 / 4',
      speed: 'Fast DC',
      renewable: '75%',
      left: '30%',
      top: '72%',
      isAlt: true,
    },
  ];

  const selectedStation =
    stationsOnMap.find((s) => s.id === selectedStationId) || stationsOnMap[0];

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileStatusBar />
        <MobileTopNav title="Find Charging Stations" onBack={() => navigate('/')} />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-2 flex flex-col flex-1 gap-2 overflow-hidden">
          {/* Search location field matching attachment */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location"
              className="app-field w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-green-200 text-slate-800 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter pills row matching attachment */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('nearby')}
              className={`pill-tag sky transition-all cursor-pointer ${
                activeFilter === 'nearby' ? 'ring-2 ring-blue-400 font-bold' : 'opacity-80'
              }`}
            >
              Nearby
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              className={`pill-tag green transition-all cursor-pointer ${
                activeFilter === 'available' ? 'ring-2 ring-emerald-500 font-bold' : 'opacity-80'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setActiveFilter('fast')}
              className={`pill-tag amber transition-all cursor-pointer ${
                activeFilter === 'fast' ? 'ring-2 ring-amber-400 font-bold' : 'opacity-80'
              }`}
            >
              Fast DC
            </button>
          </div>

          {/* Simulated Mobile Map matching attachment styling */}
          <div
            className="relative flex-1 rounded-2xl overflow-hidden border border-green-200 min-h-[220px]"
            style={{
              background: `
                radial-gradient(circle at 25% 30%, #DCEBDF 0, transparent 40%),
                radial-gradient(circle at 75% 70%, #DCE6EF 0, transparent 45%),
                #F4F6EE
              `,
            }}
          >
            {/* Roads vector drawing */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="80" x2="320" y2="120" stroke="#FFFFFF" strokeWidth="9" />
              <line x1="140" y1="0" x2="160" y2="300" stroke="#FFFFFF" strokeWidth="8" />
              <path d="M 40 240 Q 150 160 280 220" fill="none" stroke="#FFFFFF" strokeWidth="7" />
              <path d="M 200 40 Q 240 140 300 240" fill="none" stroke="#D3E4ED" strokeWidth="16" />
            </svg>

            {/* User Location Pin (.pin.me at 46%, 52%) */}
            <span
              className="app-pin me animate-pulse"
              style={{ left: '46%', top: '52%' }}
              title="You are here"
            />

            {/* Station Pins matching attachment positions */}
            {stationsOnMap.map((station) => (
              <button
                key={station.id}
                onClick={() => setSelectedStationId(station.id)}
                className={`app-pin ${station.isAlt ? 'alt' : ''} ${
                  selectedStationId === station.id ? 'ring-2 ring-white scale-110 z-20' : ''
                }`}
                style={{ left: station.left, top: station.top }}
              >
                {station.price}
              </button>
            ))}
          </div>

          {/* Active Station Preview Card with Link to Station Details (Screen 05) */}
          <div
            onClick={() => navigate(`/station/${selectedStation.id}`)}
            className="app-card py-2.5 px-3 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all border border-green-200 bg-white shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-green-100 text-emerald-800 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-xs text-slate-900">
                  {selectedStation.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {selectedStation.city} · {selectedStation.distance} · {selectedStation.available} bays
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-right">
              <div>
                <div className="font-heading font-extrabold text-xs text-emerald-700">
                  {selectedStation.price}
                </div>
                <div className="text-[9.5px] text-emerald-700 font-semibold">
                  {selectedStation.renewable} green
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Screen 04: Map active) */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileMapScreen;
