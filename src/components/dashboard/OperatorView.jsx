import React from 'react';
import { Shield, Zap, TrendingUp, Users, DollarSign, Activity, CheckCircle2 } from 'lucide-react';
import { OPERATOR_DATA } from '../../utils/mockData';

export const OperatorView = () => {
  const data = OPERATOR_DATA;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-forest to-forest-2 text-white rounded-3xl p-5 sm:p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/15">
              <Shield className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-xs text-emerald-200 font-heading uppercase font-semibold">CPO Portal Mode</span>
              <h2 className="font-heading font-bold text-xl text-white">
                {data.stationName}
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-heading font-bold border border-emerald-400/30">
            ● Grid Sync Live
          </span>
        </div>
      </div>

      {/* 4 Key KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft text-center">
          <span className="text-xs text-ink-soft dark:text-ink-muted block">Today's Sessions</span>
          <b className="font-heading font-bold text-2xl text-ink dark:text-white mt-1 block">
            {data.totalSessionsToday}
          </b>
          <span className="text-[10px] text-emerald-600 font-medium">+14% vs yesterday</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft text-center">
          <span className="text-xs text-ink-soft dark:text-ink-muted block">Today's Revenue</span>
          <b className="font-heading font-bold text-2xl text-forest dark:text-emerald-400 mt-1 block">
            ₹{data.totalRevenueToday.toLocaleString('en-IN')}
          </b>
          <span className="text-[10px] text-ink-soft dark:text-ink-muted">₹8.40/kWh avg</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft text-center">
          <span className="text-xs text-ink-soft dark:text-ink-muted block">Renewable Share</span>
          <b className="font-heading font-bold text-2xl text-forest dark:text-emerald-400 mt-1 block">
            {data.renewablePct}%
          </b>
          <span className="text-[10px] text-emerald-600 font-medium">Solar Rooftop + Wind</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft text-center">
          <span className="text-xs text-ink-soft dark:text-ink-muted block">Active Guns</span>
          <b className="font-heading font-bold text-2xl text-ink dark:text-white mt-1 block">
            {data.activeChargers} / {data.totalChargers}
          </b>
          <span className="text-[10px] text-emerald-600 font-medium">2 bays free</span>
        </div>
      </div>

      {/* Weekly Session Trend */}
      <div className="p-5 rounded-3xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft">
        <h3 className="font-heading font-bold text-sm text-ink dark:text-white mb-3">
          Weekly Utilization &amp; Charging Traffic
        </h3>
        <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
          {data.weeklyTrend.map((day) => {
            const heightPct = Math.round((day.sessions / 60) * 100);
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-heading font-semibold text-ink-soft dark:text-ink-muted">
                  {day.sessions}
                </span>
                <div
                  className="w-full rounded-t-lg bg-forest hover:bg-forest-500 transition-all cursor-pointer"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] font-heading font-medium text-ink-soft dark:text-ink-muted">
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
