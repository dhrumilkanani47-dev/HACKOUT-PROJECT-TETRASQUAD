import React from 'react';
import { Zap, Plus, Gauge, CheckCircle2, TrendingDown, Leaf, Hospital } from 'lucide-react';

export const MapFilters = ({ activeTab, onTabChange, activeNetwork, onNetworkChange }) => {
  const filterTabs = [
    { id: 'all', label: 'All', icon: null },
    { id: 'chargers', label: '⚡ EV Chargers', icon: Zap },
    { id: 'hospitals', label: '✚ Hospitals', icon: Hospital },
    { id: 'fast', label: 'Fast Chargers', icon: Gauge },
    { id: 'available', label: 'Available Now', icon: CheckCircle2 },
    { id: 'low_cost', label: 'Low Cost (<₹8)', icon: TrendingDown },
    { id: 'green', label: 'Green Energy (80%+)', icon: Leaf },
    { id: 'near_hospitals', label: 'Near Hospitals', icon: Hospital }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {filterTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-full font-heading text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-forest text-white border-forest shadow-sm'
                  : 'bg-white dark:bg-paper-cardDark text-ink-soft dark:text-ink-muted border-forest/15 dark:border-white/10 hover:border-forest/40'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
