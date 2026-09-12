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
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-card dark:bg-[#121815] select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Charging in Progress" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 08 */}
        <div className="px-4 pt-3 pb-5 flex flex-col items-center gap-3">
          {/* Station tag */}
          <div className="text-[11px] text-ink-soft dark:text-ink-muted flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Connected to GreenHub Fast DC (Bay 03)
          </div>

          {/* Circular Progress Ring matching attachment */}
          <div
            className="app-ring shadow-soft"
            style={{ '--pct': soc }}
          >
            <div className="hole">
              <b className="leading-tight">{soc}%</b>
              <span>charged</span>
            </div>
          </div>

          {/* Delivered & Live Price Row matching attachment */}
          <div className="grid grid-cols-2 gap-2 w-full mt-1">
            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Delivered</div>
              <b className="font-heading text-[13px] text-ink dark:text-white">
                {delivered.toFixed(1)} kWh
              </b>
            </div>

            <div className="app-card text-center py-2.5">
              <div className="text-[9px] text-ink-soft dark:text-ink-muted">Live price</div>
              <b className="font-heading text-[13px] text-forest-600 dark:text-emerald-400">
                ₹6.80/kWh
              </b>
            </div>
          </div>

          {/* Estimated Cost So Far Card matching attachment */}
          <div className="app-card text-center w-full py-2.5">
            <div className="text-[9px] text-ink-soft dark:text-ink-muted">
              Estimated cost so far
            </div>
            <b className="font-heading text-[17px] text-ink dark:text-white">
              ₹{cost}
            </b>
          </div>

          {/* Environmental live stat */}
          <div className="w-full text-center text-[10px] text-forest dark:text-emerald-300 font-heading font-semibold bg-emerald-50 dark:bg-emerald-950/40 py-1.5 px-2 rounded-lg border border-emerald-500/20">
            🌱 92% Powered by Gujarat Solar & Wind Energy
          </div>
        </div>
      </div>

      {/* Stop Charging Action Button matching attachment */}
      <div className="p-4 pt-0">
        <button
          onClick={handleStopCharging}
          className="app-btn outline w-full text-sm font-bold border-coal text-coal dark:border-rose-400 dark:text-rose-400 hover:bg-coal/10"
        >
          Stop Charging
        </button>
      </div>
    </div>
  );
};

export default MobileChargingSessionScreen;
