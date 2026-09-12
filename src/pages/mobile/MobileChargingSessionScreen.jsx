import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { Zap, Activity } from 'lucide-react';

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

          {/* Environmental live stat */}
          <div className="w-full text-center text-[10.5px] text-emerald-900 font-heading font-bold bg-green-50 py-2 px-2.5 rounded-xl border border-green-200">
            🌱 92% Powered by Gujarat Solar & Wind Energy
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
