import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Monitor, Layers, ArrowLeft } from 'lucide-react';

export const MobileAppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deviceMode, setDeviceMode] = useState('framed'); // 'framed' | 'fluid'

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const screens = [
    { name: 'Splash Screen', path: '/splash' },
    { name: 'Login & Role Select', path: '/login' },
    { name: 'Home Dashboard', path: '/' },
    { name: 'Map & Stations', path: '/map' },
    { name: 'Station Details', path: '/station/st_01' },
    { name: 'Smart Charging AI', path: '/smart-charge' },
    { name: 'Live Charging Session', path: '/charging' },
    { name: 'Price & Green Score', path: '/price-score' },
    { name: 'Charging History', path: '/history' },
    { name: 'Notifications & Alerts', path: '/notifications' },
    { name: 'Operator Dashboard', path: '/operator' },
    { name: 'Profile & Settings', path: '/profile' },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] text-slate-800 flex flex-col justify-start items-center antialiased">
      {/* Desktop Preview Header (hidden on mobile devices) */}
      <header className="hidden sm:flex w-full max-w-5xl items-center justify-between px-6 py-3 border-b border-slate-800/80 text-white/90 text-xs backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-emerald-500/30">
            ⚡
          </div>
          <div>
            <div className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
              EV GreenCharge <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">Mobile App UI</span>
            </div>
          </div>
        </div>

        {/* Quick Screen Switcher for Testing */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/70 rounded-xl px-2.5 py-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={screens.find((s) => s.path === location.pathname)?.path || location.pathname}
              onChange={(e) => navigate(e.target.value)}
              className="bg-transparent text-white text-xs font-heading font-medium outline-none cursor-pointer pr-1"
            >
              {screens.map((s) => (
                <option key={s.path} value={s.path} className="bg-slate-900 text-white">
                  {s.name} ({s.path})
                </option>
              ))}
            </select>
          </div>

          {/* Device Mock Mode Toggle */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700/70 rounded-xl p-0.5">
            <button
              onClick={() => setDeviceMode('framed')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'framed'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Smartphone Device Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Device Frame</span>
            </button>
            <button
              onClick={() => setDeviceMode('fluid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                deviceMode === 'fluid'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Fluid Mobile Width"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Fluid</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Stage Container */}
      <main className="flex-1 w-full flex items-center justify-center sm:p-6 p-0 overflow-hidden">
        {deviceMode === 'framed' ? (
          /* Phone Simulator Frame */
          <div className="w-full sm:max-w-[395px] h-screen sm:h-[844px] bg-slate-950 sm:rounded-[50px] p-0 sm:p-[10px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_12px_#1e293b,0_0_0_14px_#334155] sm:border-[4px] sm:border-slate-800 relative flex flex-col transition-all">
            {/* Left Button Accents (visible on desktop) */}
            <div className="hidden sm:block absolute -left-[16px] top-[110px] w-[4px] h-[30px] bg-slate-700 rounded-l-md" />
            <div className="hidden sm:block absolute -left-[16px] top-[155px] w-[4px] h-[50px] bg-slate-700 rounded-l-md" />
            <div className="hidden sm:block absolute -left-[16px] top-[215px] w-[4px] h-[50px] bg-slate-700 rounded-l-md" />
            {/* Right Power Button Accent */}
            <div className="hidden sm:block absolute -right-[16px] top-[140px] w-[4px] h-[65px] bg-slate-700 rounded-r-md" />

            {/* Inner Phone Screen Content */}
            <div className="w-full h-full bg-white sm:rounded-[40px] overflow-y-auto overflow-x-hidden flex flex-col justify-start relative select-none">
              {children}
              
              {/* Home Indicator bar on mobile/frame */}
              <div className="w-full py-1.5 flex justify-center items-center shrink-0 bg-white/95">
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Fluid Mobile Screen Container */
          <div className="w-full max-w-md min-h-screen bg-white sm:shadow-2xl sm:rounded-2xl sm:border sm:border-slate-200 overflow-y-auto overflow-x-hidden flex flex-col justify-start relative select-none">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileAppShell;

