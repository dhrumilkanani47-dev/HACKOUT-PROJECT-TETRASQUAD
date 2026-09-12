import React from 'react';
import { useDrawer } from '../../context/DrawerContext';
import { Menu } from 'lucide-react';

export const HamburgerButton = ({ className = '', light = false }) => {
  const { toggleDrawer } = useDrawer();

  return (
    <button
      onClick={toggleDrawer}
      aria-label="Open Navigation Menu"
      className={`p-2 rounded-xl transition-all active:scale-90 flex items-center justify-center ${
        light
          ? 'text-white hover:bg-white/10'
          : 'bg-slate-100/90 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/60'
      } ${className}`}
    >
      <Menu className="w-4 h-4" strokeWidth={2.4} />
    </button>
  );
};

export default HamburgerButton;
