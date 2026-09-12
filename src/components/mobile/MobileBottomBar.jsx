import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, History, User } from 'lucide-react';

export const MobileBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const isHome = currentPath === '/' || currentPath === '/dashboard';
  const isMap = currentPath.startsWith('/map');
  const isHistory = currentPath.startsWith('/history') || currentPath.startsWith('/activity');
  const isProfile = currentPath.startsWith('/profile') || currentPath.startsWith('/settings');

  const tabs = [
    { label: 'Home', path: '/', active: isHome, icon: Home },
    { label: 'Map', path: '/map', active: isMap, icon: MapPin },
    { label: 'History', path: '/history', active: isHistory, icon: History },
    { label: 'Profile', path: '/profile', active: isProfile, icon: User },
  ];

  return (
    <div className="flex justify-around items-center pt-2 pb-3 px-2 border-t border-green-200/80 bg-white/95 backdrop-blur-md select-none text-[10px] font-heading font-semibold text-slate-500">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all active:scale-95 ${
              tab.active
                ? 'text-emerald-800 font-extrabold'
                : 'hover:text-emerald-700 text-slate-500'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                tab.active
                  ? 'bg-green-100 text-emerald-800 border border-green-300 shadow-2xs'
                  : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={tab.active ? 2.5 : 2} />
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomBar;
