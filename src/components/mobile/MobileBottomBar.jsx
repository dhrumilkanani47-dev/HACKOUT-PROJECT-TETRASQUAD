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
    <div className="flex justify-around items-center pt-2 pb-3 px-2 border-t border-forest/10 dark:border-white/10 bg-paper/95 dark:bg-paper-dark/95 backdrop-blur-md select-none text-[10px] font-heading font-semibold text-ink-soft dark:text-ink-muted">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all active:scale-95 ${
              tab.active
                ? 'text-forest dark:text-emerald-400 font-bold'
                : 'hover:text-forest dark:hover:text-emerald-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                tab.active
                  ? 'bg-forest/10 dark:bg-emerald-500/20 text-forest dark:text-emerald-400'
                  : 'text-ink-soft dark:text-ink-muted'
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
