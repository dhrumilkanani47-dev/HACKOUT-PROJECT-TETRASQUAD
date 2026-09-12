import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { ShieldCheck, AlertCircle, CheckCircle2, Globe, Zap, Car } from 'lucide-react';

export const MobileLoginScreen = () => {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, loginDemo, updateProfile } = useAuth();

  const [role, setRole] = useState('driver'); // 'driver' | 'operator' | 'grid_operator'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('shani.kakadiya@daiict.ac.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Shani Kakadiya');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    setSuccessMsg('');
    if (newRole === 'operator') {
      setEmail('operator.greenhub@evcharge.in');
    } else if (newRole === 'grid_operator') {
      setEmail('gridcontrol@gujaratgrid.gov.in');
    } else {
      setEmail('shani.kakadiya@daiict.ac.in');
    }
  };

  const getDestinationRoute = (targetRole) => {
    if (targetRole === 'operator') return '/operator';
    if (targetRole === 'grid_operator') return '/grid-operator';
    return '/';
  };

  const handleAuthSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (authMode === 'login') {
        // Supabase login
        await login({ email, password, role });
        await updateProfile({ role });
        navigate(getDestinationRoute(role));
      } else {
        // Supabase signup
        const res = await signup({ email, password, name, role });
        await updateProfile({ role });
        if (res?.userConfirmed) {
          navigate(getDestinationRoute(role));
        } else {
          setSuccessMsg('Account created with Supabase! Please check your email for confirmation or use Demo mode for instant access.');
        }
      }
    } catch (err) {
      console.error('Supabase Auth error:', err);
      // Clean readable error message from Supabase
      const message = err?.message || 'Authentication error. Please check your credentials.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.warn('Google auth error:', err);
      setErrorMsg(err?.message || 'Google authentication encountered an issue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginDemo(role, email);
    navigate(getDestinationRoute(role));
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none overflow-y-auto">
      <div>
        <MobileStatusBar />

        <div className="px-5 pt-3 pb-6 flex flex-col gap-3">
          {/* Header Title & Subtitle */}
          <div className="mt-2">
            <h2 className="font-heading font-extrabold text-[22px] text-slate-900">
              {authMode === 'login' ? 'Welcome back' : 'Create Account'}
            </h2>
            <p className="text-[11.5px] text-slate-500 -mt-0.5">
              Continue your green charging & smart grid journey
            </p>
          </div>

          {/* Role Choice Selector with 3 Roles: Driver, Operator, Grid Operator */}
          <div className="my-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-heading font-bold text-slate-700 block">
                Choose your role:
              </label>
              <span className="text-[9.5px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {role === 'grid_operator' ? '🌐 Grid SLDC' : role === 'operator' ? '⚡ Station CPO' : '🚗 EV Driver'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 rounded-xl border border-green-200">
              {/* 1: EV Driver */}
              <button
                type="button"
                onClick={() => handleRoleChange('driver')}
                className={`py-2 px-1 text-[11px] font-heading font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                  role === 'driver'
                    ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500 font-extrabold'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                <Car className="w-4 h-4" />
                <span className="leading-tight text-center">EV Driver</span>
              </button>

              {/* 2: Station Operator */}
              <button
                type="button"
                onClick={() => handleRoleChange('operator')}
                className={`py-2 px-1 text-[11px] font-heading font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                  role === 'operator'
                    ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500 font-extrabold'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="leading-tight text-center">Station Operator</span>
              </button>

              {/* 3: Grid Operator */}
              <button
                type="button"
                onClick={() => handleRoleChange('grid_operator')}
                className={`py-2 px-1 text-[11px] font-heading font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                  role === 'grid_operator'
                    ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500 font-extrabold'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="leading-tight text-center">Grid Operator</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher: Log In vs Sign Up */}
          <div className="flex border-b border-slate-100 text-xs font-heading font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 border-b-2 transition-all ${
                authMode === 'login' ? 'border-emerald-500 text-emerald-800 font-bold' : 'border-transparent'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 border-b-2 transition-all ${
                authMode === 'signup' ? 'border-emerald-500 text-emerald-800 font-bold' : 'border-transparent'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Notice Banner */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1">
                <p className="font-semibold">{errorMsg}</p>
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="mt-1 text-[10.5px] text-red-900 underline font-bold"
                >
                  Or bypass with Instant Demo Access →
                </button>
              </div>
            </div>
          )}

          {/* Success Notice Banner */}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1">
                <p className="font-semibold">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Form Fields connected to Supabase */}
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-2.5 mt-0.5">
            {authMode === 'signup' && (
              <div>
                <label className="text-[10px] text-slate-700 font-semibold mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="app-field w-full text-xs"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-[10px] text-slate-700 font-semibold mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="app-field w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-700 font-semibold mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="app-field w-full text-xs"
                required
              />
            </div>

            {/* Primary Action Button (Supabase Login / Sign Up) */}
            <button
              type="submit"
              disabled={isLoading}
              className="app-btn w-full mt-1.5 font-bold shadow-sm flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isLoading
                ? (authMode === 'login' ? 'Authenticating with Supabase...' : 'Registering...')
                : (authMode === 'login' ? 'Log In with Supabase' : 'Sign Up with Supabase')}
            </button>
          </form>

          {/* Secondary Buttons Row */}
          <div className="flex gap-2 mt-0.5">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="app-btn ghost flex-1 text-xs py-2 border border-slate-200"
            >
              Google
            </button>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="app-btn outline flex-1 text-xs py-2 bg-emerald-50/60 border-emerald-300 text-emerald-900 font-bold"
            >
              Instant Demo
            </button>
          </div>

          {/* Subtext info */}
          <div className="text-center text-[10.5px] text-slate-500 mt-1">
            Active Role: <span className="font-bold text-slate-800 capitalize">{role.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="pb-3 text-center text-[10px] text-slate-400">
        Connected to Supabase Auth • Secure session active
      </div>
    </div>
  );
};

export default MobileLoginScreen;
