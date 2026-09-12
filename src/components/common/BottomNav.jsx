import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, Car, Activity, User, Sparkles } from 'lucide-react';

export const BottomNav = () => {
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/map', label: 'Map', icon: MapPin },
    { to: '/vehicles', label: 'My EV', icon: Car },
    { to: '/activity', label: 'Activity', icon: Activity },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-forest/10 dark:border-white/10 safe-pb shadow-lg">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full min-h-[44px] min-w-[44px] px-1 transition-all rounded-xl ${
                  isActive
                    ? 'text-forest dark:text-emerald-400 font-semibold'
                    : 'text-ink-soft dark:text-ink-muted hover:text-forest dark:hover:text-emerald-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'bg-forest-100 dark:bg-forest-950/70 text-forest dark:text-emerald-400' : ''}`}>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.3 : 1.8} />
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-forest dark:bg-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10.5px] mt-0.5 font-heading tracking-tight leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
