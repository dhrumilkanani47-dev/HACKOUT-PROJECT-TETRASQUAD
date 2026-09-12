import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStations } from '../../context/StationContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import { MobileBottomBar } from '../../components/mobile/MobileBottomBar';
import { ProfilePhotoUploader } from '../../components/common/ProfilePhotoUploader';
import { authApi } from '../../api/authApi';
import { OtpVerificationOrbital } from '../../components/auth/OtpVerificationOrbital';
import {
  Car,
  CreditCard,
  Bell,
  Sliders,
  ShieldCheck,
  Radio,
  Zap,
  BarChart3,
  Edit2,
  X,
  Check,
  Plus,
  Wallet,
  Smartphone,
  CheckCircle2,
  Battery,
  Leaf,
  Layers,
  Sparkles,
  KeyRound,
  Lock,
  AlertCircle,
  Info,
  Globe,
  Heart,
  Shield,
  Award
} from 'lucide-react';

export const MobileProfileScreen = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { operatorBaseTariff, updateOperatorBaseTariff, operatorRenewableTarget, updateOperatorRenewableTarget } = useStations();

  // Active Modal State ('edit_profile' | 'vehicle' | 'payment' | 'price_target' | 'preferences' | 'notifications' | 'operator_pricing' | 'operator_energy' | 'operator_reports' | null)
  const [activeModal, setActiveModal] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form & Settings Local States
  const [editName, setEditName] = useState(user?.name || 'Shani Kakadiya');
  const [editCompany, setEditCompany] = useState(user?.companyName || 'Tata Power');
  const [editCity, setEditCity] = useState(user?.city || 'Gandhinagar');
  const [editPhone, setEditPhone] = useState(user?.phone || '+91 98765 43210');
  const [selectedVehicle, setSelectedVehicle] = useState('Tata Nexon EV');
  const [batteryLevel, setBatteryLevel] = useState(68);
  const [targetSoc, setTargetSoc] = useState(85);
  const [walletBalance, setWalletBalance] = useState(1450);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [priceTarget, setPriceTarget] = useState(user?.priceAlertThreshold || 7.00);
  const [greenPref, setGreenPref] = useState(true);
  const [highSpeedPref, setHighSpeedPref] = useState(true);
  const [batteryCareLimit, setBatteryCareLimit] = useState(true);
  const [priceAlertsActive, setPriceAlertsActive] = useState(true);
  const [sessionAlertsActive, setSessionAlertsActive] = useState(true);
  const [greenSpikeAlerts, setGreenSpikeAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  // Security & Password states
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [securityStep, setSecurityStep] = useState('change'); // 'change' | 'otp' | 'reset'
  const [securityOtp, setSecurityOtp] = useState('4719');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [isPwLoading, setIsPwLoading] = useState(false);

  const showSuccessFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveModal(null);
    }, 1200);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    await updateProfile({
      name: editName,
      city: editCity,
      phone: editPhone,
      companyName: user?.role !== 'driver' ? editCompany : user?.companyName,
    });
    showSuccessFeedback();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuRows = user?.role === 'grid_operator'
    ? [
      { id: 'grid_data', title: 'Grid Data & Conditions', sub: 'Demand, renewable generation and EV load', icon: Zap, action: () => navigate('/grid-operator') },
      { id: 'grid_alerts', title: 'Grid Alerts', sub: 'Peak period alerts enabled', icon: Bell, action: () => navigate('/notifications') },
      { id: 'grid_reports', title: 'Grid Impact Reports', sub: 'Charging demand and stress analytics', icon: BarChart3, action: () => navigate('/grid-operator') },
      { id: 'security', title: 'Security & Password', sub: 'Change password or reset via OTP', icon: KeyRound, action: () => { setSecurityStep('change'); setPwError(''); setPwSuccess(''); setActiveModal('security'); } },
    ]
    : user?.role === 'operator'
    ? [
      { id: 'pricing', title: 'Pricing & Green Incentives', sub: `Dynamic Rate: ₹${(operatorBaseTariff || 8.40).toFixed(2)}/kWh`, icon: Sliders, action: () => setActiveModal('operator_pricing') },
      { id: 'energy', title: 'Energy & Renewable Mix', sub: `${operatorRenewableTarget || 78}% target renewable supply`, icon: Zap, action: () => setActiveModal('operator_energy') },
      { id: 'reports', title: 'Network Analytics', sub: 'Revenue: ₹24,580 • 128 Sessions', icon: BarChart3, action: () => setActiveModal('operator_reports') },
      { id: 'notifications', title: 'Operator Alerts', sub: 'Grid peak & queue alerts enabled', icon: Bell, action: () => setActiveModal('notifications') },
      { id: 'security', title: 'Security & Password', sub: 'Change password or reset via OTP', icon: KeyRound, action: () => { setSecurityStep('change'); setPwError(''); setPwSuccess(''); setActiveModal('security'); } },
    ]
    : [
      { id: 'price_target', title: 'Price Alert Target', sub: `Alert at ₹${priceTarget.toFixed(2)}/kWh`, icon: Sliders, action: () => setActiveModal('price_target') },
      { id: 'preferences', title: 'Charging Preferences', sub: greenPref ? 'Prefer Solar & Battery Care' : 'Standard Charging', icon: ShieldCheck, action: () => setActiveModal('preferences') },
      { id: 'notifications', title: 'Notifications & Alerts', sub: priceAlertsActive ? 'Push & WhatsApp alerts enabled' : 'Muted', icon: Bell, action: () => setActiveModal('notifications') },
      { id: 'security', title: 'Security & Password', sub: 'Change password or reset via OTP', icon: KeyRound, action: () => { setSecurityStep('change'); setPwError(''); setPwSuccess(''); setActiveModal('security'); } },
    ];

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav title="Profile & Settings" onBack={() => navigate('/')} />

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-3">
          {/* User Profile Info Card with Edit Profile Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-green-50/40 border border-green-200 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ProfilePhotoUploader />
                <div>
                  <div className="flex items-center gap-1.5">
                    <b className="font-heading text-[15px] text-slate-900 font-extrabold">
                      {user?.name || editName}
                    </b>
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    {user?.role === 'operator' ? (
                      <span className="text-emerald-900 font-semibold">⚡ Station Operator · 🏢 {user?.companyName || editCompany}</span>
                    ) : user?.role === 'grid_operator' ? (
                      <span className="text-emerald-900 font-semibold">🌐 Grid Operator · 🏢 {user?.companyName || editCompany}</span>
                    ) : (
                      <span>🚗 EV Driver</span>
                    )} · {user?.city || editCity}
                  </div>
                  <div className="text-[9.5px] text-slate-400 font-mono">
                    {user?.email || 'shani.kakadiya@daiict.ac.in'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('edit_profile')}
                className="p-2 rounded-xl bg-white border border-green-200 text-emerald-800 hover:bg-green-50 shadow-2xs active:scale-95 transition-all"
                title="Edit Profile"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List Rows */}
          <div className="app-card py-1 px-3 bg-white shadow-xs border border-green-200">
            {menuRows.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.id}
                  onClick={row.action}
                  className="app-list-row cursor-pointer hover:bg-green-50/50 py-2.5 px-1 rounded-lg transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-green-50 text-emerald-700 flex items-center justify-center shrink-0 border border-green-200/60">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs text-slate-900 font-heading font-bold block truncate">
                        {row.title}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block">
                        {row.sub}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 font-mono font-bold pl-2">›</span>
                </div>
              );
            })}
          </div>

          {/* Log Out Action Button */}
          <button
            onClick={handleLogout}
            className="app-btn outline w-full text-xs font-bold border-red-400 text-red-600 hover:bg-red-50 mt-1 py-2.5 shadow-2xs cursor-pointer"
          >
            Log Out
          </button>

          {/* ========================================================= */}
          {/* ABOUT US BUTTON BELOW LOG OUT                             */}
          {/* ========================================================= */}
          <button
            type="button"
            onClick={() => setActiveModal('about_us')}
            className="w-full mt-2 py-2.5 px-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-slate-700 font-heading font-semibold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                <Info className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-left">
                <span className="font-heading font-extrabold text-slate-900 block text-[12.5px] group-hover:text-emerald-800 transition-colors">
                  About Us &amp; Platform Info
                </span>
                <span className="text-[10px] text-slate-500">
                  Making EV travel easier, smarter, and more convenient.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-bold">
                v2.4
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">›</span>
            </div>
          </button>

          {/* Version Footer */}
          <div className="text-center text-[10px] text-slate-400 mt-2 mb-1">
            EV GreenCharge Gujarat • Build 2026.09.12
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomBar />

      {/* ========================================================= */}
      {/* INTERACTIVE WORKABLE MODALS FOR PROFILE & SETTINGS         */}
      {/* ========================================================= */}

      {/* 1. EDIT PROFILE MODAL */}
      {activeModal === 'edit_profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-emerald-600" /> Edit Profile Details
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="app-field w-full text-xs"
                  required
                />
              </div>

              {user?.role !== 'driver' && (
                <div>
                  <label className="text-[10px] font-semibold text-emerald-950 block mb-1 font-heading">
                    {user?.role === 'grid_operator' ? 'Grid Organization' : 'Operator Company Name'}
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="e.g. Tata Power, Jio-bp, Ather Energy"
                    className="app-field w-full text-xs border-emerald-300 bg-emerald-50/40 font-medium"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-semibold text-slate-700 block mb-1">City / Region</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="app-field w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="app-field w-full text-xs"
                />
              </div>

              <button
                type="submit"
                className="app-btn w-full mt-3 font-bold py-2.5 shadow-sm"
              >
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <Check className="w-4 h-4" /> Profile Updated!
                  </span>
                ) : (
                  'Save Profile'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. MY VEHICLE MODAL */}
      {activeModal === 'vehicle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-600" /> My Electric Vehicle
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-700 block mb-1">Select EV Model</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="app-field w-full text-xs bg-slate-50 font-heading font-semibold"
                >
                  <option value="Tata Nexon EV">Tata Nexon EV (40.5 kWh • CCS2)</option>
                  <option value="MG ZS EV">MG ZS EV (50.3 kWh • CCS2)</option>
                  <option value="Mahindra XUV400">Mahindra XUV400 (39.4 kWh • CCS2)</option>
                  <option value="Hyundai Ioniq 5">Hyundai Ioniq 5 (72.6 kWh • 350 kW DC)</option>
                  <option value="Ather 450X">Ather 450X Gen 3 (3.7 kWh • Type 2)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-700 mb-1">
                  <span>Current Battery Level</span>
                  <span className="text-emerald-700 font-bold">{batteryLevel}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={batteryLevel}
                  onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-700 mb-1">
                  <span>Smart Charging Target SoC</span>
                  <span className="text-emerald-700 font-bold">{targetSoc}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={targetSoc}
                  onChange={(e) => setTargetSoc(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-green-50 rounded-xl border border-green-200 text-[10.5px] text-emerald-950">
                ⚡ Estimated Range: <b>{Math.round((batteryLevel / 100) * 453)} km</b> • Max DC Speed: <b>50 kW</b>
              </div>

              <button
                onClick={showSuccessFeedback}
                className="app-btn w-full font-bold py-2.5 mt-2"
              >
                {saveSuccess ? 'Vehicle Settings Saved!' : 'Update Vehicle Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PAYMENT METHODS & GREENWALLET MODAL */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" /> GreenWallet & Payments
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Wallet Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-md">
                <div className="text-[10px] text-emerald-100 uppercase tracking-wider font-mono">
                  GreenWallet Balance
                </div>
                <div className="font-heading font-extrabold text-2xl mt-0.5">
                  ₹{walletBalance.toLocaleString()}
                </div>
                <div className="flex gap-2 mt-2.5">
                  <button
                    onClick={() => {
                      setWalletBalance((prev) => prev + 500);
                      showSuccessFeedback();
                    }}
                    className="flex-1 py-1 text-[10.5px] font-heading font-bold rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    + ₹500
                  </button>
                  <button
                    onClick={() => {
                      setWalletBalance((prev) => prev + 1000);
                      showSuccessFeedback();
                    }}
                    className="flex-1 py-1 text-[10.5px] font-heading font-bold rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    + ₹1,000
                  </button>
                </div>
              </div>

              {/* UPI & Auto Pay Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-green-100 flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">
                    UPI Auto-Pay (GPay / PhonePe)
                  </div>
                  <div className="text-[9.5px] text-slate-500">
                    Auto deduct for seamless charging stop
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoPayEnabled}
                  onChange={(e) => setAutoPayEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                onClick={showSuccessFeedback}
                className="app-btn w-full font-bold py-2.5"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRICE ALERT TARGET MODAL */}
      {activeModal === 'price_target' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" /> Price Alert Target
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="text-center py-2 bg-green-50 rounded-2xl border border-green-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Notify when price drops below</span>
                <div className="font-heading font-extrabold text-2xl text-emerald-800">
                  ₹{priceTarget.toFixed(2)}<span className="text-xs font-normal text-slate-500">/kWh</span>
                </div>
              </div>

              <input
                type="range"
                min="5.50"
                max="9.50"
                step="0.25"
                value={priceTarget}
                onChange={(e) => setPriceTarget(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
              />

              <div className="flex justify-between text-[9.5px] text-slate-400 font-medium">
                <span>₹5.50 (Super cheap)</span>
                <span>₹9.50 (Normal)</span>
              </div>

              <button
                onClick={async () => {
                  await updateProfile({ priceAlertThreshold: priceTarget });
                  showSuccessFeedback();
                }}
                className="app-btn w-full font-bold py-2.5 mt-2"
              >
                {saveSuccess ? 'Price Alert Target Saved!' : 'Save Alert Target'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CHARGING PREFERENCES MODAL */}
      {activeModal === 'preferences' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Charging Preferences
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">Prefer Clean Renewable Energy</div>
                  <div className="text-[9.5px] text-slate-500">Prioritize slots with &gt;75% solar & wind</div>
                </div>
                <input
                  type="checkbox"
                  checked={greenPref}
                  onChange={(e) => setGreenPref(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">High-Speed DC Charging Priority</div>
                  <div className="text-[9.5px] text-slate-500">Filter stations with &gt;50 kW DC guns</div>
                </div>
                <input
                  type="checkbox"
                  checked={highSpeedPref}
                  onChange={(e) => setHighSpeedPref(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">Battery Care 80% Auto-Limit</div>
                  <div className="text-[9.5px] text-slate-500">Slow down after 80% to protect battery health</div>
                </div>
                <input
                  type="checkbox"
                  checked={batteryCareLimit}
                  onChange={(e) => setBatteryCareLimit(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <button
                onClick={showSuccessFeedback}
                className="app-btn w-full font-bold py-2.5 mt-2"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. NOTIFICATIONS MODAL */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-600" /> Alert & Notification Settings
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">Price Drop Alerts</div>
                  <div className="text-[9.5px] text-slate-500">When spot prices fall below target</div>
                </div>
                <input
                  type="checkbox"
                  checked={priceAlertsActive}
                  onChange={(e) => setPriceAlertsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">Charging Session Complete</div>
                  <div className="text-[9.5px] text-slate-500">Notify when target SoC is reached</div>
                </div>
                <input
                  type="checkbox"
                  checked={sessionAlertsActive}
                  onChange={(e) => setSessionAlertsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">Green Energy Surge Alerts</div>
                  <div className="text-[9.5px] text-slate-500">Alert when Gujarat solar/wind generation peaks</div>
                </div>
                <input
                  type="checkbox"
                  checked={greenSpikeAlerts}
                  onChange={(e) => setGreenSpikeAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900">WhatsApp Updates</div>
                  <div className="text-[9.5px] text-slate-500">Receive receipt & summary on WhatsApp</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <button
                onClick={showSuccessFeedback}
                className="app-btn w-full font-bold py-2.5 mt-2"
              >
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. OPERATOR PRICING MODAL */}
      {activeModal === 'operator_pricing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" /> Pricing &amp; Green Incentives
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-heading font-bold text-slate-700">Station Base Tariff:</span>
                <b className="font-heading text-base text-emerald-800 font-extrabold">₹{(operatorBaseTariff || 8.40).toFixed(2)}/kWh</b>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateOperatorBaseTariff((p) => +(p - 0.2).toFixed(2))}
                  className="app-btn ghost flex-1 font-bold py-2 active:scale-95"
                >
                  − ₹0.20
                </button>
                <button
                  type="button"
                  onClick={() => updateOperatorBaseTariff((p) => +(p + 0.2).toFixed(2))}
                  className="app-btn outline flex-1 font-bold py-2 active:scale-95"
                >
                  + ₹0.20
                </button>
              </div>

              <button
                type="button"
                onClick={showSuccessFeedback}
                className="app-btn w-full font-bold py-2.5 mt-2 shadow-md"
              >
                {saveSuccess ? 'Base Rate Saved to Dashboard!' : 'Save & Update Dashboard Rate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. OPERATOR ENERGY MIX MODAL */}
      {activeModal === 'operator_energy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" /> Renewable Energy Mix Target
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="text-center py-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Clean Energy Dispatch</span>
                <div className="font-heading font-extrabold text-2xl text-emerald-800">
                  {operatorRenewableTarget || 78}%
                </div>
              </div>

              <input
                type="range"
                min="50"
                max="100"
                value={operatorRenewableTarget || 78}
                onChange={(e) => updateOperatorRenewableTarget(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
              />

              <button
                type="button"
                onClick={showSuccessFeedback}
                className="app-btn w-full font-bold py-2.5 mt-2"
              >
                {saveSuccess ? 'Renewable Target Saved!' : 'Save Renewable Target'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. OPERATOR REPORTS MODAL */}
      {activeModal === 'operator_reports' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" /> Network Performance
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-[9px] text-slate-500">Today's Revenue</div>
                  <b className="font-heading text-sm text-slate-900">₹24,580</b>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-[9px] text-slate-500">Sessions Served</div>
                  <b className="font-heading text-sm text-emerald-800">128</b>
                </div>
              </div>

              <div className="p-2.5 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="text-[9px] text-emerald-800">Avg Utilization Rate: <b>78.4%</b></div>
                <div className="text-[9px] text-slate-600">Green Score Avg: <b>92/100</b></div>
              </div>

              <button
                onClick={() => navigate('/operator')}
                className="app-btn w-full font-bold py-2.5 mt-2"
              >
                Open Full Operator Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 10. SECURITY & CHANGE / FORGOT PASSWORD MODAL */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-green-200 animate-slide-up max-h-[90%] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-600" /> Security &amp; Password
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error & Success Feedback */}
            {pwError && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-1.5 mb-2.5 border border-red-200 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pwError}</span>
              </div>
            )}
            {pwSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5 mb-2.5 border border-emerald-200 animate-fade-in font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{pwSuccess}</span>
              </div>
            )}

            {securityStep === 'change' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPw.length < 6) {
                    setPwError('New password must be at least 6 characters');
                    return;
                  }
                  if (newPw !== confirmPw) {
                    setPwError('Passwords do not match');
                    return;
                  }
                  setIsPwLoading(true);
                  setPwError('');
                  try {
                    await authApi.changePassword(user?.email, currentPw, newPw);
                    setPwSuccess('Password updated successfully in database!');
                    setTimeout(() => {
                      setActiveModal(null);
                    }, 1200);
                  } catch (err) {
                    setPwError(err.message || 'Failed to update password');
                  } finally {
                    setIsPwLoading(false);
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1 block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="••••••••••"
                    className="app-field w-full"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="••••••••••"
                    className="app-field w-full"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1 block">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="••••••••••"
                    className="app-field w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPwLoading}
                  className="app-btn w-full font-bold py-2.5 mt-2 cursor-pointer shadow-md"
                >
                  {isPwLoading ? 'Updating...' : 'Save New Password'}
                </button>

                {/* Forgot Password trigger */}
                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={async () => {
                      setPwError('');
                      setPwSuccess('');
                      try {
                        const res = await authApi.sendOtp(user?.email, 'forgot_password');
                        if (res.otp) setSecurityOtp(res.otp);
                        setSecurityStep('otp');
                      } catch (err) {
                        setPwError('Failed to send reset OTP');
                      }
                    }}
                    className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Forgot current password? Reset via OTP
                  </button>
                </div>
              </form>
            )}

            {securityStep === 'otp' && (
              <div className="p-2 bg-[#0A101D] rounded-2xl border border-slate-800 animate-fade-in">
                <OtpVerificationOrbital
                  targetContact={user?.email || 'krushilgadhiya138@gmail.com'}
                  onVerify={async (code) => {
                    const res = await authApi.verifyOtp(user?.email, code, 'forgot_password');
                    if (res.valid) {
                      setSecurityStep('reset');
                      return true;
                    }
                    return false;
                  }}
                  onResend={() => authApi.sendOtp(user?.email, 'forgot_password')}
                  onBack={() => setSecurityStep('change')}
                />
              </div>
            )}

            {securityStep === 'reset' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPw.length < 6) {
                    setPwError('Password must be at least 6 characters');
                    return;
                  }
                  if (newPw !== confirmPw) {
                    setPwError('Passwords do not match');
                    return;
                  }
                  setIsPwLoading(true);
                  setPwError('');
                  try {
                    await authApi.forgotPassword(user?.email, newPw);
                    setPwSuccess('Password successfully reset!');
                    setTimeout(() => {
                      setActiveModal(null);
                    }, 1200);
                  } catch (err) {
                    setPwError(err.message || 'Failed to reset password');
                  } finally {
                    setIsPwLoading(false);
                  }
                }}
                className="space-y-3 text-xs animate-fade-in"
              >
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1 block">
                    Set New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="••••••••••"
                    className="app-field w-full"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1 block">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="••••••••••"
                    className="app-field w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPwLoading}
                  className="app-btn w-full font-bold py-2.5 mt-2 cursor-pointer shadow-md"
                >
                  {isPwLoading ? 'Updating...' : 'Save & Confirm Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. ABOUT US & PLATFORM INFO MODAL                         */}
      {/* ========================================================= */}
      {activeModal === 'about_us' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-emerald-200 animate-slide-up max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 leading-tight">
                    About Our EV Navigation
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Your simple guide to finding EV charging stations wherever you go.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mission & Overview */}
            <div className="my-3 p-3 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-sm">
              <span className="text-[9.5px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                About Us
              </span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed font-sans">
                Our EV Navigation platform helps EV users easily find nearby charging stations. It is designed to make electric vehicle travel easier by helping users discover suitable charging stations for different types of electric vehicles.
              </p>
            </div>

            {/* Key Innovations */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                    <b className="font-heading text-slate-900 block text-[11.5px]">Find nearby EV charging stations</b>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">
                    Discover nearby charging stations wherever you go.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Radio className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                    <b className="font-heading text-slate-900 block text-[11.5px]">Support for different EV vehicles</b>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">
                    Find suitable charging options for different types of electric vehicles.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                    <b className="font-heading text-slate-900 block text-[11.5px]">Simple and convenient navigation</b>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">
                    Make EV travel easier with clear and convenient station navigation.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform statement */}
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 font-heading font-extrabold text-emerald-950 text-[11.5px]">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Making EV travel easier, smarter, and more convenient.</span>
              </div>
              <p className="text-[10.5px] text-emerald-800 mt-1">
                Your simple guide to finding EV charging stations wherever you go.
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-900 font-mono">
                <span>EV Navigation platform</span>
                <span>Simple EV travel</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="app-btn w-full mt-3 py-2.5 text-xs font-bold shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProfileScreen;

