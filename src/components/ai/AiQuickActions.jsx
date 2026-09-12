import React from 'react';
import { Sparkles, Zap, DollarSign, Leaf, Clock, Calculator, BatteryCharging, ArrowLeftRight } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Find best charger', query: 'Find the best charger near me for my vehicle', icon: Sparkles },
  { label: 'Cheapest charger', query: 'Find the cheapest charging station near me', icon: DollarSign },
  { label: 'Greenest charger', query: 'Show me stations with maximum solar and wind power', icon: Leaf },
  { label: 'Best time today', query: 'When is the best time to charge my EV today?', icon: Clock },
  { label: 'Calculate charging cost', query: 'How much will it cost to charge from 20% to 80%?', icon: Calculator },
  { label: 'Check my range', query: 'Can my car reach the nearest fast charging station?', icon: BatteryCharging },
  { label: 'Compare Tata Power & ChargeZone', query: 'Compare Tata Power EZ Charge and ChargeZone stations', icon: ArrowLeftRight }
];

export const AiQuickActions = ({ onSelectAction }) => {
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-ink-soft dark:text-ink-muted">
        Quick Inquiries
      </span>
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectAction(action.query)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest/15 dark:border-white/10 hover:border-forest text-forest dark:text-emerald-300 font-heading text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-forest-100 dark:hover:bg-forest-950/70"
            >
              <Icon className="w-3 h-3 text-leaf shrink-0" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
