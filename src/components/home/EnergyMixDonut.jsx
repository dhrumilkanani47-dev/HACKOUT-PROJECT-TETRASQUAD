import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sun, Wind, Droplets, Flame, Factory, Circle } from 'lucide-react';
import { CURRENT_LIVE_METRICS } from '../../utils/mockData';

export const EnergyMixDonut = () => {
  const { energyMix } = CURRENT_LIVE_METRICS;

  const data = [
    { name: 'Solar', value: energyMix.solar, color: '#E8A33D', icon: Sun },
    { name: 'Wind', value: energyMix.wind, color: '#2E7BB6', icon: Wind },
    { name: 'Hydro', value: energyMix.hydro, color: '#3FA66B', icon: Droplets },
    { name: 'Coal (Thermal)', value: energyMix.coal, color: '#B0472F', icon: Flame },
    { name: 'Gas & Other', value: energyMix.gas, color: '#718096', icon: Factory }
  ];

  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-ink dark:text-white leading-tight">
            Live Regional Grid Energy Mix
          </h2>
          <span className="text-xs text-ink-soft dark:text-ink-muted">
            Gujarat & Western Regional Load Despatch Centre
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest dark:text-emerald-300 font-heading text-xs font-semibold">
          {energyMix.totalRenewable}% Clean
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
        {/* Donut Chart with Center Renewable % */}
        <div className="relative h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Share']}
                contentStyle={{
                  backgroundColor: '#0F3D2E',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-heading font-bold text-2xl text-forest dark:text-emerald-400 leading-none">
              {energyMix.totalRenewable}%
            </span>
            <span className="text-[10px] uppercase font-heading font-semibold text-ink-soft dark:text-ink-muted mt-1">
              Renewable
            </span>
          </div>
        </div>

        {/* Legend / Breakdown List */}
        <div className="space-y-2">
          {data.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-ink dark:text-white">{item.name}</span>
                </div>
                <span className="font-heading font-bold text-ink dark:text-emerald-300">
                  {item.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
