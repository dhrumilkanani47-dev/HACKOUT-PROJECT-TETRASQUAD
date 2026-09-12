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
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-card dark:bg-[#121815] select-none">
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
                  : 'bg-[#F1EFE6] dark:bg-neutral-800 text-ink-soft dark:text-ink-muted'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`pill-tag ${
                filter === 'month'
                  ? 'green'
                  : 'bg-[#F1EFE6] dark:bg-neutral-800 text-ink-soft dark:text-ink-muted'
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
              className="app-card cursor-pointer hover:border-forest/40 transition-colors py-2.5 px-3"
            >
              <div className="flex justify-between items-center">
                <b className="font-heading text-[12.5px] text-ink dark:text-white">
                  {session.station}
                </b>
                <span className="text-[10px] text-ink-soft dark:text-ink-muted">
                  {session.date}
                </span>
              </div>
              <div className="text-[10.5px] text-ink-soft dark:text-ink-muted mt-1 flex items-center justify-between">
                <span>
                  {session.kwh} · {session.cost} ·{' '}
                  <span className="text-forest-600 dark:text-emerald-400 font-medium">
                    {session.renewable}
                  </span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-soft/60" />
              </div>
            </div>
          ))}

          {/* Month Summary Bar */}
          <div className="p-3 rounded-xl bg-paper dark:bg-paper-cardDark border border-line text-xs flex justify-between items-center mt-1">
            <div>
              <div className="text-[9.5px] text-ink-soft dark:text-ink-muted uppercase">
                September Total
              </div>
              <b className="font-heading text-sm text-forest dark:text-emerald-400">
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
