import React from 'react';
import { Cpu, Zap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Real-Time Grid & CPO Telemetry',
      desc: 'We monitor renewable generation from solar & wind farms along with live availability across Jio-bp, Tata Power, ChargeZone & more.',
      icon: Cpu,
      tag: 'Live Grid Sync'
    },
    {
      num: '02',
      title: 'GreenCharge AI Engine',
      desc: 'Our neural models analyze your vehicle type, remaining SoC%, and tariff curves to calculate the lowest ₹/kWh window.',
      icon: Sparkles,
      tag: 'AI Optimization'
    },
    {
      num: '03',
      title: 'Plug In, Save & Reduce Carbon',
      desc: 'Navigate with confidence, charge during clean energy peaks, and track verified rupees saved and kilograms of CO₂ avoided.',
      icon: Zap,
      tag: 'Maximum Impact'
    }
  ];

  return (
    <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest dark:text-emerald-300 font-heading text-xs font-semibold mb-2">
          Transparent &amp; Intelligent
        </span>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-forest dark:text-emerald-400">
          How EV GreenCharge Works
        </h2>
        <p className="text-xs sm:text-sm text-ink-soft dark:text-ink-muted mt-2">
          From finding a nearby station to understanding exactly why your charging session costs what it costs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-5 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-bold text-2xl text-forest/20 dark:text-emerald-400/20">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-950/80 flex items-center justify-center text-forest dark:text-emerald-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-base text-ink dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-ink-soft dark:text-ink-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-forest/10 dark:border-white/5">
                <span className="inline-flex items-center gap-1 text-[10px] font-heading font-semibold uppercase tracking-wider text-forest dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  {step.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
