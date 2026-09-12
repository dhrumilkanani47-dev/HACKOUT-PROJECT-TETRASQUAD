import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';
import {
  User,
  Shield,
  Car,
  Bell,
  MapPin,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Sparkles,
  Zap,
  Bookmark,
  Info
} from 'lucide-react';
import { GreenScoreBadge } from '../components/common/GreenScoreBadge';

export const ProfilePage = () => {
  const { user, toggleRole, logout } = useAuth();
  const { vehicles } = useVehicles();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* User Card */}
        <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-6 shadow-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-forest to-forest-2 text-white flex items-center justify-center font-heading font-bold text-2xl shadow-md">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-xl text-ink dark:text-white">
                  {user?.name || 'EV Driver'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950 text-forest dark:text-emerald-300 text-[10.5px] font-heading font-semibold uppercase">
                  {user?.role === 'operator' ? 'Station Operator' : 'EV Driver'}
                </span>
              </div>
              <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
                {user?.email || 'driver@greencharge.in'} • {user?.city || 'Gandhinagar'}, {user?.state || 'Gujarat'}
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-ink-soft dark:text-ink-muted uppercase font-heading block">Driver Score</span>
            <GreenScoreBadge score={user?.stats?.overallGreenScore || 92} size="md" showLabel={false} />
          </div>
        </div>

        {/* Menu Navigation Links (Screen 13) */}
        <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-3 shadow-soft divide-y divide-forest/10 dark:divide-white/5">
          <Link
            to="/vehicles"
            className="flex items-center justify-between p-3.5 hover:bg-paper-card dark:hover:bg-paper-surface rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest dark:text-leaf flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-semibold text-xs text-ink dark:text-white block">
                  My EV Garage ({vehicles.length})
                </span>
                <span className="text-[11px] text-ink-soft dark:text-ink-muted">
                  Manage primary vehicle, battery pack specs
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-soft" />
          </Link>

          <Link
            to="/settings"
            className="flex items-center justify-between p-3.5 hover:bg-paper-card dark:hover:bg-paper-surface rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-light/80 dark:bg-amber-950 text-amber-dark dark:text-amber flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-semibold text-xs text-ink dark:text-white block">
                  Price Alert Targets
                </span>
                <span className="text-[11px] text-ink-soft dark:text-ink-muted">
                  Alert when tariff falls below ₹{user?.priceAlertThreshold?.toFixed(2) || '7.00'}/kWh
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-soft" />
          </Link>

          <Link
            to="/settings"
            className="flex items-center justify-between p-3.5 hover:bg-paper-card dark:hover:bg-paper-surface rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-light/80 dark:bg-sky-950 text-sky dark:text-sky-300 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-semibold text-xs text-ink dark:text-white block">
                  Location &amp; Grid Region
                </span>
                <span className="text-[11px] text-ink-soft dark:text-ink-muted">
                  {user?.city || 'Gandhinagar'}, {user?.state || 'Gujarat'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-soft" />
          </Link>

          <Link
            to="/activity"
            className="flex items-center justify-between p-3.5 hover:bg-paper-card dark:hover:bg-paper-surface rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest dark:text-leaf flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-semibold text-xs text-ink dark:text-white block">
                  Charging Session Receipts
                </span>
                <span className="text-[11px] text-ink-soft dark:text-ink-muted">
                  Audit logs and carbon avoidance certifications
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-soft" />
          </Link>

          <Link
            to="/settings"
            className="flex items-center justify-between p-3.5 hover:bg-paper-card dark:hover:bg-paper-surface rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/10 text-ink-soft flex items-center justify-center">
                <SettingsIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-semibold text-xs text-ink dark:text-white block">
                  App Settings &amp; Preferences
                </span>
                <span className="text-[11px] text-ink-soft dark:text-ink-muted">
                  Theme, offline cache, privacy controls
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-soft" />
          </Link>
        </div>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="w-full min-h-[48px] py-3 rounded-2xl border-2 border-coal text-coal hover:bg-coal-light/30 font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>

        {/* About Us Card below Log Out */}
        <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <b className="font-heading text-slate-900 dark:text-white block">About EV GreenCharge</b>
              <span className="text-slate-500 text-[11px]">TetraSquad for HackOut 2026 · Gujarat Clean Energy Grid</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            v2.4.0
          </span>
        </div>
      </div>
    </div>
  );
};
