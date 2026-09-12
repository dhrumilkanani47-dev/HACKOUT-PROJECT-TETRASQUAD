import React from 'react';
import { Leaf } from 'lucide-react';

export const GreenScoreBadge = ({ score = 90, size = 'md', showLabel = true }) => {
  const isHigh = score >= 85;
  const isMed = score >= 70 && score < 85;

  const colorClass = isHigh
    ? 'text-forest bg-forest-100 border-forest-300 dark:bg-forest-950/70 dark:text-emerald-300 dark:border-forest-700'
    : isMed
    ? 'text-amber-dark bg-amber-light border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
    : 'text-coal-dark bg-coal-light border-coal-300 dark:bg-coal-950/60 dark:text-coal-300 dark:border-coal-800';

  if (size === 'ring') {
    const pct = Math.min(100, Math.max(0, score));
    return (
      <div className="flex flex-col items-center justify-center">
        <div 
          className="relative w-20 h-20 rounded-full flex items-center justify-center p-2 shadow-sm transition-all"
          style={{
            background: `conic-gradient(var(--leaf, #3FA66B) ${pct}%, rgba(15,61,46,0.12) 0)`
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white dark:bg-paper-cardDark flex flex-col items-center justify-center">
            <span className="font-heading font-bold text-lg text-forest dark:text-emerald-400 leading-tight">{score}</span>
            <span className="text-[8px] text-ink-soft dark:text-ink-muted uppercase font-heading font-semibold">Green Score</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-heading font-semibold ${colorClass}`}>
      <Leaf className="w-3.5 h-3.5" />
      <span>{score}/100</span>
      {showLabel && <span className="opacity-80">Green Score</span>}
    </div>
  );
};
