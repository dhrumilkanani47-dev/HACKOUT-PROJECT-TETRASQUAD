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
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between select-none cursor-pointer overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #0F3D2E, #155C41)' }}
    >
      {/* Dark status bar */}
      <MobileStatusBar dark={true} />

      {/* Centered Brand Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-white -mt-8">
        {/* Brand Mark Icon */}
        <div className="w-[74px] h-[74px] rounded-[22px] bg-white/15 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 mb-4 animate-pulse-slow">
          <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
            <path d="M13 2 L4 14h6l-1 8 9-12h-6z" />
          </svg>
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="font-heading font-bold text-xl tracking-tight text-white">
          EV GreenCharge
        </h1>
        <p className="text-xs text-[#CFE7DA] mt-1 font-sans">
          Charge Green. Drive Clean.
        </p>

        {/* Animated Amber Progress Bar */}
        <div className="w-[120px] h-1 bg-white/25 rounded-full mt-8 overflow-hidden">
          <div
            className="h-full bg-amber transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[10px] text-white/60 mt-3 font-mono">
          Syncing Gujarat SLDC Telemetry...
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="pb-6 text-center text-[10px] text-white/50">
        Tap anywhere to skip • Screen 01
      </div>
    </div>
  );
};

export default MobileSplashScreen;
