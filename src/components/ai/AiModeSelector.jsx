import React from 'react';
import { AI_MODES } from '../../utils/constants';
import { Sparkles, TrendingDown, Leaf, Zap, AlertTriangle } from 'lucide-react';

const ICONS = {
  Sparkles,
  TrendingDown,
  Leaf,
  Zap,
  AlertTriangle
};

export const AiModeSelector = ({ activeMode = 'smart', onModeChange }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {AI_MODES.map((mode) => {
          const Icon = ICONS[mode.icon] || Sparkles;
          const isSelected = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange && onModeChange(mode.id)}
              className={`min-h-[42px] px-3.5 py-1.5 rounded-2xl font-heading text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-forest text-white border-forest shadow-sm ring-2 ring-emerald-400/40'
                  : 'bg-white dark:bg-paper-cardDark text-ink-soft dark:text-ink-muted border-forest/15 dark:border-white/10 hover:border-forest/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber' : 'text-forest dark:text-emerald-400'}`} />
              <div className="text-left">
                <span className="block leading-none">{mode.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
