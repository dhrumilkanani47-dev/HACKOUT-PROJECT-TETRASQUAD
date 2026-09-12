import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { HOURLY_GRID_DATA } from '../../utils/mockData';
import { TrendingDown, Sun, AlertTriangle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-forest text-white p-2.5 rounded-xl text-xs shadow-elevated border border-emerald-500/20">
        <div className="font-heading font-bold text-emerald-300">{data.time}</div>
        <div className="font-heading font-bold text-sm my-0.5">₹{data.price.toFixed(2)}/kWh</div>
        <div className="text-[10px] text-emerald-100 flex flex-col gap-0.5 mt-1 border-t border-white/10 pt-1">
          <span>☀ Solar: {data.solar}% • 💨 Wind: {data.wind}%</span>
          <span>⚡ Grid Demand: {data.gridDemand}%</span>
          <span className="font-semibold text-amber">Status: {data.status}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DynamicPriceChart = () => {
  const data = HOURLY_GRID_DATA;

  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-ink dark:text-white leading-tight">
            24-Hour Dynamic Tariff Curve
          </h2>
          <span className="text-xs text-ink-soft dark:text-ink-muted">
            Gujarat &amp; Western Grid Merit-Order Pricing (₹/kWh)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-heading font-medium">
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Cheap (Solar Peak)
          </span>
          <span className="flex items-center gap-1 text-coal dark:text-coal-300">
            <span className="w-2.5 h-2.5 rounded-full bg-coal" />
            Expensive (Evening Peak)
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 sm:h-64 w-full -ml-2 sm:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3FA66B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0F3D2E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fill: '#8B9890', fontSize: 10, fontFamily: 'Space Grotesk' }}
              axisLine={{ stroke: 'rgba(15, 61, 46, 0.1)' }}
              tickLine={false}
            />
            <YAxis
              domain={[4, 14]}
              tick={{ fill: '#8B9890', fontSize: 10, fontFamily: 'Space Grotesk' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Highlight solar cheap window: 12:00 to 16:00 */}
            <ReferenceArea
              x1="12:00"
              x2="14:00"
              fill="#3FA66B"
              fillOpacity={0.12}
            />

            {/* Highlight expensive evening peak: 18:00 to 21:00 */}
            <ReferenceArea
              x1="19:00"
              x2="21:00"
              fill="#B0472F"
              fillOpacity={0.12}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#0F3D2E"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-forest/10 dark:border-white/5 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
          <Sun className="w-4 h-4 text-amber shrink-0" />
          <span><b>Cheapest Slot:</b> 12:00 PM – 3:00 PM @ ₹6.20/kWh (89% Solar)</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 text-coal shrink-0" />
          <span><b>Peak Avoid Slot:</b> 7:00 PM – 9:00 PM @ ₹11.90/kWh</span>
        </div>
      </div>
    </div>
  );
};
