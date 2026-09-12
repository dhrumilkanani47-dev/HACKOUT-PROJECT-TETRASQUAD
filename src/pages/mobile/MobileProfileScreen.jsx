import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { Car, CreditCard, Bell, Sliders, ShieldCheck, UserCheck, ChevronRight } from 'lucide-react';

export const MobileProfileScreen = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const handleToggleRole = () => {
    const roleCycle = {
      driver: 'operator',
      operator: 'grid_operator',
      grid_operator: 'driver'
    };
    const nextRole = roleCycle[user?.role] || 'driver';
    updateProfile({ role: nextRole });
    if (nextRole === 'operator') {
      navigate('/operator');
    } else if (nextRole === 'grid_operator') {
      navigate('/grid-operator');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuRows = [
    { id: 'vehicle', title: 'My Vehicle', sub: 'Tata Nexon EV (68%)', icon: Car, action: () => navigate('/charging') },
    { id: 'payment', title: 'Payment Methods', sub: 'UPI, Cards & GreenWallet', icon: CreditCard, action: () => alert('Payment methods: UPI auto-pay connected.') },
    { id: 'price_target', title: 'Price Alert Target', sub: '₹7.00/kWh', icon: Sliders, action: () => navigate('/notifications') },
    { id: 'preferences', title: 'Charging Preferences', sub: 'Prefer Solar & High-speed', icon: ShieldCheck, action: () => navigate('/smart-charge') },
    { id: 'notifications', title: 'Notifications', sub: 'Push alerts enabled', icon: Bell, action: () => navigate('/notifications') },
  ];

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Profile & Settings" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 13 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* User Profile Info Card matching attachment */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 text-white flex items-center justify-center font-heading font-bold text-base shadow-sm">
                SK
              </div>
              <div>
                <b className="font-heading text-[14px] text-slate-900 block font-bold">
                  {user?.name || 'Shani Kakadiya'}
                </b>
                <div className="text-[10px] text-slate-500">
                  {user?.role === 'grid_operator'
                    ? '🌐 Grid Operator (SLDC)'
                    : user?.role === 'operator'
                    ? '⚡ Station Operator'
                    : '🚗 EV Driver'} · Gandhinagar
                </div>
              </div>
            </div>

            {/* Quick Role Switcher Button */}
            <button
              onClick={handleToggleRole}
              className="text-[9.5px] font-heading font-bold px-2.5 py-1 rounded-lg bg-green-100 text-emerald-900 border border-green-300 hover:bg-green-200 transition-colors"
            >
              {user?.role === 'grid_operator'
                ? 'Switch to Driver'
                : user?.role === 'operator'
                ? 'Switch to Grid'
                : 'Switch to Operator'}
            </button>
          </div>

          {/* List Rows matching attachment */}
          <div className="app-card py-1 px-3 bg-white">
            {menuRows.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.id}
                  onClick={row.action}
                  className="app-list-row cursor-pointer hover:bg-green-50/50 py-2.5 px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="text-xs text-slate-900 font-bold block">
                        {row.title}
                      </span>
                      <span className="text-[9.5px] text-slate-500">
                        {row.sub}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 font-mono font-bold">›</span>
                </div>
              );
            })}
          </div>

          {/* Log Out Action Button matching attachment */}
          <button
            onClick={handleLogout}
            className="app-btn outline w-full text-xs font-bold border-red-400 text-red-600 hover:bg-red-50 mt-1 py-2.5"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Bottom Navigation (Screen 13: Profile active) */}
      <MobileBottomBar />
    </div>
  );
};

export default MobileProfileScreen;
