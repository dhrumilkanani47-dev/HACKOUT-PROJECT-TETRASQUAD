import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, History, User, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const currentPath = location.pathname;

  const isHome = currentPath === '/' || currentPath === '/dashboard';
  const isMap = currentPath.startsWith('/map');
  const isBookings = currentPath.startsWith('/driver/bookings') || currentPath.startsWith('/book-slot');
  const isHistory = currentPath.startsWith('/history') || currentPath.startsWith('/activity');
  const isProfile = currentPath.startsWith('/profile') || currentPath.startsWith('/settings');
  const isGridOperator = user?.role === 'grid_operator';
  const isOperator = user?.role === 'operator';

  const driverTabs = [
    { label: 'Home', path: '/', active: isHome, icon: Home },
    { label: 'Map', path: '/map', active: isMap, icon: MapPin },
    { label: 'Book Slot', path: '/driver/bookings', active: isBookings, icon: CalendarCheck },
    { label: 'History', path: '/history', active: isHistory, icon: History },
    { label: 'Profile', path: '/profile', active: isProfile, icon: User },
  ];
  const roleTabs = [
    { label: 'Home', path: '/', active: isHome, icon: Home },
    { label: 'Map', path: '/map', active: isMap, icon: MapPin },
    ...(isGridOperator ? [{ label: 'Alerts', path: '/notifications', active: currentPath.startsWith('/notifications'), icon: History }] : []),
    ...(isOperator ? [{ label: 'Requests', path: '/operator/bookings', active: currentPath.startsWith('/operator/bookings'), icon: CalendarCheck }] : []),
    { label: 'Profile', path: '/profile', active: isProfile, icon: User },
  ];
  const tabs = isGridOperator || isOperator ? roleTabs : driverTabs;

  return (
    <nav className="flex justify-around items-center pt-2 pb-2 px-3 border-t border-green-100 bg-white/95 backdrop-blur-md select-none text-[10.5px] font-heading font-semibold text-slate-500 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] shrink-0 z-30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-95 ${
              tab.active
                ? 'text-emerald-700 font-extrabold'
                : 'hover:text-emerald-600 text-slate-500'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                tab.active
                  ? 'bg-emerald-100/80 text-emerald-800 shadow-xs ring-1 ring-emerald-300/60'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={tab.active ? 2.5 : 2} />
            </div>
            <span className="tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileBottomBar;

