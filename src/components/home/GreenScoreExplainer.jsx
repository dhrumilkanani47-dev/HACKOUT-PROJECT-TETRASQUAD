import React from 'react';
import { Leaf, Sun, Activity, Clock, ShieldCheck, Gauge } from 'lucide-react';
import { GreenScoreBadge } from '../common/GreenScoreBadge';

export const GreenScoreExplainer = ({ score = 94 }) => {
  const pillars = [
    {
      title: 'Renewable Energy Share',
      score: '96/100',
      desc: 'High concentration of active solar & wind farms on Western grid.',
      icon: Sun,
      color: 'text-amber'
    },
    {
      title: 'Grid Demand Balancing',
      score: '92/100',
      desc: 'Off-peak charging avoids triggering polluting thermal peaking plants.',
      icon: Activity,
      color: 'text-sky'
    },
    {
      title: 'Optimal Charging Period',
      score: '95/100',
      desc: 'Scheduled session matches maximum green generation hours.',
      icon: Clock,
      color: 'text-forest dark:text-leaf'
    },
    {
      title: 'Estimated Carbon Intensity',
      score: '112 g CO₂/kWh',
      desc: 'vs 720 g CO₂/kWh standard coal baseline (84% cleaner).',
      icon: Gauge,
      color: 'text-forest dark:text-emerald-400'
    }
  ];

  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-forest dark:text-leaf" />
            </div>
            <h2 className="font-heading font-bold text-lg text-ink dark:text-white">
              Green Score Index
            </h2>
          </div>
          <p className="text-xs text-ink-soft dark:text-ink-muted">
            Our real-time sustainability algorithm for clean mobility in India.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GreenScoreBadge score={score} size="ring" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 flex items-start gap-3"
            >
              <div className={`p-2 rounded-xl bg-white dark:bg-paper-cardDark shadow-xs ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-xs text-ink dark:text-white">
                    {item.title}
                  </span>
                  <span className="font-heading font-bold text-xs text-forest dark:text-emerald-400">
                    {item.score}
                  </span>
                </div>
                <p className="text-[11px] text-ink-soft dark:text-ink-muted mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
