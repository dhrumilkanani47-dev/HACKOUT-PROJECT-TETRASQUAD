import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { Leaf, ChevronRight, Download, Fuel } from 'lucide-react';

export const MobileHistoryScreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const historySessions = [
    {
      id: 'h_01',
      station: 'GreenHub Solar Supercharger',
      address: 'Infocity Circle, Gandhinagar',
      date: '12 Sep',
      kwh: '24.5 kWh',
      pricePerKwh: '₹18.00/kWh',
      totalCost: '₹441.00',
      renewablePct: 92,
      energySource: 'Solar + Wind mix',
      score: 94,
    },
    {
      id: 'h_02',
      station: 'SunCharge Station',
      address: 'SG Highway, Ahmedabad',
      date: '5 Sep',
      kwh: '18.2 kWh',
      pricePerKwh: '₹18.02/kWh',
      totalCost: '₹328.00',
      renewablePct: 78,
      energySource: 'Solar + Grid mix',
      score: 88,
    },
    {
      id: 'h_03',
      station: 'EcoVolt Station',
      address: 'GIFT City Boulevard, Gandhinagar',
      date: '28 Aug',
      kwh: '32.0 kWh',
      pricePerKwh: '₹18.00/kWh',
      totalCost: '₹576.00',
      renewablePct: 65,
      energySource: 'Wind + Grid mix',
      score: 79,
    },
    {
      id: 'h_04',
      station: 'Jio-bp pulse Express',
      address: 'SG Highway, Ahmedabad',
      date: '19 Aug',
      kwh: '21.0 kWh',
      pricePerKwh: '₹18.00/kWh',
      totalCost: '₹378.00',
      renewablePct: 84,
      energySource: 'Solar + Wind mix',
      score: 90,
    },
  ];

  const displayedSessions =
    filter === 'month' ? historySessions.slice(0, 2) : historySessions;

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Charging History" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 10 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          {/* Filter Pills Row matching attachment */}
          <div className="flex gap-2 mb-1">
            <button
              onClick={() => setFilter('all')}
              className={`pill-tag ${
                filter === 'all'
                  ? 'green'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`pill-tag ${
                filter === 'month'
                  ? 'green'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              This month
            </button>
          </div>

          {/* History Cards matching attachment */}
          {displayedSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => navigate(`/history/${session.id}`)}
              className="app-card cursor-pointer hover:border-emerald-400 transition-colors py-2.5 px-3 bg-white"
            >
              <div className="flex justify-between items-center">
                <b className="font-heading text-[13px] text-slate-900 font-bold">
                  {session.station}
                </b>
                <span className="text-[10px] text-slate-400">
                  {session.date}
                </span>
              </div>
              <div className="text-[10.5px] text-slate-500 mt-1 flex items-center justify-between">
                <span>{session.kwh} · {session.pricePerKwh}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-green-100 text-center">
                <div className="rounded-lg bg-slate-50 py-1.5">
                  <div className="text-[8px] text-slate-400 uppercase">Total cost</div>
                  <b className="text-[10px] text-slate-800">{session.totalCost}</b>
                </div>
                <div className="rounded-lg bg-emerald-50 py-1.5">
                  <div className="text-[8px] text-emerald-700 uppercase flex items-center justify-center gap-0.5"><Leaf className="w-2.5 h-2.5" /> Renewable</div>
                  <b className="text-[10px] text-emerald-800">{session.renewablePct}%</b>
                </div>
                <div className="rounded-lg bg-slate-100 py-1.5">
                  <div className="text-[8px] text-slate-500 uppercase flex items-center justify-center gap-0.5"><Fuel className="w-2.5 h-2.5" /> Fossil</div>
                  <b className="text-[10px] text-slate-700">{100 - session.renewablePct}%</b>
                </div>
              </div>
            </div>
          ))}

          {/* Month Summary Bar */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-xs flex justify-between items-center mt-1">
            <div>
              <div className="text-[9.5px] text-slate-500 uppercase font-semibold">
                September Total
              </div>
              <b className="font-heading text-sm text-emerald-900 font-extrabold">
                42.7 kWh (₹769)
              </b>
            </div>
            <span className="pill-tag green text-[9px]">
              86% Avg Clean
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Screen 10: History active) */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileHistoryScreen;
