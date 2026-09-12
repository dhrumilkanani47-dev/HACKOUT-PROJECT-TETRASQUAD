import React, { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';
import { GreenScoreBadge } from '../components/common/GreenScoreBadge';
import { Activity, Zap, Calendar, ArrowRight, Sun, Award, ShieldCheck, Filter } from 'lucide-react';
import { formatDate, formatCurrency, formatEnergy } from '../utils/formatters';

export const ActivityPage = () => {
  const [sessions, setSessions] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all' | 'month'

  useEffect(() => {
    profileApi.getPastSessions().then(setSessions);
  }, []);

  const totalEnergy = sessions.reduce((acc, s) => acc + (s.energyDeliveredKwh || 0), 0);
  const totalCost = sessions.reduce((acc, s) => acc + (s.totalCostInr || 0), 0);
  const totalCo2 = sessions.reduce((acc, s) => acc + Number(s.co2AvoidedKg || 0), 0);

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest/10 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-heading font-semibold uppercase text-forest dark:text-emerald-400">
              Telemetry &amp; Audit Logs
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest dark:text-white">
              Charging Activity
            </h1>
            <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
              Verified records of your EV charging sessions, costs, and carbon offset impact.
            </p>
          </div>

          <div className="flex bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setFilterPeriod('all')}
              className={`min-h-[36px] px-3 rounded-xl font-heading text-xs font-semibold ${
                filterPeriod === 'all' ? 'bg-forest text-white' : 'text-ink-soft'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilterPeriod('month')}
              className={`min-h-[36px] px-3 rounded-xl font-heading text-xs font-semibold ${
                filterPeriod === 'month' ? 'bg-forest text-white' : 'text-ink-soft'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* 3 Impact Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft text-center">
            <span className="text-xs text-ink-soft dark:text-ink-muted block uppercase font-heading">Total Energy</span>
            <b className="font-heading font-bold text-2xl text-ink dark:text-white block mt-1">
              {totalEnergy.toFixed(1)} kWh
            </b>
            <span className="text-[11px] text-emerald-600 font-medium">92% Average Renewable</span>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft text-center">
            <span className="text-xs text-ink-soft dark:text-ink-muted block uppercase font-heading">Total Spend</span>
            <b className="font-heading font-bold text-2xl text-forest dark:text-emerald-400 block mt-1">
              ₹{totalCost.toFixed(2)}
            </b>
            <span className="text-[11px] text-emerald-600 font-medium">Saved ~₹840 vs peak tariffs</span>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 shadow-soft text-center">
            <span className="text-xs text-ink-soft dark:text-ink-muted block uppercase font-heading">CO₂ Avoided</span>
            <b className="font-heading font-bold text-2xl text-emerald-600 block mt-1">
              {totalCo2.toFixed(1)} kg
            </b>
            <span className="text-[11px] text-emerald-600 font-medium">Equivalent to 42 trees planted</span>
          </div>
        </div>

        {/* Sessions List (Screen 10) */}
        <div className="space-y-3">
          <h2 className="font-heading font-bold text-base text-ink dark:text-white">
            Past Charging Sessions
          </h2>

          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-2xl p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center text-forest dark:text-leaf shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm text-ink dark:text-white">
                        {session.stationName}
                      </h3>
                      <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-forest-50 dark:bg-forest-950 text-forest dark:text-emerald-300 font-semibold">
                        {session.network}
                      </span>
                    </div>
                    <div className="text-xs text-ink-soft dark:text-ink-muted mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{session.vehicleName}</span>
                      <span>•</span>
                      <span>{formatDate(session.date)}</span>
                      <span>•</span>
                      <span>{session.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-forest/10 dark:border-white/5">
                  <div className="text-right">
                    <div className="font-heading font-bold text-sm text-forest dark:text-emerald-400">
                      ₹{session.totalCostInr?.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-ink-soft dark:text-ink-muted">
                      {session.energyDeliveredKwh} kWh @ ₹{session.pricePerKwh?.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-heading font-semibold flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber" />
                      {session.renewablePct}% Clean
                    </span>
                    <GreenScoreBadge score={session.greenScore || 90} size="sm" showLabel={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
