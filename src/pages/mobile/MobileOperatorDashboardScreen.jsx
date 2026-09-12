import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { useAuth } from '../../context/AuthContext';
import { Sliders, RefreshCw, Zap, TrendingUp } from 'lucide-react';

export const MobileOperatorDashboardScreen = () => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [stationTariff, setStationTariff] = useState(8.40);
  const [activeChargers, setActiveChargers] = useState(4);

  const handleSwitchToDriver = () => {
    updateProfile({ role: 'driver' });
    navigate('/');
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-card dark:bg-[#121815] select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav
          title="Operator Dashboard"
          onBack={() => navigate('/')}
          rightAction={
            <button
              onClick={handleSwitchToDriver}
              className="text-[10px] font-heading font-semibold text-forest dark:text-emerald-400 bg-forest/10 px-2 py-0.5 rounded-md"
            >
              Driver Mode
            </button>
          }
        />

        {/* Content Container matching Screen 12 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          {/* Station Name Subtitle */}
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-ink-soft dark:text-ink-muted">
              Station: <b className="text-ink dark:text-white font-heading">GreenHub Supercharger</b>
            </span>
            <span className="pill-tag green text-[9.5px]">
              ● Online & Serving
            </span>
          </div>

          {/* Row 1: Sessions & Revenue matching attachment */}
          <div className="grid grid-cols-2 gap-2">
            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Sessions</div>
              <b className="font-heading text-[15px] text-ink dark:text-white">128</b>
            </div>

            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Revenue</div>
              <b className="font-heading text-[15px] text-ink dark:text-white">₹24,580</b>
            </div>
          </div>

          {/* Row 2: Renewable & Chargers matching attachment */}
          <div className="grid grid-cols-2 gap-2">
            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Renewable</div>
              <b className="font-heading text-[15px] text-forest-600 dark:text-emerald-400">78%</b>
            </div>

            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Chargers</div>
              <b className="font-heading text-[15px] text-ink dark:text-white">{activeChargers} / 6</b>
            </div>
          </div>

          {/* Session Trend Bar Chart matching attachment */}
          <div className="app-card py-3 px-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9.5px] text-ink-soft dark:text-ink-muted">
                Session trend (Past 7 Days)
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18% peak utilization
              </span>
            </div>

            {/* 7-Bar Chart matching attachment styles */}
            <div className="flex items-end gap-2 h-16 pt-2 pb-1 border-b border-forest/10 dark:border-white/10">
              {/* Bar 1: 40% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-leaf rounded-t-sm transition-all" style={{ height: '40%' }} />
                <span className="text-[7.5px] text-ink-soft font-mono">Mon</span>
              </div>

              {/* Bar 2: 55% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-leaf rounded-t-sm transition-all" style={{ height: '55%' }} />
                <span className="text-[7.5px] text-ink-soft font-mono">Tue</span>
              </div>

              {/* Bar 3: 30% low */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#DCEAD8] dark:bg-emerald-950/60 rounded-t-sm transition-all" style={{ height: '30%' }} />
                <span className="text-[7.5px] text-ink-soft font-mono">Wed</span>
              </div>

              {/* Bar 4: 70% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-leaf rounded-t-sm transition-all" style={{ height: '70%' }} />
                <span className="text-[7.5px] text-ink-soft font-mono">Thu</span>
              </div>

              {/* Bar 5: 60% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-leaf rounded-t-sm transition-all" style={{ height: '60%' }} />
                <span className="text-[7.5px] text-ink-soft font-mono">Fri</span>
              </div>

              {/* Bar 6: 35% low */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-[#DCEAD8] dark:bg-emerald-950/60 rounded-t-sm transition-all" style={{ height: '35%' }} />
                <span className="text-[7.5px] text-ink-soft font-mono">Sat</span>
              </div>

              {/* Bar 7: 48% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-leaf rounded-t-sm transition-all" style={{ height: '48%' }} />
                <span className="text-[7.5px] text-ink-soft font-mono">Sun</span>
              </div>
            </div>
          </div>

          {/* Operator Fast Control: Tariff Margin */}
          <div className="app-card py-2.5 px-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10.5px] font-heading font-semibold text-ink-soft">
                Station Base Rate:
              </span>
              <b className="font-heading text-forest dark:text-emerald-400">
                ₹{stationTariff.toFixed(2)}/kWh
              </b>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStationTariff((p) => +(p - 0.2).toFixed(2))}
                className="app-btn ghost flex-1 py-1.5 text-xs"
              >
                − ₹0.20
              </button>
              <button
                onClick={() => setStationTariff((p) => +(p + 0.2).toFixed(2))}
                className="app-btn outline flex-1 py-1.5 text-xs"
              >
                + ₹0.20
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOperatorDashboardScreen;
