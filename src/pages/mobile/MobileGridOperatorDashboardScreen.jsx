import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BatteryCharging, Clock3, Leaf, MapPin, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';

const MetricCard = ({ icon: Icon, label, value, tone = 'emerald', onClick }) => (
  <div
    onClick={onClick}
    className="app-card p-3 bg-white hover:border-emerald-400 hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
    role="button"
    tabIndex={0}
  >
    <div className="flex justify-between items-center">
      <Icon className={`w-4 h-4 ${tone === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`} />
      <span className="text-[9px] text-slate-400 group-hover:text-emerald-600 font-bold">›</span>
    </div>
    <span className="block text-[9px] text-slate-500 mt-1">{label}</span>
    <b className="font-heading text-lg text-slate-900 group-hover:text-emerald-800">{value}</b>
  </div>
);

export const MobileGridOperatorDashboardScreen = () => {
  const navigate = useNavigate();
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
        <MobileTopNav title="Grid Operations" showBack={false} />

        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-500">Grid control center</p>
              <h2 className="font-heading text-[17px] font-extrabold text-slate-900">Balance demand. Power cleaner.</h2>
            </div>
            <span
              onClick={() => triggerToast('Gujarat SLDC Grid frequency is 50.02 Hz (Nominal)')}
              className="pill-tag green cursor-pointer hover:brightness-95 transition-all"
            >
              ● Grid stable
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              icon={Activity}
              label="Grid Demand"
              value="1,240 MW"
              onClick={() => navigate('/price-score')}
            />
            <MetricCard
              icon={BatteryCharging}
              label="EV Charging Demand"
              value="420 kW"
              tone="amber"
              onClick={() => navigate('/operator')}
            />
            <MetricCard
              icon={Leaf}
              label="Renewable Generation"
              value="68%"
              onClick={() => navigate('/price-score')}
            />
            <MetricCard
              icon={Zap}
              label="Grid Stress"
              value="Moderate"
              tone="amber"
              onClick={() => navigate('/notifications')}
            />
          </div>

          <div
            onClick={() => navigate('/price-score')}
            className="app-card p-3 bg-emerald-50 border border-emerald-200 hover:border-emerald-300 hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer group"
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-950 font-semibold group-hover:text-emerald-700">
                Renewable availability
              </span>
              <b className="font-heading text-lg text-emerald-800">High at 1 PM</b>
            </div>
            <div className="flex items-end gap-1.5 h-14 mt-2">
              {[42, 48, 56, 76, 92, 84, 64, 45].map((height, index) => (
                <div key={index} className="flex-1 h-full flex items-end">
                  <div className="w-full bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600" style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-[9px] text-emerald-800">
              <span>Encourage EV charging from 11 AM to 3 PM when renewable supply is strongest.</span>
              <span className="font-bold underline">Details ›</span>
            </div>
          </div>

          <div className="app-card p-3 bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <b className="text-[11px] text-amber-950">Peak period detected: 6 PM - 10 PM</b>
            </div>
            <p className="text-[9px] text-amber-900 mt-1.5">Solar generation is low while demand and EV charging load are high.</p>
            <button
              onClick={() => navigate('/notifications')}
              className="app-btn outline w-full mt-2 py-1.5 text-[10px] font-bold border-amber-300 text-amber-900 active:scale-98 cursor-pointer"
            >
              Configure grid alert
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => navigate('/notifications')}
              className="app-card p-3 bg-white hover:border-amber-400 hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              <div className="flex justify-between items-center">
                <Clock3 className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] text-emerald-600 font-bold group-hover:underline">View ›</span>
              </div>
              <span className="block text-[9px] text-slate-500 mt-1">High-demand periods</span>
              <b className="font-heading text-base text-slate-900 group-hover:text-emerald-800">3 alerts</b>
            </div>

            <div
              onClick={() => navigate('/map')}
              className="app-card p-3 bg-white hover:border-emerald-400 hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
              role="button"
              tabIndex={0}
            >
              <div className="flex justify-between items-center">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] text-emerald-600 font-bold group-hover:underline">Map ›</span>
              </div>
              <span className="block text-[9px] text-slate-500 mt-1">Stations monitored</span>
              <b className="font-heading text-base text-slate-900 group-hover:text-emerald-800">50 Hubs</b>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomBar />
    </div>
  );
};

export default MobileGridOperatorDashboardScreen;
