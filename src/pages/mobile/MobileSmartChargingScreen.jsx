import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import {
  Sparkles,
  Zap,
  Clock,
  Navigation,
  CheckCircle2,
  Check,
  TrendingDown,
  Leaf,
  ShieldCheck,
  BatteryCharging,
  Sliders,
  MapPin,
} from 'lucide-react';

export const MobileSmartChargingScreen = () => {
  const navigate = useNavigate();
  const [scheduled, setScheduled] = useState(false);
  const [batteryCurrent, setBatteryCurrent] = useState(28);
  const [batteryTarget, setBatteryTarget] = useState(80);
  const [departureTime, setDepartureTime] = useState('7:30 PM');

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

        {/* Main Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* High Priority AI Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/15 relative overflow-hidden">
            <div className="flex items-start gap-2.5 relative z-10">
              <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-emerald-100">
                    AI Recommendation
                  </span>
                  <span className="text-[9.5px] text-emerald-200 font-semibold">
                    ● High Priority
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-[13.5px] leading-snug text-white">
                  “Charge here now — 18% cheaper, 12 min less waiting, and better for your battery.”
                </h3>
              </div>
            </div>
          </div>

          {/* User Vehicle State & Target Summary */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-green-200">
            <div className="text-center">
              <div className="text-[9px] text-slate-500 font-medium">Your Battery</div>
              <div className="font-heading font-extrabold text-[13px] text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <BatteryCharging className="w-3.5 h-3.5 text-amber-500" />
                {batteryCurrent}%
              </div>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="text-[9px] text-slate-500 font-medium">Target</div>
              <div className="font-heading font-extrabold text-[13px] text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                🎯 {batteryTarget}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-slate-500 font-medium">Departure</div>
              <div className="font-heading font-extrabold text-[13px] text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {departureTime}
              </div>
            </div>
          </div>

          {/* AI Recommended Station Card (Station A) */}
          <div className="app-card border-2 border-emerald-400 bg-white shadow-sm relative overflow-hidden">
            {/* Header / Title */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-heading font-extrabold text-slate-900">
                    Station A (GreenHub Supercharger)
                  </span>
                </div>
                {/* Distance From Location */}
                <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><b>3.2 km away</b> from your location (~8 min drive)</span>
                </div>
              </div>
              <span className="pill-tag green text-[9.5px]">
                ● Optimal Choice
              </span>
            </div>

            {/* 5 Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-dashed border-green-200">
              <div className="bg-slate-50 p-2 rounded-xl text-center">
                <div className="text-[9px] text-slate-500 flex items-center justify-center gap-0.5">
                  <Zap className="w-3 h-3 text-amber-500" /> Speed
                </div>
                <div className="font-heading font-extrabold text-xs text-slate-900 mt-0.5">
                  150 kW
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-xl text-center">
                <div className="text-[9px] text-slate-500 flex items-center justify-center gap-0.5">
                  <Clock className="w-3 h-3 text-blue-500" /> Time
                </div>
                <div className="font-heading font-extrabold text-xs text-slate-900 mt-0.5">
                  24 min
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-xl text-center">
                <div className="text-[9px] text-slate-500 flex items-center justify-center gap-0.5">
                  💰 Cost
                </div>
                <div className="font-heading font-extrabold text-xs text-emerald-700 mt-0.5">
                  ₹186
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-emerald-50/70 p-2 rounded-xl text-center border border-emerald-200/60">
                <div className="text-[9px] text-emerald-800 flex items-center justify-center gap-0.5 font-medium">
                  <Leaf className="w-3 h-3 text-emerald-600" /> Green Score
                </div>
                <div className="font-heading font-extrabold text-xs text-emerald-900 mt-0.5">
                  92 / 100
                </div>
              </div>

              <div className="bg-blue-50/70 p-2 rounded-xl text-center border border-blue-200/60">
                <div className="text-[9px] text-blue-800 flex items-center justify-center gap-0.5 font-medium">
                  <Navigation className="w-3 h-3 text-blue-600" /> Distance
                </div>
                <div className="font-heading font-extrabold text-xs text-blue-900 mt-0.5">
                  🚗 3.2 km
                </div>
              </div>
            </div>

            {/* "Recommended because" Checklist */}
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <div className="text-[10.5px] font-heading font-bold text-slate-800 mb-1.5">
                Recommended because:
              </div>
              <div className="space-y-1 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><b>Lowest total cost</b> (₹6.50/kWh spot tariff)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><b>Shortest waiting time</b> (0 queue vs 12 min avg)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><b>High renewable energy</b> (92% Gujarat solar & wind)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><b>Battery preservation curve</b> prevents cell degradation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Window Analysis */}
          <div className="grid grid-cols-2 gap-2">
            {/* Best Window Card */}
            <div className="app-card border border-emerald-300 bg-emerald-50/20 py-2.5 px-3">
              <span className="pill-tag green text-[9px]">
                🟢 Best window
              </span>
              <div className="font-heading font-bold text-xs text-slate-900 mt-1.5">
                2:00 – 4:00 PM
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                ₹6.50/kWh • 89% Solar
              </div>
            </div>

            {/* Avoid Window Card */}
            <div className="app-card border border-red-200 bg-red-50/20 py-2.5 px-3">
              <span className="pill-tag coal text-[9px]">
                🔴 Avoid
              </span>
              <div className="font-heading font-bold text-xs text-red-700 mt-1.5">
                7:00 – 9:00 PM
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">
                ₹11.40/kWh • Peak load
              </div>
            </div>
          </div>

          {/* AI Factors Considered Footer */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-green-100 text-[10px] text-slate-600 leading-relaxed">
            <b className="text-slate-800 font-heading">AI Factors Evaluated:</b> Current Battery (28%), Target (80%), Departure (7:30 PM), Charger Speed (150 kW), Distance (3.2 km), Waiting Queue (0 min), Gujarat Grid Telemetry.
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleSchedule}
          disabled={scheduled}
          className="app-btn w-full text-sm font-bold shadow-md transition-all"
        >
          {scheduled ? (
            <span className="flex items-center gap-1.5 text-emerald-950 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-800" /> Slot Reserved at Station A!
            </span>
          ) : (
            'Reserve AI Recommended Slot'
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileSmartChargingScreen;

