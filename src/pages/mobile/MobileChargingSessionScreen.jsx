import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { Zap, Activity, Sun, Wind, Leaf, Clock3 } from 'lucide-react';

export const MobileChargingSessionScreen = () => {
  const navigate = useNavigate();
  const [soc, setSoc] = useState(68);
  const [delivered, setDelivered] = useState(24.5);
  const [cost, setCost] = useState(167);

  // Subtle live ticking simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDelivered((prev) => +(prev + 0.05).toFixed(2));
      setCost((prev) => Math.round(prev + 0.35));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleStopCharging = () => {
    // Navigate to Screen 09 (Price & Green Score)
    navigate('/price-score');
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Charging in Progress" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 08 */}
        <div className="px-4 pt-3 pb-5 flex flex-col items-center gap-3">
          {/* Station tag */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Connected to GreenHub Fast DC (Bay 03)
          </div>

          {/* Circular Progress Ring matching attachment */}
          <div
            className="app-ring shadow-soft"
            style={{ '--pct': soc }}
          >
            <div className="hole">
              <b className="leading-tight text-emerald-700">{soc}%</b>
              <span className="text-slate-500">charged</span>
            </div>
          </div>

          {/* Delivered & Live Price Row matching attachment */}
          <div className="grid grid-cols-2 gap-2 w-full mt-1">
            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Delivered</div>
              <b className="font-heading text-[13px] text-slate-900">
                {delivered.toFixed(1)} kWh
              </b>
            </div>

            <div className="app-card text-center py-2.5 bg-white">
              <div className="text-[9px] text-slate-500 font-medium">Live price</div>
              <b className="font-heading text-[13px] text-emerald-700 font-bold">
                ₹6.80/kWh
              </b>
            </div>
          </div>

          {/* Estimated Cost So Far Card matching attachment */}
          <div className="app-card text-center w-full py-2.5 bg-white">
            <div className="text-[9px] text-slate-500 font-medium">
              Estimated cost so far
            </div>
            <b className="font-heading text-[18px] text-slate-900 font-extrabold">
              ₹{cost}
            </b>
          </div>

          {/* Renewable Energy Timing and Mix */}
          <div className="w-full app-card p-3 bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span className="text-[11px] font-heading font-extrabold text-emerald-950">
                  Renewable Energy Progress
                </span>
              </div>
              <span className="text-[9px] text-emerald-700 font-bold">Live mix</span>
            </div>

            <div className="flex h-2 rounded-full overflow-hidden bg-slate-200 mb-2">
              <div className="w-[68%] bg-emerald-500" title="68% renewable energy" />
              <div className="w-[32%] bg-slate-500" title="32% fossil fuel energy" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9.5px] mb-3">
              <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Renewable energy: 68%
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Fossil fuel energy: 32%
              </div>
            </div>

            <div className="text-[9px] text-slate-600 font-semibold mb-1.5">Energy availability timeline</div>
            <div className="relative h-8 rounded-lg bg-white border border-emerald-100 overflow-hidden">
              <div className="absolute left-[46%] right-[26%] top-0 bottom-0 bg-amber-200/80" />
              <div className="absolute left-[4%] right-[72%] top-0 bottom-0 bg-sky-200/80" />
              <div className="relative h-full flex items-end justify-between px-2 pb-1 text-[8px] text-slate-500 font-mono">
                <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-start gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                <div><b className="block text-[9.5px] text-slate-800">Peak solar</b><span className="text-[9px] text-slate-500">11 AM - 3 PM</span></div>
              </div>
              <div className="flex items-start gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-600 mt-0.5" />
                <div><b className="block text-[9.5px] text-slate-800">Peak wind</b><span className="text-[9px] text-slate-500">1 AM - 5 AM</span></div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-emerald-200 text-[10px] text-emerald-900 font-bold">
              <Clock3 className="w-3.5 h-3.5" /> Best recommended charging time: 1 PM - 3 PM
            </div>
          </div>
        </div>
      </div>

      {/* Stop Charging Action Button matching attachment */}
      <div className="p-4 pt-0">
        <button
          onClick={handleStopCharging}
          className="app-btn outline w-full text-sm font-bold border-red-400 text-red-600 hover:bg-red-50"
        >
          Stop Charging
        </button>
      </div>
    </div>
  );
};

export default MobileChargingSessionScreen;
