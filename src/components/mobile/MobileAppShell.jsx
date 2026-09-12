import React, { useEffect } from 'react';
import { NavigationDrawer } from '../navigation/NavigationDrawer';

export const MobileAppShell = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#080D1A] flex items-center justify-center p-0 md:p-6 antialiased selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(8,13,26,0))]">
      {/* Mobile Phone Screen Viewport */}
      <div className="w-full md:max-w-[395px] h-screen md:h-[844px] bg-slate-950 md:rounded-[44px] p-0 md:p-[8px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_8px_#1e293b] md:border md:border-slate-800 relative flex flex-col transition-all overflow-hidden">
        {/* Inner App Container with Drawer Overlay */}
        <div className="w-full h-full bg-white md:rounded-[36px] overflow-y-auto overflow-x-hidden flex flex-col justify-start relative select-none">
          {/* Main App Page Content */}
          {children}

          {/* Navigation Drawer & Overlay (Slides from left on hamburger tap) */}
          <NavigationDrawer />

          {/* Home Indicator Bar */}
          <div className="w-full py-1.5 flex justify-center items-center shrink-0 bg-white/95">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppShell;
