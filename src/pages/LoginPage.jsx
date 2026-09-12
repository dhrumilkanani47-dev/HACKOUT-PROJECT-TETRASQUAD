import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, Mail, Lock, ArrowRight, Check } from 'lucide-react';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('shani.kakadiya@daiict.ac.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('driver'); // 'driver' | 'operator'
  const [companyName, setCompanyName] = useState('Tata Power');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({
      email,
      password,
      role,
      companyName: role === 'operator' ? (companyName || 'Tata Power') : undefined
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white flex items-center justify-center p-4 sm:p-6 pb-24 md:pb-6">
      <div className="w-full max-w-md bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-6">
        
        {/* Brand Header (Screen 2) */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest to-forest-2 text-white flex items-center justify-center mx-auto shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-forest dark:text-emerald-400">
            Welcome back
          </h1>
          <p className="text-xs text-ink-soft dark:text-ink-muted">
            Continue your green charging journey in India.
          </p>
        </div>

        {/* Role Selector Pill */}
        <div className="flex bg-paper-card dark:bg-paper-surface p-1 rounded-2xl border border-forest/10 dark:border-white/5">
          <button
            type="button"
            onClick={() => setRole('driver')}
            className={`flex-1 min-h-[40px] rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
              role === 'driver'
                ? 'bg-forest text-white shadow-xs'
                : 'text-ink-soft dark:text-ink-muted'
            }`}
          >
            🚗 EV Driver
          </button>
          <button
            type="button"
            onClick={() => setRole('operator')}
            className={`flex-1 min-h-[40px] rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
              role === 'operator'
                ? 'bg-forest text-white shadow-xs'
                : 'text-ink-soft dark:text-ink-muted'
            }`}
          >
            ⚡ Station Operator
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'operator' && (
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                Operator Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full min-h-[44px] px-4 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
                placeholder="e.g. Tata Power, Jio-bp, Ather Energy"
              />
            </div>
          )}

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
            <span>{isLoading ? 'Signing in...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Alternative Google / Sign Up buttons */}
        <div className="space-y-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-forest/10 dark:border-white/10 w-full" />
            <span className="bg-white dark:bg-paper-cardDark px-3 text-[11px] text-ink-soft dark:text-ink-muted uppercase tracking-wider font-heading">
              Or
            </span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-forest/20 dark:border-white/10 hover:bg-paper-card dark:hover:bg-paper-surface text-ink dark:text-white font-heading font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Continue as Demo User</span>
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
