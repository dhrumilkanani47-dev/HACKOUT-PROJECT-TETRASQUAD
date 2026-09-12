import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';
import { INDIAN_STATES_CITIES, VEHICLE_PRESETS } from '../utils/constants';
import {
  Zap,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Sparkles
} from 'lucide-react';

export const SignupPage = () => {
  const { signup, updateLocation } = useAuth();
  const { addVehicle } = useVehicles();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Account, 2: Location, 3: Vehicle

  // Step 1 Form
  const [accountData, setAccountData] = useState({
    name: 'Shani Kakadiya',
    email: 'shani.kakadiya@daiict.ac.in',
    phone: '+91 98765 43210',
    password: 'password123',
    confirmPassword: 'password123'
  });

  // Step 2 Form
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [selectedCity, setSelectedCity] = useState('Gandhinagar');

  // Step 3 Form
  const [selectedPreset, setSelectedPreset] = useState(VEHICLE_PRESETS[0]);

  const [isLoading, setIsLoading] = useState(false);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (accountData.password !== accountData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinishSignup = async () => {
    setIsLoading(true);
    try {
      await signup({
        name: accountData.name,
        email: accountData.email,
        phone: accountData.phone,
        state: selectedState,
        city: selectedCity
      });

      await addVehicle({
        name: `${selectedPreset.brand} ${selectedPreset.model}`,
        brand: selectedPreset.brand,
        model: selectedPreset.model,
        type: selectedPreset.type,
        batteryCapacity: selectedPreset.capacity,
        connector: selectedPreset.connector,
        maxChargingPower: selectedPreset.maxPower,
        currentBatteryPct: 68,
        targetBatteryPct: 85,
        standardRange: selectedPreset.standardRange
      });

      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const availableCities = INDIAN_STATES_CITIES[selectedState] || ['Ahmedabad', 'Gandhinagar', 'Surat'];

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white flex items-center justify-center p-4 sm:p-6 pb-24 md:pb-6">
      <div className="w-full max-w-lg bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-6">
        
        {/* Header & Step progress tracker */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest to-forest-2 text-white flex items-center justify-center mx-auto shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-forest dark:text-emerald-400">
            {step === 1 && 'Create your EV Account'}
            {step === 2 && 'Where do you live?'}
            {step === 3 && 'Select your EV'}
          </h1>
          <p className="text-xs text-ink-soft dark:text-ink-muted">
            {step === 1 && 'Join India’s green charging revolution.'}
            {step === 2 && 'We match real-time state solar generation tariffs.'}
            {step === 3 && 'Tailor optimal charging windows to your battery.'}
          </p>

          {/* Progress Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? 'w-8 bg-forest dark:bg-emerald-400' : 'w-2 bg-forest/20 dark:bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: ACCOUNT REGISTRATION */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                <input
                  type="text"
                  required
                  value={accountData.name}
                  onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                  placeholder="Shani Kakadiya"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                <input
                  type="email"
                  required
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                  placeholder="driver@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                <input
                  type="tel"
                  value={accountData.phone}
                  onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                  <input
                    type="password"
                    required
                    value={accountData.password}
                    onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                    className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                  <input
                    type="password"
                    required
                    value={accountData.confirmPassword}
                    onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                    className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-sm shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>Next: Set Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: LOCATION SETUP (State -> City -> GPS) */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  const s = e.target.value;
                  setSelectedState(s);
                  const cities = INDIAN_STATES_CITIES[s] || [];
                  setSelectedCity(cities[0] || '');
                }}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
              >
                {Object.keys(INDIAN_STATES_CITIES).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Select City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-forest-50 dark:bg-forest-950/40 border border-forest/15 flex items-center justify-between">
              <span className="text-xs text-forest dark:text-emerald-300 font-medium">
                Optionally detect via GPS:
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedState('Gujarat');
                  setSelectedCity('Gandhinagar');
                }}
                className="px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-heading font-semibold flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                <span>Use Current Location</span>
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="min-h-[48px] px-4 rounded-2xl border border-forest/20 text-ink dark:text-white font-heading font-semibold text-xs flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[48px] py-3 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-sm shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Next: Add Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ADD VEHICLE & COMPLETE */}
        {step === 3 && (
          <div className="space-y-4">
            <span className="text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted block">
              Choose your primary EV model:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {VEHICLE_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    selectedPreset.model === preset.model
                      ? 'bg-forest-100 dark:bg-forest-950/70 border-forest text-forest dark:text-emerald-300 ring-2 ring-forest/30 font-bold'
                      : 'bg-paper-card dark:bg-paper-surface border-forest/10 hover:border-forest/40 text-ink dark:text-white'
                  }`}
                >
                  <div className="font-heading truncate">{preset.brand} {preset.model}</div>
                  <div className="text-[10px] text-ink-soft dark:text-ink-muted font-normal mt-0.5">
                    {preset.capacity} kWh • {preset.connector}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="min-h-[48px] px-4 rounded-2xl border border-forest/20 text-ink dark:text-white font-heading font-semibold text-xs flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleFinishSignup}
                className="flex-1 min-h-[48px] py-3 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-sm shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{isLoading ? 'Creating Account...' : 'Complete & Launch Dashboard'}</span>
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-ink-soft dark:text-ink-muted pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-forest dark:text-emerald-400 font-heading font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
