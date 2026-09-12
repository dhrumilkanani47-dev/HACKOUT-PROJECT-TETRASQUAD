import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { Sliders, Zap, TrendingUp, Radio, Leaf, Activity, Clock3, ChevronRight, Settings } from 'lucide-react';

export const MobileOperatorDashboardScreen = () => {
  const navigate = useNavigate();
  const [stationTariff, setStationTariff] = useState(8.40);
  const [activeChargers] = useState(23);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none relative">
      {/* Toast feedback */}
      {toastMsg && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-slate-900/90 text-white text-[11px] rounded-full shadow-lg font-heading font-medium animate-fade-in backdrop-blur-xs">
          {toastMsg}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Operator Dashboard" showBack={false} />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          {/* Top 4 Metrics Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => navigate('/manage-stations')}
              className="app-card p-3 bg-white hover:border-emerald-400 hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] text-emerald-600 font-bold group-hover:underline">Manage ›</span>
              </div>
              <span className="block text-[9px] text-slate-500 mt-1">Charging Stations</span>
              <b className="font-heading text-lg text-slate-900 group-hover:text-emerald-800">50 Hubs</b>
            </div>

            <div
              onClick={() => navigate('/operator')}
              className="app-card p-3 bg-white hover:border-emerald-400 hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] text-emerald-600 font-bold group-hover:underline">Live ›</span>
              </div>
              <span className="block text-[9px] text-slate-500 mt-1">Active Charging</span>
              <b className="font-heading text-lg text-slate-900 group-hover:text-emerald-800">23 Active</b>
            </div>

            <div
              onClick={() => navigate('/notifications')}
              className="app-card p-3 bg-white hover:border-amber-400 hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <Clock3 className="w-4 h-4 text-amber-600" />
                <span className="text-[9px] text-amber-600 font-bold group-hover:underline">Alerts ›</span>
              </div>
              <span className="block text-[9px] text-slate-500 mt-1">Scheduled Sessions</span>
              <b className="font-heading text-lg text-slate-900 group-hover:text-amber-700">41 Queued</b>
            </div>

            <div
              onClick={() => navigate('/price-score')}
              className="app-card p-3 bg-white hover:border-emerald-400 hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] text-emerald-600 font-bold group-hover:underline">SLDC ›</span>
              </div>
              <span className="block text-[9px] text-slate-500 mt-1">Renewable Share</span>
              <b className="font-heading text-lg text-emerald-700 group-hover:text-emerald-800">72% Green</b>
            </div>
          </div>

          {/* Average Green Score Banner */}
          <div
            onClick={() => navigate('/price-score')}
            className="app-card p-3 bg-emerald-50 border border-emerald-200 hover:border-emerald-300 hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer group"
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-900 font-semibold group-hover:text-emerald-700">
                Average Network Green Score
              </span>
              <b className="text-emerald-800 font-heading text-lg">86</b>
            </div>
            <div className="h-1.5 bg-emerald-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full w-[86%] bg-emerald-500 rounded-full transition-all duration-500" />
            </div>
            <div className="flex items-center justify-between mt-2 text-[9px] text-emerald-800">
              <span>Renewable availability is highest from 11 AM to 3 PM.</span>
              <span className="font-bold underline">View Report ›</span>
            </div>
          </div>

          {/* Energy Cost & Peak Load Row */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => triggerToast("Today's Net Energy Cost: ₹18,450 (SLDC merit-order)")}
              className="app-card p-3 bg-white hover:border-emerald-300 transition-all active:scale-[0.98] cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <span className="text-[9px] text-slate-500">Today's Energy Cost</span>
              <b className="block font-heading text-base text-slate-900 mt-1">₹18,450</b>
              <span className="text-[8.5px] text-emerald-600 font-medium mt-0.5 block">−14% vs avg</span>
            </div>

            <div
              onClick={() => triggerToast('Current Peak Load: 420 kW across 50 hubs')}
              className="app-card p-3 bg-white hover:border-emerald-300 transition-all active:scale-[0.98] cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <span className="text-[9px] text-slate-500">Peak Load</span>
              <b className="block font-heading text-base text-slate-900 mt-1">420 kW</b>
              <span className="text-[8.5px] text-sky-600 font-medium mt-0.5 block">68% capacity</span>
            </div>
          </div>

          {/* Station Name Subtitle */}
          <div
            onClick={() => navigate('/manage-stations')}
            className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
          >
            <span className="text-[11px] text-slate-600 font-medium">
              Station: <b className="text-slate-900 font-heading font-bold">GreenHub Supercharger</b>
            </span>
            <span className="pill-tag green text-[9.5px]">
              ● Online & Serving
            </span>
          </div>

          {/* Row 1: Sessions & Revenue */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => navigate('/history')}
              className="app-card text-center py-2.5 bg-white hover:border-emerald-400 transition-all active:scale-[0.98] cursor-pointer group"
            >
              <div className="text-[9px] text-slate-500 font-medium">Completed Sessions</div>
              <b className="font-heading text-[15px] text-slate-900 group-hover:text-emerald-800">128</b>
            </div>

            <div
              onClick={() => triggerToast('Total Daily Revenue: ₹24,580')}
              className="app-card text-center py-2.5 bg-white hover:border-emerald-400 transition-all active:scale-[0.98] cursor-pointer group"
            >
              <div className="text-[9px] text-slate-500 font-medium">Today's Revenue</div>
              <b className="font-heading text-[15px] text-slate-900 group-hover:text-emerald-800">₹24,580</b>
            </div>
          </div>

          {/* Row 2: Renewable & Chargers */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => navigate('/price-score')}
              className="app-card text-center py-2.5 bg-white hover:border-emerald-400 transition-all active:scale-[0.98] cursor-pointer group"
            >
              <div className="text-[9px] text-slate-500 font-medium">Renewable Share</div>
              <b className="font-heading text-[15px] text-emerald-700 font-bold group-hover:text-emerald-800">78%</b>
            </div>

            <div
              onClick={() => navigate('/manage-stations')}
              className="app-card text-center py-2.5 bg-white hover:border-emerald-400 transition-all active:scale-[0.98] cursor-pointer group"
            >
              <div className="text-[9px] text-slate-500 font-medium">Active Chargers</div>
              <b className="font-heading text-[15px] text-slate-900 group-hover:text-emerald-800">{activeChargers} / 50</b>
            </div>
          </div>

          {/* Session Trend Bar Chart */}
          <div
            onClick={() => navigate('/price-score')}
            className="app-card py-3 px-3 bg-white hover:border-emerald-300 transition-all cursor-pointer group"
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9.5px] text-slate-500 font-medium">
                Session trend (Past 7 Days)
              </span>
              <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 group-hover:underline">
                <TrendingUp className="w-3 h-3" /> +18% peak utilization
              </span>
            </div>

            {/* 7-Bar Chart */}
            <div className="flex items-end gap-2 h-16 pt-2 pb-1 border-b border-green-100">
              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all hover:brightness-110" style={{ height: '40%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Mon</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all hover:brightness-110" style={{ height: '55%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Tue</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-green-200 rounded-t-sm transition-all hover:brightness-110" style={{ height: '30%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Wed</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all hover:brightness-110" style={{ height: '70%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Thu</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all hover:brightness-110" style={{ height: '60%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Fri</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-green-200 rounded-t-sm transition-all hover:brightness-110" style={{ height: '35%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Sat</span>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-emerald-500 rounded-t-sm transition-all hover:brightness-110" style={{ height: '48%' }} />
                <span className="text-[7.5px] text-slate-400 font-mono">Sun</span>
              </div>
            </div>
          </div>

          {/* Operator Fast Control: Tariff Margin */}
          <div className="app-card py-2.5 px-3 bg-white border border-green-200">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10.5px] font-heading font-semibold text-slate-600">
                Station Base Rate:
              </span>
              <b className="font-heading text-emerald-800 font-extrabold text-sm">
                ₹{stationTariff.toFixed(2)}/kWh
              </b>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setStationTariff((p) => +(p - 0.2).toFixed(2));
                  triggerToast(`Base rate adjusted to ₹${(stationTariff - 0.2).toFixed(2)}/kWh`);
                }}
                className="app-btn ghost flex-1 py-1.5 text-xs font-bold active:scale-95 cursor-pointer"
              >
                − ₹0.20
              </button>
              <button
                onClick={() => {
                  setStationTariff((p) => +(p + 0.2).toFixed(2));
                  triggerToast(`Base rate adjusted to ₹${(stationTariff + 0.2).toFixed(2)}/kWh`);
                }}
                className="app-btn outline flex-1 py-1.5 text-xs font-bold active:scale-95 cursor-pointer"
              >
                + ₹0.20
              </button>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomBar />
    </div>
  );
};

export default MobileOperatorDashboardScreen;
