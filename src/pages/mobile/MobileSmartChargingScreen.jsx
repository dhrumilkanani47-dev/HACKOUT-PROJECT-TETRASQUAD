import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { CheckCircle2, Clock, Sun, AlertTriangle } from 'lucide-react';

export const MobileSmartChargingScreen = () => {
  const navigate = useNavigate();
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = () => {
    setScheduled(true);
    setTimeout(() => {
      navigate('/charging');
    }, 1200);
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Smart Charging" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 07 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* Card 1: Best window matching attachment */}
          <div className="app-card border-2 border-emerald-300 bg-white">
            <span className="pill-tag green">
              🟢 Best window
            </span>
            <div className="font-heading font-extrabold text-[17px] text-slate-900 mt-2">
              2:00 – 4:00 PM
            </div>

            <div className="mt-2 space-y-1 text-xs">
              <div className="app-list-row">
                <span className="text-slate-600 font-medium">Estimated price</span>
                <b className="font-heading text-slate-900">₹6.50/kWh</b>
              </div>
              <div className="app-list-row">
                <span className="text-slate-600 font-medium">Renewable share</span>
                <b className="font-heading text-emerald-700">89%</b>
              </div>
              <div className="app-list-row">
                <span className="text-slate-600 font-medium">Estimated saving</span>
                <b className="font-heading text-emerald-700">₹72</b>
              </div>
            </div>
          </div>

          {/* Card 2: Avoid window matching attachment */}
          <div className="app-card border-2 border-red-200 bg-red-50/20">
            <span className="pill-tag coal">
              🔴 Avoid
            </span>
            <div className="font-heading font-bold text-[14px] text-red-700 mt-2">
              7:00 – 9:00 PM · ₹11.40/kWh
            </div>
            <div className="text-[10.5px] text-slate-600 mt-1 leading-normal">
              High demand, low solar, high thermal generation
            </div>
          </div>

          {/* Grid Context info */}
          <div className="p-3 rounded-xl bg-slate-50 border border-green-100 text-xs">
            <div className="text-[10px] text-slate-700 font-heading font-semibold uppercase tracking-wider mb-1">
              AI Dispatch Rationale:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Gujarat solar generation peaks between 1:30 PM and 4:00 PM with over 4,200 MW available, lowering spot energy procurement rates.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button matching attachment */}
      <div className="p-4 pt-0">
        <button
          onClick={handleSchedule}
          disabled={scheduled}
          className="app-btn w-full text-sm font-bold shadow-md transition-all"
        >
          {scheduled ? (
            <span className="flex items-center gap-1.5 text-emerald-950 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-800" /> Slot Scheduled at 2:00 PM!
            </span>
          ) : (
            'Schedule Charging'
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileSmartChargingScreen;
