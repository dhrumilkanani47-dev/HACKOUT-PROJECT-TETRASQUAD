import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

/**
 * Mobile status bar with live clock and standard mobile indicators.
 */
export const MobileStatusBar = ({ dark = false, showPill = true }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-5 pt-2 pb-1.5 flex items-center justify-between select-none shrink-0 z-30 transition-colors ${
        dark ? 'text-white' : 'text-slate-800'
      }`}
    >
      {/* Time */}
      <span className="text-[12.5px] font-heading font-extrabold tracking-tight">
        {time || '09:41'}
      </span>

      {/* Dynamic Island / Camera Notch simulator in frame */}
      {showPill && (
        <div className="hidden sm:flex items-center justify-center">
          <div className="w-20 h-4 bg-slate-900 rounded-full shadow-inner flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700/60 mr-1" />
          </div>
        </div>
      )}

      {/* Status Icons */}
      <div className="flex items-center gap-1.5 text-xs">
        <Signal className="w-3.5 h-3.5" strokeWidth={2.4} />
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.4} />
        <div className="flex items-center gap-0.5">
          <BatteryMedium className="w-4 h-4 text-emerald-600" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
};

export default MobileStatusBar;

