import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BatteryCharging, Clock3, Leaf, MapPin, TrendingUp, Zap } from 'lucide-react';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';

const MetricCard = ({ icon: Icon, label, value, tone = 'emerald' }) => (
  <div className="app-card p-3 bg-white">
    <Icon className={`w-4 h-4 ${tone === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`} />
    <span className="block text-[9px] text-slate-500 mt-1">{label}</span>
    <b className="font-heading text-lg text-slate-900">{value}</b>
  </div>
);

export const MobileGridOperatorDashboardScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Grid Operations" showBack={false} />

        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-500">Grid control center</p>
              <h2 className="font-heading text-[17px] font-extrabold text-slate-900">Balance demand. Power cleaner.</h2>
            </div>
            <span className="pill-tag green">● Grid stable</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <MetricCard icon={Activity} label="Grid Demand" value="1,240 MW" />
            <MetricCard icon={BatteryCharging} label="EV Charging Demand" value="420 kW" tone="amber" />
            <MetricCard icon={Leaf} label="Renewable Generation" value="68%" />
            <MetricCard icon={Zap} label="Grid Stress" value="Moderate" tone="amber" />
          </div>

          <div className="app-card p-3 bg-emerald-50 border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-950 font-semibold">Renewable availability</span>
              <b className="font-heading text-lg text-emerald-800">High at 1 PM</b>
            </div>
            <div className="flex items-end gap-1.5 h-14 mt-2">
              {[42, 48, 56, 76, 92, 84, 64, 45].map((height, index) => (
                <div key={index} className="flex-1 h-full flex items-end">
                  <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
            <p className="text-[9px] text-emerald-800 mt-2">Encourage EV charging from 11 AM to 3 PM when renewable supply is strongest.</p>
          </div>

          <div className="app-card p-3 bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <b className="text-[11px] text-amber-950">Peak period detected: 6 PM - 10 PM</b>
            </div>
            <p className="text-[9px] text-amber-900 mt-1.5">Solar generation is low while demand and EV charging load are high.</p>
            <button onClick={() => navigate('/notifications')} className="app-btn outline w-full mt-2 py-1.5 text-[10px] font-bold border-amber-300 text-amber-900">
              Configure grid alert
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="app-card p-3 bg-white"><Clock3 className="w-4 h-4 text-emerald-600" /><span className="block text-[9px] text-slate-500 mt-1">High-demand periods</span><b className="font-heading text-base text-slate-900">3 alerts</b></div>
            <div className="app-card p-3 bg-white"><MapPin className="w-4 h-4 text-emerald-600" /><span className="block text-[9px] text-slate-500 mt-1">Stations monitored</span><b className="font-heading text-base text-slate-900">50</b></div>
          </div>
        </div>
      </div>
      <MobileBottomBar />
    </div>
  );
};

export default MobileGridOperatorDashboardScreen;
