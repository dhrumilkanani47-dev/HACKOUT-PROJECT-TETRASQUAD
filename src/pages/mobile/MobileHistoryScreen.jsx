import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { Leaf, ChevronRight, Download } from 'lucide-react';

export const MobileHistoryScreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const historySessions = [
    {
      id: 'h_01',
      station: 'GreenHub Station',
      date: '12 Sep',
      kwh: '24.5 kWh',
      cost: '₹441',
      renewable: '92% renewable',
      score: 94,
    },
    {
      id: 'h_02',
      station: 'SunCharge Station',
      date: '5 Sep',
      kwh: '18.2 kWh',
      cost: '₹328',
      renewable: '78% renewable',
      score: 88,
    },
    {
      id: 'h_03',
      station: 'EcoVolt Station',
      date: '28 Aug',
      kwh: '32.0 kWh',
      cost: '₹576',
      renewable: '65% renewable',
      score: 79,
    },
    {
      id: 'h_04',
      station: 'Jio-bp pulse Express',
      date: '19 Aug',
      kwh: '21.0 kWh',
      cost: '₹378',
      renewable: '84% renewable',
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
              onClick={() => navigate('/price-score')}
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
                <span>
                  {session.kwh} · {session.cost} ·{' '}
                  <span className="text-emerald-700 font-bold">
                    {session.renewable}
                  </span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
