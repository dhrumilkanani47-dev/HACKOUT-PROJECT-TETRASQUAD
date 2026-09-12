import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, Mail, Lock, ArrowRight, Check, Globe, Car, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login, loginDemo, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('shani.kakadiya@daiict.ac.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('driver'); // 'driver' | 'operator' | 'grid_operator'
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login({ email, password, role });
      navigate(getDestinationRoute(role));
    } catch (err) {
      console.error('Supabase Login error:', err);
      setErrorMsg(err?.message || 'Login failed. Please check your credentials or test with Demo User.');
    }
  };

  const handleDemoLogin = () => {
    loginDemo(role, email);
    navigate(getDestinationRoute(role));
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white flex items-center justify-center p-4 sm:p-6 pb-24 md:pb-6">
      <div className="w-full max-w-md bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest to-forest-2 text-white flex items-center justify-center mx-auto shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-forest dark:text-emerald-400">
            Welcome back
          </h1>
          <p className="text-xs text-ink-soft dark:text-ink-muted">
            Continue your green charging & smart grid journey in India.
          </p>
        </div>

        {/* 3-Role Selector: EV Driver, Station Operator, Grid Operator */}
        <div>
          <label className="block text-[11px] font-heading font-bold text-ink-soft dark:text-ink-muted mb-1.5">
            Select Your Role:
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-paper-card dark:bg-paper-surface p-1 rounded-2xl border border-forest/10 dark:border-white/5">
            <button
              type="button"
              onClick={() => handleRoleChange('driver')}
              className={`min-h-[44px] rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 p-1 ${
                role === 'driver'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="text-[11px]">EV Driver</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('operator')}
              className={`min-h-[44px] rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 p-1 ${
                role === 'operator'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-[11px]">Station CPO</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('grid_operator')}
              className={`min-h-[44px] rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 p-1 ${
                role === 'grid_operator'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-ink-soft dark:text-ink-muted hover:text-forest'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-[11px]">Grid SLDC</span>
            </button>
          </div>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1">
              <p className="font-semibold">{errorMsg}</p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="mt-1 text-xs text-red-800 dark:text-red-200 underline font-bold"
              >
                Or continue with Demo User instant access →
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="••••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-ink-soft dark:text-ink-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-forest rounded"
              />
              <span>Remember session</span>
            </label>
            <a href="#forgot" className="text-forest dark:text-emerald-400 font-heading font-semibold hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-sm shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Signing in with Supabase...' : 'Log In with Supabase'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Alternative Actions */}
        <div className="space-y-3 pt-1">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-forest/10 dark:border-white/10 w-full" />
            <span className="bg-white dark:bg-paper-cardDark px-3 text-[11px] text-ink-soft dark:text-ink-muted uppercase tracking-wider font-heading">
              Or
            </span>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-forest/20 dark:border-white/10 hover:bg-paper-card dark:hover:bg-paper-surface text-ink dark:text-white font-heading font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Continue as Demo User ({role.replace('_', ' ')})</span>
          </button>

          <p className="text-center text-xs text-ink-soft dark:text-ink-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-forest dark:text-emerald-400 font-heading font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
