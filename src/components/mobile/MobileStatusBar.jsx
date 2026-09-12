import React from 'react';

export const MobileStatusBar = ({ dark = false }) => {
  return (
    <div className={`flex justify-between items-center px-4 pt-2.5 pb-1 select-none text-[11px] font-semibold font-heading tracking-tight ${dark ? 'text-white' : 'text-ink dark:text-white'}`}>
      {/* Time */}
      <span className="font-bold">9:41</span>

      {/* Dynamic Island / Notch Pill hint */}
      <div className="w-16 h-3.5 bg-black/80 dark:bg-black rounded-full flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
        <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700" />
      </div>

      {/* Icons: Signal Bars, Battery */}
      <div className="flex items-center gap-1.5">
        {/* Cellular 4 bars */}
        <div className="flex items-end gap-[1.5px] h-2.5">
          <span className={`w-[2.5px] h-[3px] rounded-[0.5px] ${dark ? 'bg-white' : 'bg-ink dark:bg-white'}`} />
          <span className={`w-[2.5px] h-[5px] rounded-[0.5px] ${dark ? 'bg-white' : 'bg-ink dark:bg-white'}`} />
          <span className={`w-[2.5px] h-[7px] rounded-[0.5px] ${dark ? 'bg-white' : 'bg-ink dark:bg-white'}`} />
          <span className={`w-[2.5px] h-[9px] rounded-[0.5px] ${dark ? 'bg-white' : 'bg-ink dark:bg-white'}`} />
        </div>

        {/* Battery */}
        <div className={`relative w-[18px] h-[9px] border-[1.2px] rounded-[2.5px] p-[1px] flex items-center ${dark ? 'border-white' : 'border-ink dark:border-white'}`}>
          <div className={`h-full w-[70%] rounded-[1px] ${dark ? 'bg-white' : 'bg-ink dark:bg-white'}`} />
          <span className={`absolute -right-[3px] top-[2px] w-[2px] h-[3px] rounded-r-[1px] ${dark ? 'bg-white' : 'bg-ink dark:bg-white'}`} />
        </div>
      </div>
    </div>
  );
};

export default MobileStatusBar;
