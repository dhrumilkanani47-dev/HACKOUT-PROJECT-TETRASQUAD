import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { ArrowRight, Leaf, Award } from 'lucide-react';

export const MobilePriceGreenScoreScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-card dark:bg-[#121815] select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Price & Green Score" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 09 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* 24-Hour Price Curve Card matching attachment */}
          <div className="app-card">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9.5px] text-ink-soft dark:text-ink-muted">
                24-hour price (₹/kWh)
              </span>
              <span className="text-[9px] font-heading font-semibold text-forest dark:text-emerald-400">
                Low: ₹6.20 • Peak: ₹11.90
              </span>
            </div>

            {/* SVG Polyline Chart matching attachment coordinates */}
            <div className="py-2">
              <svg viewBox="0 0 220 60" className="w-full h-14 overflow-visible">
                {/* Subtle baseline */}
                <line x1="0" y1="56" x2="220" y2="56" stroke="currentColor" className="text-forest/10 dark:text-white/10" strokeWidth="1" strokeDasharray="3,3" />
                {/* Curve */}
                <polyline
                  points="0,30 20,34 40,38 60,26 80,14 100,22 120,10 140,26 160,44 180,20 200,8 220,24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-forest dark:text-emerald-400"
                />
                {/* Min price spot circle at 120, 10 */}
                <circle cx="120" cy="10" r="3.5" fill="#3FA66B" stroke="#ffffff" strokeWidth="1.5" />
                {/* Peak price spot circle at 200, 8 */}
                <circle cx="200" cy="8" r="3.5" fill="#B0472F" stroke="#ffffff" strokeWidth="1.5" />
              </svg>

              {/* Time ticks */}
              <div className="flex justify-between text-[8px] text-ink-soft dark:text-ink-muted font-mono mt-1 px-1">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>

          {/* Green Score Conic Ring matching attachment */}
          <div
            className="app-ring my-1 shadow-soft"
            style={{
              '--pct': 92,
              width: '82px',
              height: '82px',
            }}
          >
            <div
              className="hole"
              style={{ width: '64px', height: '64px' }}
            >
              <b className="text-[17px] leading-tight">92</b>
              <span className="text-[8.5px]">Green Score</span>
            </div>
          </div>

          {/* Energy Delivered & CO2 Avoided Row matching attachment */}
          <div className="grid grid-cols-2 gap-2">
            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Energy</div>
              <b className="font-heading text-[12.5px] text-ink dark:text-white">24.5 kWh</b>
            </div>

            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">CO₂ avoided</div>
              <b className="font-heading text-[12.5px] text-forest-600 dark:text-emerald-400">22.1 kg</b>
            </div>
          </div>

          {/* Environmental Achievement Badge */}
          <div className="p-2.5 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest/15 text-center text-xs">
            <span className="font-heading font-semibold text-forest dark:text-emerald-300 text-[11.5px] block">
              🌿 Clean Mobility Champion
            </span>
            <span className="text-[10px] text-ink-soft dark:text-ink-muted">
              You avoided equivalent to burning 9.8 litres of petrol.
            </span>
          </div>
        </div>
      </div>

      {/* Action to View History */}
      <div className="p-4 pt-0">
        <button
          onClick={() => navigate('/history')}
          className="app-btn w-full text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>View In Charging History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default MobilePriceGreenScoreScreen;
