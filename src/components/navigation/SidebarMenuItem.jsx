import React from 'react';
import { ChevronRight } from 'lucide-react';

export const SidebarMenuItem = ({ num, name, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 text-left font-heading ${
        isActive
          ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white font-medium'
      }`}
    >
      <div className="flex items-center gap-3 truncate">
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold ${
            isActive
              ? 'bg-emerald-600/30 text-slate-950 font-bold'
              : 'bg-slate-800/90 text-slate-400'
          }`}
        >
          {num}
        </span>
        <span className="text-[13px] truncate">{name}</span>
      </div>
      <ChevronRight
        className={`w-4 h-4 shrink-0 ${
          isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-500'
        }`}
      />
    </button>
  );
};

export default SidebarMenuItem;
