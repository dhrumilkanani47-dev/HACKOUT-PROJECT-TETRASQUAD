import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { useAuth } from '../../context/AuthContext';
import {
  Globe,
  Zap,
  Activity,
  BarChart3,
  SunMedium,
  Gauge,
  TrendingUp,
  Radio,
  Sliders,
  X,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const MobileGridOperatorDashboardScreen = () => {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  // Grid Operator Metrics as requested:
  // Grid Demand: 4.2 MW
  // Renewable Generation: 6.8 MW
  // EV Load: 1.1 MW
  const [gridDemand, setGridDemand] = useState(4.2); // MW
  const [renewableGen, setRenewableGen] = useState(6.8); // MW
  const [evLoad, setEvLoad] = useState(1.1); // MW
  const [activeModal, setActiveModal] = useState(null); // 'analytics' | 'forecast' | 'evload' | null

  // Renewable Availability Timeline:
  // 10 AM  ███████ (70%)
  // 12 PM  █████████ (90%)
  // 2 PM   ██████████ (100%)
  // 6 PM   ███ (30%)
  // 8 PM   ██ (20%)
  const availabilityTimeline = [
    { time: '10 AM', percent: 70, bar: '███████', power: '4.8 MW', type: 'Solar Rise' },
    { time: '12 PM', percent: 90, bar: '█████████', power: '6.2 MW', type: 'Peak Solar' },
    { time: '2 PM', percent: 100, bar: '██████████', power: '6.8 MW', type: 'Solar + Wind High' },
    { time: '6 PM', percent: 30, bar: '███', power: '2.1 MW', type: 'Dusk Wind' },
    { time: '8 PM', percent: 20, bar: '██', power: '1.4 MW', type: 'Base Wind' }
  ];

  const handleSwitchRole = (target) => {
    setRole(target);
    if (target === 'driver') navigate('/');
    if (target === 'operator') navigate('/operator');
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-slate-950 text-slate-100 select-none relative">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar dark />
        <MobileTopNav
          title="🌐 Grid Operator"
          dark
          onBack={() => navigate('/')}
          rightAction={
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSwitchRole('operator')}
                className="text-[9.5px] font-heading font-bold text-amber-300 bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded-md hover:bg-amber-900 transition-colors"
                title="Switch to Station Operator"
              >
                ⚡ CPO
              </button>
              <button
                onClick={() => handleSwitchRole('driver')}
                className="text-[9.5px] font-heading font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded-md hover:bg-emerald-900 transition-colors"
                title="Switch to Driver"
              >
                🚗 Driver
              </button>
            </div>
          }
        />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-6 flex flex-col gap-3">
          {/* Subheader / Status Pill */}
          <div className="flex justify-between items-center bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Regional Grid Control (SLDC)</span>
                <b className="text-[13px] text-white font-heading font-extrabold">Gujarat Western Subgrid</b>
              </div>
            </div>
            <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">
              Frequency: 50.02 Hz
            </span>
          </div>

          {/* Core Metrics: Grid Demand, Renewable Generation, EV Load */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Grid Demand: 4.2 MW */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-2 text-center">
              <div className="text-[9px] text-slate-400 font-medium">Grid Demand</div>
              <b className="font-heading text-[16px] text-sky-400 font-black tracking-tight">{gridDemand} MW</b>
              <div className="text-[8px] text-slate-500 mt-0.5">Base System</div>
            </div>

            {/* Renewable Generation: 6.8 MW */}
            <div className="bg-slate-900/80 border border-emerald-800/50 rounded-xl p-2 text-center bg-gradient-to-b from-emerald-950/30 to-slate-900/80">
              <div className="text-[9px] text-emerald-400 font-medium flex items-center justify-center gap-0.5">
                <SunMedium className="w-2.5 h-2.5" />
                <span>Renewable</span>
              </div>
              <b className="font-heading text-[16px] text-emerald-400 font-black tracking-tight">{renewableGen} MW</b>
              <div className="text-[8px] text-emerald-500 font-semibold mt-0.5">Surplus +2.6 MW</div>
            </div>

            {/* EV Load: 1.1 MW */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-2 text-center">
              <div className="text-[9px] text-slate-400 font-medium">EV Load</div>
              <b className="font-heading text-[16px] text-amber-400 font-black tracking-tight">{evLoad} MW</b>
              <div className="text-[8px] text-slate-500 mt-0.5">26.2% of Demand</div>
            </div>
          </div>

          {/* Renewable Availability Section with Visual Bars & Exact Times */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
            <div className="flex justify-between items-center mb-2.5 border-b border-slate-800/80 pb-2">
              <span className="font-heading font-extrabold text-[12px] text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                Renewable Availability
              </span>
              <span className="text-[9px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                Optimal Window: 10AM - 3PM
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {availabilityTimeline.map((item) => (
                <div key={item.time} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono font-bold text-slate-300 w-11">{item.time}</span>
                    <span className="text-[9.5px] text-slate-400 flex-1 text-center font-mono tracking-tighter">
                      {item.type}
                    </span>
                    <span className="font-mono font-semibold text-emerald-400 text-right w-14">
                      {item.power}
                    </span>
                  </div>

                  {/* Visual Bar matching ascii ██████ representation */}
                  <div className="w-full bg-slate-950 h-3 rounded-md overflow-hidden p-0.5 border border-slate-800 flex items-center">
                    <div
                      className={`h-full rounded transition-all duration-700 ${
                        item.percent >= 80
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : item.percent >= 50
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500'
                          : 'bg-gradient-to-r from-amber-600 to-amber-500'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons as requested: [Grid Analytics] [Renewable Forecast] [EV Load Monitoring] */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10.5px] font-heading font-bold text-slate-400">Dispatch Controls:</span>

            {/* [Grid Analytics] */}
            <button
              onClick={() => setActiveModal('analytics')}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-heading font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-white" />
                Grid Analytics
              </span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">Live Sync</span>
            </button>

            {/* [Renewable Forecast] */}
            <button
              onClick={() => setActiveModal('forecast')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-between shadow-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-white" />
                Renewable Forecast
              </span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">24h Radar</span>
            </button>

            {/* [EV Load Monitoring] */}
            <button
              onClick={() => setActiveModal('evload')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-heading font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                EV Load Monitoring
              </span>
              <span className="text-[10px] text-amber-400 font-semibold font-mono">1.1 MW Active</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Operator Bottom Bar */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Grid SLDC Supervisory Control • Secure Telemetry Online</span>
      </div>

      {/* Modal / Sheet for [Grid Analytics] */}
      {activeModal === 'analytics' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex flex-col justify-end backdrop-blur-xs">
          <div className="bg-slate-900 border-t border-slate-800 text-slate-100 rounded-t-2xl p-4 max-h-[85%] flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-white">Regional Grid Analytics</h3>
                <p className="text-[10px] text-slate-400">Substation & Feeder Real-Time Power Flow</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[9.5px] text-slate-400">Transmission Loss</div>
                <b className="font-heading text-sm text-emerald-400">2.1%</b>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[9.5px] text-slate-400">Power Factor</div>
                <b className="font-heading text-sm text-sky-400">0.98 lag</b>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="font-heading font-bold text-slate-200 block mb-1">Curtailment Mitigation</span>
              <p className="text-[10.5px] text-slate-400">
                Surplus solar energy at 2 PM (6.8 MW generation vs 4.2 MW demand) is redirected to smart EV fleet charging depots, avoiding 2.6 MW of solar curtailment.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
            >
              Close Analytics
            </button>
          </div>
        </div>
      )}

      {/* Modal / Sheet for [Renewable Forecast] */}
      {activeModal === 'forecast' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex flex-col justify-end backdrop-blur-xs">
          <div className="bg-slate-900 border-t border-slate-800 text-slate-100 rounded-t-2xl p-4 max-h-[85%] flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-white">Renewable Generation Forecast (24h)</h3>
                <p className="text-[10px] text-slate-400">Solar Irradiance + Wind Anemometer Forecasting</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-emerald-400 block">Tomorrow Midday Peak</span>
                  <span className="text-[9.5px] text-slate-400">Clear sky forecast, 980 W/m² DNI</span>
                </div>
                <b className="font-mono text-white text-sm">7.2 MW</b>
              </div>

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-amber-400 block">Evening Wind Support</span>
                  <span className="text-[9.5px] text-slate-400">Coastal wind gusts starting 6:30 PM</span>
                </div>
                <b className="font-mono text-white text-sm">2.4 MW</b>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Acknowledge Forecast
            </button>
          </div>
        </div>
      )}

      {/* Modal / Sheet for [EV Load Monitoring] */}
      {activeModal === 'evload' && (
        <div className="absolute inset-0 bg-black/70 z-50 flex flex-col justify-end backdrop-blur-xs">
          <div className="bg-slate-900 border-t border-slate-800 text-slate-100 rounded-t-2xl p-4 max-h-[85%] flex flex-col gap-3 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-white">EV Charging Load Telemetry</h3>
                <p className="text-[10px] text-slate-400">Live aggregated load from 50 EV stations</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[9.5px] text-slate-400">Current EV Load</div>
                <b className="font-heading text-sm text-amber-400">{evLoad} MW</b>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[9.5px] text-slate-400">Managed Curtailment Cap</div>
                <b className="font-heading text-sm text-emerald-400">1.8 MW max</b>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="font-heading font-bold text-slate-200 block mb-1">Automated Demand Response</span>
              <p className="text-[10.5px] text-slate-400">
                Dynamic price signaling sends lower tariffs during high solar generation to incentivize EV owners to charge now, smoothing regional grid peaks.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileGridOperatorDashboardScreen;
