import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-forest text-white rounded-t-3xl sm:rounded-3xl p-8 sm:p-12 mt-12 mb-16 md:mb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
            </div>
            <span className="font-heading font-bold text-xl text-white">
              EV GreenCharge
            </span>
          </div>
          <p className="text-xs text-emerald-100/80 max-w-sm leading-relaxed">
            India's premier AI-driven smart EV charging network assistant. Reducing grid strain, optimizing charging costs, and accelerating clean mobility.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-heading">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Built for India's 2030 EV Transition</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-emerald-300 mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs text-emerald-100/70">
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Driver Dashboard</Link></li>
            <li><Link to="/map" className="hover:text-white transition-colors">Charging Stations Map</Link></li>
            <li><Link to="/vehicles" className="hover:text-white transition-colors">My EV Garage</Link></li>
            <li><Link to="/ai" className="hover:text-white transition-colors">GreenCharge AI Assistant</Link></li>
            <li><Link to="/activity" className="hover:text-white transition-colors">Charging History</Link></li>
          </ul>
        </div>

        {/* Legal & Status */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-emerald-300 mb-3">
            Platform
          </h4>
          <ul className="space-y-2 text-xs text-emerald-100/70">
            <li><span className="text-emerald-300">● Western Grid: Normal (50.02 Hz)</span></li>
            <li><span>SLDC Dynamic Tariff Sync</span></li>
            <li><Link to="/settings" className="hover:text-white transition-colors">Price Drop Alerts</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Operator Portal</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/60">
        <div>
          © 2026 EV GreenCharge (TetraSquad). All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          <span>Charge Green. Drive Clean.</span>
        </div>
      </div>
    </footer>
  );
};
