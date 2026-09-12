import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';

export const MobileLoginScreen = () => {
  const navigate = useNavigate();
  const { login, updateProfile } = useAuth();

  const [role, setRole] = useState('driver'); // 'driver' | 'operator'
  const [email, setEmail] = useState('shani.kakadiya@daiict.ac.in');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ role });
      if (role === 'operator') {
        navigate('/operator');
      } else {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'operator') {
      setEmail('operator.greenhub@evcharge.in');
    } else {
      setEmail('shani.kakadiya@daiict.ac.in');
    }
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div>
        <MobileStatusBar />

        <div className="px-5 pt-3 pb-6 flex flex-col gap-3">
          {/* Header Title & Subtitle */}
          <div className="mt-2">
            <h2 className="font-heading font-extrabold text-[22px] text-slate-900">
              Welcome back
            </h2>
            <p className="text-[11.5px] text-slate-500 -mt-0.5">
              Continue your green charging journey
            </p>
          </div>

          {/* Role Choice Selector matching attachment */}
          <div className="my-1">
            <label className="text-[10.5px] font-heading font-semibold text-slate-700 mb-1 block">
              Choose your role:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-xl border border-green-200">
              <button
                type="button"
                onClick={() => handleRoleChange('driver')}
                className={`py-1.5 text-xs font-heading font-bold rounded-lg transition-all ${role === 'driver'
                    ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500'
                    : 'text-slate-600 hover:text-emerald-800'
                  }`}
              >
                🚗 EV Driver
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('operator')}
                className={`py-1.5 text-xs font-heading font-bold rounded-lg transition-all ${role === 'operator'
                    ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500'
                    : 'text-slate-600 hover:text-emerald-800'
                  }`}
              >
                ⚡ Station Operator
              </button>
            </div>
          </div>

          {/* Form Fields matching attachment */}
          <form onSubmit={handleLogin} className="flex flex-col gap-2.5 mt-1">
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

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="app-btn w-full mt-2 font-bold shadow-sm"
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          {/* Secondary Buttons Row matching attachment */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => handleLogin()}
              className="app-btn ghost flex-1 text-xs py-2"
            >
              Google
            </button>
            <button
              onClick={() => handleLogin()}
              className="app-btn ghost flex-1 text-xs py-2"
            >
              Sign Up
            </button>
          </div>

          {/* Subtext info */}
          <div className="text-center text-[10.5px] text-slate-500 mt-2">
            Driver or Operator — choose your role
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="pb-4 text-center text-[10px] text-slate-400">
        Demo mode active • Instant Login enabled
      </div>
    </div>
  );
};

export default MobileLoginScreen;
