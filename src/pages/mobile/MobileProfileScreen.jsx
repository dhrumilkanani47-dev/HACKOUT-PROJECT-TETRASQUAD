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
  const [activeModal, setActiveModal] = useState(null);

  const handleToggleRole = () => {
    const nextRole = user?.role === 'operator' ? 'driver' : 'operator';
    updateProfile({ role: nextRole });
    if (nextRole === 'operator') {
      navigate('/operator');
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
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-card dark:bg-[#121815] select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Profile & Settings" onBack={() => navigate('/')} />

        {/* Content Container matching Screen 13 */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* User Profile Info Card matching attachment */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-paper dark:bg-paper-cardDark border border-forest/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-heading font-bold text-base shadow-sm">
                SK
              </div>
              <div>
                <b className="font-heading text-[13.5px] text-ink dark:text-white block">
                  {user?.name || 'Shani Kakadiya'}
                </b>
                <div className="text-[10px] text-ink-soft dark:text-ink-muted">
                  {user?.role === 'operator' ? '⚡ Station Operator' : '🚗 EV Driver'} · Gandhinagar
                </div>
              </div>
            </div>

            {/* Quick Role Switcher Button */}
            <button
              onClick={handleToggleRole}
              className="text-[9.5px] font-heading font-semibold px-2 py-1 rounded-lg bg-forest/10 dark:bg-emerald-500/20 text-forest dark:text-emerald-400 border border-forest/15 hover:bg-forest/20 transition-colors"
            >
              {user?.role === 'operator' ? 'Switch to Driver' : 'Switch to Operator'}
            </button>
          </div>

          {/* List Rows matching attachment */}
          <div className="app-card py-1 px-3">
            {menuRows.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.id}
                  onClick={row.action}
                  className="app-list-row cursor-pointer hover:opacity-80 py-2.5 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-forest dark:text-emerald-400" />
                    <div>
                      <span className="text-xs text-ink dark:text-white font-medium block">
                        {row.title}
                      </span>
                      <span className="text-[9.5px] text-ink-soft dark:text-ink-muted">
                        {row.sub}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-ink-soft font-mono font-bold">›</span>
                </div>
              );
            })}
          </div>

          {/* Log Out Action Button matching attachment */}
          <button
            onClick={handleLogout}
            className="app-btn outline w-full text-xs font-bold border-coal text-coal dark:border-rose-400 dark:text-rose-400 hover:bg-coal/10 mt-1 py-2.5"
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
