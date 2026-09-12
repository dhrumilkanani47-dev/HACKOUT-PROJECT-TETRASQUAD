import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDrawer } from '../../context/DrawerContext';
import { SidebarMenuItem } from './SidebarMenuItem';
import { Overlay } from './Overlay';
import { Layers, X } from 'lucide-react';

export const NavigationDrawer = () => {
  const { isOpen, closeDrawer } = useDrawer();
  const location = useLocation();
  const navigate = useNavigate();

  const screens = [
    { num: '01', name: 'Splash Screen', path: '/splash', match: (p) => p === '/splash' },
    { num: '02', name: 'Login & Role Select', path: '/login', match: (p) => p === '/login' || p === '/signup' },
    { num: '03', name: 'Home Dashboard', path: '/', match: (p) => p === '/' || p === '/dashboard' },
    { num: '04', name: 'Map & Stations', path: '/map', match: (p) => p.startsWith('/map') },
    { num: '05', name: 'Station Details', path: '/station/st_01', match: (p) => p.startsWith('/station') },
    { num: '07', name: 'Smart Charging AI', path: '/smart-charge', match: (p) => p.startsWith('/smart-charge') },
    { num: '08', name: 'Live Charging Session', path: '/charging', match: (p) => p.startsWith('/charging') },
    { num: '09', name: 'Price & Green Score', path: '/price-score', match: (p) => p.startsWith('/price-score') },
    { num: '10', name: 'Charging History', path: '/history', match: (p) => p.startsWith('/history') || p.startsWith('/activity') },
    { num: '11', name: 'Notifications & Alerts', path: '/notifications', match: (p) => p.startsWith('/notifications') },
    { num: '12', name: 'Operator Dashboard', path: '/operator', match: (p) => p.startsWith('/operator') },
    { num: '13', name: 'Profile & Settings', path: '/profile', match: (p) => p.startsWith('/profile') || p.startsWith('/settings') },
  ];

  const handleItemClick = (path) => {
    navigate(path);
    closeDrawer();
  };

  return (
    <>
      {/* Semi-transparent dark overlay */}
      <Overlay isOpen={isOpen} onClick={closeDrawer} />

      {/* Slide-out Navigation Drawer from Left */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-[290px] max-w-[85%] bg-[#0A101D] z-50 shadow-[10px_0_30px_rgba(0,0,0,0.7)] flex flex-col p-4 border-r border-slate-800/80 transform transition-transform duration-300 ease-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header matching reference image */}
        <div className="flex items-center justify-between px-2 pt-2 pb-3 mb-1 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5 text-slate-200 font-heading font-bold text-xs tracking-wider">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>APP SCREENS</span>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close Menu"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Screen Menu Items */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto pt-2 pb-4">
          {screens.map((screen) => {
            const isActive = screen.match(location.pathname);
            return (
              <SidebarMenuItem
                key={screen.num}
                num={screen.num}
                name={screen.name}
                isActive={isActive}
                onClick={() => handleItemClick(screen.path)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
