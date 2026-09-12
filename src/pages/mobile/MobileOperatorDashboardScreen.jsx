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
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav
          title="Operator Dashboard"
          onBack={() => navigate('/')}
          rightAction={
            <button
              onClick={handleSwitchToDriver}
              className="text-[10px] font-heading font-bold text-emerald-900 bg-green-100 border border-green-200 px-2 py-0.5 rounded-md hover:bg-green-200 transition-colors"
            >
              Driver Mode
            </button>
          }
        />

        {/* Content Container matching Screen 12 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          {/* Station Name Subtitle */}
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Station: <b className="text-slate-900 font-heading font-bold">GreenHub Supercharger</b>
            </span>
            <span className="pill-tag green text-[9.5px]">
              ● Online & Serving
            </span>
          </div>

          {/* Row 1: Sessions & Revenue matching attachment */}
          <div className="grid grid-cols-2 gap-2">
            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Sessions</div>
              <b className="font-heading text-[15px] text-slate-900">128</b>
            </div>

            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Revenue</div>
              <b className="font-heading text-[15px] text-slate-900">₹24,580</b>
            </div>
          </div>

          {/* Row 2: Renewable & Chargers matching attachment */}
          <div className="grid grid-cols-2 gap-2">
            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Renewable</div>
              <b className="font-heading text-[15px] text-emerald-700 font-bold">78%</b>
            </div>

            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Chargers</div>
              <b className="font-heading text-[15px] text-slate-900">{activeChargers} / 6</b>
            </div>
          </div>

          {/* Session Trend Bar Chart matching attachment */}
          <div className="app-card py-3 px-3 bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9.5px] text-slate-500 font-medium">
                Session trend (Past 7 Days)
              </span>
              <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18% peak utilization
              </span>
            </div>

            {/* 7-Bar Chart matching attachment styles */}
            <div className="flex items-end gap-2 h-16 pt-2 pb-1 border-b border-green-100">
              {/* Bar 1: 40% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '40%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Mon</span>
              </div>

              {/* Bar 2: 55% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '55%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Tue</span>
              </div>

              {/* Bar 3: 30% low */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-green-100 rounded-t-sm transition-all" style={{ height: '30%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Wed</span>
              </div>

              {/* Bar 4: 70% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '70%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Thu</span>
              </div>

              {/* Bar 5: 60% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '60%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Fri</span>
              </div>

              {/* Bar 6: 35% low */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-green-100 rounded-t-sm transition-all" style={{ height: '35%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Sat</span>
              </div>

              {/* Bar 7: 48% */}
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: '48%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Sun</span>
              </div>
            </div>
          </div>

          {/* Operator Fast Control: Tariff Margin */}
          <div className="app-card py-2.5 px-3 bg-white">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10.5px] font-heading font-semibold text-slate-600">
                Station Base Rate:
              </span>
              <b className="font-heading text-emerald-800 font-extrabold">
                ₹{stationTariff.toFixed(2)}/kWh
              </b>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStationTariff((p) => +(p - 0.2).toFixed(2))}
                className="app-btn ghost flex-1 py-1.5 text-xs font-bold"
              >
                − ₹0.20
              </button>
              <button
                onClick={() => setStationTariff((p) => +(p + 0.2).toFixed(2))}
                className="app-btn outline flex-1 py-1.5 text-xs font-bold"
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
