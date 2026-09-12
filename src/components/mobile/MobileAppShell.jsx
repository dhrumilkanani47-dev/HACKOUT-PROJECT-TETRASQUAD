import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Maximize2, Moon, Sun, Layers } from 'lucide-react';
import { WhyThisPriceModal } from './WhyThisPriceModal';

export const MobileAppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'frame' (desktop phone mockup) or 'full' (full width mobile)
  const [viewMode, setViewMode] = useState(() => {
    return window.innerWidth < 640 ? 'full' : 'frame';
  });

  const [isDark, setIsDark] = useState(false);
  const [showDirectWhyPrice, setShowDirectWhyPrice] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const screens = [
    { num: '01', name: 'Splash Screen', path: '/splash' },
    { num: '02', name: 'Login / Sign Up', path: '/login' },
    { num: '03', name: 'Home / Dashboard', path: '/' },
    { num: '04', name: 'Map & Stations', path: '/map' },
    { num: '05', name: 'Station Details', path: '/station/st_01' },
    { num: '06', name: '"Why this price?"', path: '__why_price__' },
    { num: '07', name: 'Smart Charging', path: '/smart-charge' },
    { num: '08', name: 'Charging Session', path: '/charging' },
    { num: '09', name: 'Price & Green Score', path: '/price-score' },
    { num: '10', name: 'Charging History', path: '/history' },
    { num: '11', name: 'Notifications & Alerts', path: '/notifications' },
    { num: '12', name: 'Operator Dashboard', path: '/operator' },
    { num: '13', name: 'Profile & Settings', path: '/profile' },
  ];

  const handleSelectScreen = (path) => {
    if (path === '__why_price__') {
      setShowDirectWhyPrice(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE8DD] dark:bg-[#070B09] flex flex-col items-center justify-start transition-colors duration-200">
      {/* Top Floating Control Toolbar (Desktop & Tablet) */}
      <header className="w-full max-w-5xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none text-xs z-30">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-forest text-white flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M13 2 L4 14h6l-1 8 9-12h-6z" />
            </svg>
          </div>
          <div>
            <div className="font-heading font-bold text-sm text-forest dark:text-emerald-400 leading-none">
              EV GreenCharge Mobile
            </div>
            <div className="text-[10px] text-ink-soft dark:text-ink-muted">
              13 Screens & Features Prototype
            </div>
          </div>
        </div>

        {/* Center: Quick Screen Jump Selector */}
        <div className="flex items-center gap-1.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-forest/15 dark:border-white/10 shadow-xs">
          <Layers className="w-3.5 h-3.5 text-forest dark:text-emerald-400" />
          <span className="text-[11px] font-heading font-semibold text-ink-soft dark:text-ink-muted hidden sm:inline">
            Screen Jump:
          </span>
          <select
            value={location.pathname}
            onChange={(e) => handleSelectScreen(e.target.value)}
            className="bg-transparent font-heading font-bold text-xs text-forest dark:text-emerald-400 outline-none cursor-pointer max-w-[190px] sm:max-w-[260px] truncate"
          >
            {screens.map((s) => (
              <option key={s.num} value={s.path} className="text-ink dark:text-white bg-white dark:bg-neutral-900">
                {s.num}. {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Controls: View Mode & Theme Toggles */}
        <div className="flex items-center gap-2">
          {/* Frame vs Full width toggle (hidden on small phones) */}
          <button
            onClick={() => setViewMode(viewMode === 'frame' ? 'full' : 'frame')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-forest/15 dark:border-white/10 text-ink dark:text-white font-heading font-semibold text-[11px] shadow-xs hover:bg-forest/5"
            title="Toggle device frame"
          >
            {viewMode === 'frame' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-forest/15 dark:border-white/10 text-ink dark:text-white hover:text-forest shadow-xs"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4 text-forest" />}
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6">
        {viewMode === 'frame' ? (
          /* Phone Frame Container */
          <div className="relative my-auto">
            {/* Phone Hardware Chassis */}
            <div
              className="w-[360px] sm:w-[380px] h-[720px] sm:h-[750px] bg-[#0E1512] rounded-[44px] p-3 shadow-2xl transition-all duration-300 relative border-[3px] border-[#22332B]"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              {/* Left Side Buttons (Volume) */}
              <div className="absolute -left-[5px] top-24 w-[3px] h-8 bg-[#2A3F35] rounded-l-sm" />
              <div className="absolute -left-[5px] top-36 w-[3px] h-8 bg-[#2A3F35] rounded-l-sm" />
              {/* Right Side Button (Power) */}
              <div className="absolute -right-[5px] top-28 w-[3px] h-12 bg-[#2A3F35] rounded-r-sm" />

              {/* Inner Mobile Screen */}
              <div className="w-full h-full bg-card dark:bg-[#121815] rounded-[34px] overflow-hidden flex flex-col relative shadow-inner">
                <div className="flex-1 flex flex-col overflow-y-auto">
                  {children}
                </div>

                {/* Bottom Home Indicator Bar */}
                <div className="w-24 h-1 bg-ink/25 dark:bg-white/30 rounded-full mx-auto my-1.5 shrink-0" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Mobile Responsive View */
          <div className="w-full max-w-[440px] min-h-screen sm:min-h-[720px] bg-card dark:bg-[#121815] sm:rounded-3xl sm:border sm:border-forest/15 sm:shadow-xl overflow-hidden flex flex-col relative">
            <div className="flex-1 flex flex-col overflow-y-auto">
              {children}
            </div>
            {/* Bottom Safe area indicator */}
            <div className="w-24 h-1 bg-ink/20 dark:bg-white/20 rounded-full mx-auto my-1 shrink-0" />
          </div>
        )}
      </main>

      {/* Direct Trigger for Screen 06 ("Why this price?") from toolbar */}
      <WhyThisPriceModal
        isOpen={showDirectWhyPrice}
        onClose={() => setShowDirectWhyPrice(false)}
        price={8.40}
      />
    </div>
  );
};

export default MobileAppShell;
