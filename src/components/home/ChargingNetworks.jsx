import React, { useState } from 'react';
import { CHARGING_NETWORKS } from '../../utils/constants';
import { Zap, ExternalLink, ShieldCheck } from 'lucide-react';

export const ChargingNetworks = ({ onSelectNetwork, selectedNetwork = 'all' }) => {
  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-ink dark:text-white leading-tight">
            Integrated Charging Networks
          </h2>
          <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
            Real-time open telemetry & status from India's leading EV charge point operators (CPOs).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mt-4">
        {CHARGING_NETWORKS.map((network) => {
          const isSelected = selectedNetwork === network.id;
          return (
            <button
              key={network.id}
              onClick={() => onSelectNetwork && onSelectNetwork(network.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[82px] cursor-pointer ${
                isSelected
                  ? 'bg-forest-100 dark:bg-forest-950/70 border-forest text-forest dark:text-emerald-300 shadow-sm'
                  : 'bg-paper-card dark:bg-paper-surface border-forest/10 dark:border-white/5 hover:border-forest/30 text-ink dark:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">{network.logo}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-forest/5 dark:bg-white/5 text-ink-soft dark:text-ink-muted">
                  {network.count}+ bays
                </span>
              </div>
              <div className="mt-2">
                <span className="font-heading font-semibold text-xs block leading-tight truncate">
                  {network.name}
                </span>
                <span className="text-[10px] text-ink-soft dark:text-ink-muted">
                  Live Telemetry Active
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-forest/10 dark:border-white/5 flex items-center justify-between text-[11px] text-ink-soft dark:text-ink-muted">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-forest dark:text-leaf" />
          OCPI / Open Charge Point Protocol compatible
        </span>
        <span className="text-[10px] italic">Network agnostic discovery</span>
      </div>
    </div>
  );
};
