import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileAppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const screens = [
    { name: 'Splash Screen', path: '/splash', match: (p) => p === '/splash' },
    ...(!isAuthenticated ? [{ name: 'Login & Role Select', path: '/login', match: (p) => p === '/login' || p === '/signup' }] : []),
    { name: 'Home Dashboard', path: '/', match: (p) => p === '/' || p === '/dashboard' },
    { name: 'Map & Stations', path: '/map', match: (p) => p.startsWith('/map') },
    { name: 'Station Details', path: '/station/st_01', match: (p) => p.startsWith('/station') },
    { name: 'Smart Charging AI', path: '/smart-charge', match: (p) => p.startsWith('/smart-charge') },
    { name: 'Live Charging Session', path: '/charging', match: (p) => p.startsWith('/charging') },
    { name: 'Price & Green Score', path: '/price-score', match: (p) => p.startsWith('/price-score') },
    { name: 'Charging History', path: '/history', match: (p) => p.startsWith('/history') || p.startsWith('/activity') },
    { name: 'Notifications & Alerts', path: '/notifications', match: (p) => p.startsWith('/notifications') },
    ...(isAuthenticated && user?.role === 'operator' ? [{ name: 'Operator Dashboard', path: '/operator', match: (p) => p.startsWith('/operator') }] : []),
    { name: 'Profile & Settings', path: '/profile', match: (p) => p.startsWith('/profile') || p.startsWith('/settings') },
  ];

  return (
    <div className="min-h-screen w-full bg-[#080D1A] flex flex-row justify-start items-stretch antialiased selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden">
      {/* Left Sidebar matching attachment */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-[#0A101D] border-r border-slate-800/80 flex-col p-4 select-none shrink-0 h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 py-3 mb-2 text-slate-400 font-heading font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-200">APP SCREENS</span>
        </div>

        {/* Screen List */}
        <div className="flex flex-col gap-1.5">
          {screens.map((screen) => {
            const isActive = screen.match(location.pathname);
            return (
              <button
                key={screen.num}
                onClick={() => navigate(screen.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left font-heading ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-[13px] truncate">{screen.name}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-500'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area: Centered Mobile Phone Application */}
      <main className="flex-1 h-screen flex items-center justify-center p-0 md:p-6 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(8,13,26,0))]">
        <div className="w-full md:max-w-[395px] h-screen md:h-[844px] bg-slate-950 md:rounded-[44px] p-0 md:p-[8px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_8px_#1e293b] md:border md:border-slate-800 relative flex flex-col transition-all overflow-hidden">
          {/* Mobile Screen Container */}
          <div className="w-full h-full bg-white md:rounded-[36px] overflow-y-auto overflow-x-hidden flex flex-col justify-start relative select-none">
            {children}

            {/* Home Indicator Bar */}
            <div className="w-full py-1.5 flex justify-center items-center shrink-0 bg-white/95">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileAppShell;


