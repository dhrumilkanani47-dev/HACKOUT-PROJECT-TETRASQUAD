import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Maximize2, Layers } from 'lucide-react';
import { WhyThisPriceModal } from './WhyThisPriceModal';

export const MobileAppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'frame' (desktop phone mockup) or 'full' (full width mobile)
  const [viewMode, setViewMode] = useState(() => {
    return window.innerWidth < 640 ? 'full' : 'frame';
  });

  const [showDirectWhyPrice, setShowDirectWhyPrice] = useState(false);

  // Ensure dark class is never applied
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-start transition-colors duration-200">
      {/* Top Floating Control Toolbar (Desktop & Tablet) */}
      <header className="w-full max-w-5xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none text-xs z-30">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M13 2 L4 14h6l-1 8 9-12h-6z" />
            </svg>
          </div>
          <div>
            <div className="font-heading font-bold text-sm text-emerald-600 leading-none">
              EV GreenCharge Mobile
            </div>
            <div className="text-[10px] text-slate-500">
              13 Screens & Features Prototype
            </div>
          </div>
        </div>

        {/* Center: Quick Screen Jump Selector */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-heading font-semibold text-slate-500 hidden sm:inline">
            Screen Jump:
          </span>
          <select
            value={location.pathname}
            onChange={(e) => handleSelectScreen(e.target.value)}
            className="bg-transparent font-heading font-bold text-xs text-emerald-600 outline-none cursor-pointer max-w-[190px] sm:max-w-[260px] truncate"
          >
            {screens.map((s) => (
              <option key={s.num} value={s.path} className="text-slate-700 bg-white">
                {s.num}. {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Controls: View Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Frame vs Full width toggle (hidden on small phones) */}
          <button
            onClick={() => setViewMode(viewMode === 'frame' ? 'full' : 'frame')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/90 border border-green-200 text-slate-700 font-heading font-semibold text-[11px] shadow-sm hover:bg-green-50 transition-colors"
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
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6">
        {viewMode === 'frame' ? (
          /* Phone Frame Container — White/Light chassis */
          <div className="relative my-auto">
            {/* Phone Hardware Chassis */}
            <div
              className="w-[360px] sm:w-[380px] h-[720px] sm:h-[750px] bg-white rounded-[44px] p-3 shadow-2xl transition-all duration-300 relative border-[3px] border-green-200"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.08)',
              }}
            >
              {/* Left Side Buttons (Volume) */}
              <div className="absolute -left-[5px] top-24 w-[3px] h-8 bg-green-300 rounded-l-sm" />
              <div className="absolute -left-[5px] top-36 w-[3px] h-8 bg-green-300 rounded-l-sm" />
              {/* Right Side Button (Power) */}
              <div className="absolute -right-[5px] top-28 w-[3px] h-12 bg-green-300 rounded-r-sm" />

              {/* Inner Mobile Screen */}
              <div className="w-full h-full bg-white rounded-[34px] overflow-hidden flex flex-col relative shadow-inner border border-gray-100">
                <div className="flex-1 flex flex-col overflow-y-auto">
                  {children}
                </div>

                {/* Bottom Home Indicator Bar */}
                <div className="w-24 h-1 bg-slate-300 rounded-full mx-auto my-1.5 shrink-0" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Mobile Responsive View */
          <div className="w-full max-w-[440px] min-h-screen sm:min-h-[720px] bg-white sm:rounded-3xl sm:border sm:border-green-200 sm:shadow-xl overflow-hidden flex flex-col relative">
            <div className="flex-1 flex flex-col overflow-y-auto">
              {children}
            </div>
            {/* Bottom Safe area indicator */}
            <div className="w-24 h-1 bg-slate-200 rounded-full mx-auto my-1 shrink-0" />
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
