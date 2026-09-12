import React from 'react';
import { ChevronRight } from 'lucide-react';

export const SidebarMenuItem = ({ name, isActive, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left font-heading ${
        isActive
          ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
          : disabled
            ? 'text-slate-400 font-medium cursor-default'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white font-medium transition-all duration-200'
      }`}
    >
      <div className="flex items-center gap-3 truncate">
        <span className="text-[13px] truncate">{name}</span>
      </div>
      {!disabled && (
        <ChevronRight
          className={`w-4 h-4 shrink-0 ${
            isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-500'
          }`}
        />
      )}
    </button>
  );
};

export default SidebarMenuItem;
