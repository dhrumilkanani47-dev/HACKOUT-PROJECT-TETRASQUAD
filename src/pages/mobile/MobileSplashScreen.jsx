import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';

export const MobileSplashScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/'), 400);
          return 100;
        }
        return prev + 25;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate('/')}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between select-none cursor-pointer overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50"
    >
      {/* Mobile status bar */}
      <MobileStatusBar dark={false} />

      {/* Centered Brand Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-slate-800 -mt-8">
        {/* Brand Mark Icon */}
        <div className="w-[74px] h-[74px] rounded-[22px] bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200 border border-green-200 mb-4 animate-pulse-slow">
          <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
            <path d="M13 2 L4 14h6l-1 8 9-12h-6z" />
          </svg>
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="font-heading font-extrabold text-2xl tracking-tight text-slate-900">
          EV GreenCharge
        </h1>
        <p className="text-xs text-emerald-800 font-semibold mt-1 font-sans">
          Charge Green. Drive Clean.
        </p>

        {/* Animated Progress Bar */}
        <div className="w-[120px] h-1.5 bg-green-100 rounded-full mt-8 overflow-hidden border border-green-200">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[10px] text-slate-500 mt-3 font-mono">
          Syncing Gujarat SLDC Telemetry...
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="pb-6 text-center text-[10px] text-slate-400">
        Tap anywhere to skip • Screen 01
      </div>
    </div>
  );
};

export default MobileSplashScreen;
