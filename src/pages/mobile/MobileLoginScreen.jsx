import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { OtpVerificationOrbital } from '../../components/auth/OtpVerificationOrbital';
import {
  Car,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  KeyRound,
  Sparkles,
  Info
} from 'lucide-react';

export const MobileLoginScreen = () => {
  const navigate = useNavigate();
  const { login, signup, updateProfile } = useAuth();

  // Mode: 'login' | 'signup' | 'forgot_email' | 'forgot_otp' | 'forgot_new_password' | 'signup_otp'
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [viewState, setViewState] = useState('auth'); // 'auth' | 'signup_otp' | 'forgot_flow'
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp' | 'reset'

  // Role Selection
  const [role, setRole] = useState('driver'); // 'driver' | 'operator' | 'grid_operator'
  const [companyName, setCompanyName] = useState('Tata Power');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('krushilgadhiya138@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('password123');

  // Forgot Password Fields
  const [forgotEmail, setForgotEmail] = useState('krushilgadhiya138@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Alerts & Modals
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showAlreadyRegisteredModal, setShowAlreadyRegisteredModal] = useState(false);
  const [currentOtp, setCurrentOtp] = useState('4719');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'operator') {
      setEmail('operator.tatapower@evcharge.in');
      setCompanyName('Tata Power');
    } else if (newRole === 'grid_operator') {
      setEmail('grid.operations@gujaratsldc.in');
      setCompanyName('Gujarat SLDC');
    } else {
      setEmail('krushilgadhiya138@gmail.com');
    }
  };

  // -------------------------------------------------------------
  // 1. HANDLE LOGIN
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const selectedCompany = role !== 'driver' ? (companyName.trim() || (role === 'grid_operator' ? 'Gujarat SLDC' : 'Tata Power')) : undefined;
      await login({ email, password, role, companyName: selectedCompany });
      await updateProfile({ role, companyName: selectedCompany });

      if (role === 'operator') {
        navigate('/operator');
      } else if (role === 'grid_operator') {
        navigate('/grid-operator');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND' || err.message?.toLowerCase().includes('not found')) {
        setShowNotFoundModal(true);
      } else {
        setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 2. HANDLE SIGNUP INITIATION (CHECKS USER & SENDS OTP)
  // -------------------------------------------------------------
  const handleSignupInit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // 1. Check if user already registered
      const check = await authApi.checkUser(email);
      if (check.exists) {
        setShowAlreadyRegisteredModal(true);
        setIsLoading(false);
        return;
      }

      // 2. Send OTP
      const otpRes = await authApi.sendOtp(email, 'signup');
      if (otpRes.otp) {
        setCurrentOtp(otpRes.otp);
      }
      setViewState('signup_otp');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to initiate signup.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. COMPLETE SIGNUP AFTER OTP VERIFICATION
  // -------------------------------------------------------------
  const handleVerifySignupOtp = async (code) => {
    try {
      const verifyRes = await authApi.verifyOtp(email, code, 'signup');
      if (verifyRes.valid) {
        // Complete registration in database
        const selectedCompany = role !== 'driver' ? (companyName.trim() || (role === 'grid_operator' ? 'Gujarat SLDC' : 'Tata Power')) : undefined;
        await signup({
          name: name.trim() || 'EV Green User',
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role,
          companyName: selectedCompany
        });

        setSuccessMessage('Welcome! Invitation email dispatched.');
        setTimeout(() => {
          if (role === 'operator') navigate('/operator');
          else if (role === 'grid_operator') navigate('/grid-operator');
          else navigate('/');
        }, 1200);
        return true;
      }
      return false;
    } catch (err) {
      setErrorMessage(err.message || 'OTP verification failed');
      return false;
    }
  };

  // -------------------------------------------------------------
  // 4. FORGOT PASSWORD FLOW
  // -------------------------------------------------------------
  const handleForgotStart = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const check = await authApi.checkUser(forgotEmail);
      if (!check.exists) {
        setShowNotFoundModal(true);
        setIsLoading(false);
        return;
      }

      const otpRes = await authApi.sendOtp(forgotEmail, 'forgot_password');
      if (otpRes.otp) {
        setCurrentOtp(otpRes.otp);
      }
      setForgotStep('otp');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyForgotOtp = async (code) => {
    try {
      const verifyRes = await authApi.verifyOtp(forgotEmail, code, 'forgot_password');
      if (verifyRes.valid) {
        setForgotStep('reset');
        return true;
      }
      return false;
    } catch (err) {
      setErrorMessage(err.message || 'OTP verification failed');
      return false;
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await authApi.forgotPassword(forgotEmail, newPassword);
      setSuccessMessage('Password reset successfully! Logging you in...');
      setTimeout(() => {
        setViewState('auth');
        setActiveTab('login');
        setEmail(forgotEmail);
        setPassword(newPassword);
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none relative">
      {/* Top Status Bar */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />

        <div className="px-5 pt-3 pb-6 flex flex-col gap-3">
          {/* ============================================================== */}
          {/* VIEW 1: SIGNUP OTP VERIFICATION ORBITAL VIEW */}
          {/* ============================================================== */}
          {viewState === 'signup_otp' && (
            <div className="p-4 bg-[#0A101D] rounded-3xl border border-slate-800 shadow-2xl animate-fade-in">
              <OtpVerificationOrbital
                targetContact={email}
                expectedOtp={currentOtp}
                onVerify={handleVerifySignupOtp}
                onResend={() => authApi.sendOtp(email, 'signup')}
                onBack={() => setViewState('auth')}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 2: FORGOT PASSWORD FLOW */}
          {/* ============================================================== */}
          {viewState === 'forgot_flow' && (
            <div className="flex flex-col gap-3">
              {/* Back button */}
              <button
                type="button"
                onClick={() => {
                  setViewState('auth');
                  setForgotStep('email');
                  setErrorMessage('');
                }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-heading font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>

              {/* Step 1: Enter Email */}
              {forgotStep === 'email' && (
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-[16px] text-slate-900">
                        Forgot Password
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Enter your registered email to receive an OTP
                      </p>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-1.5 mb-3 border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleForgotStart} className="space-y-3 mt-3">
                    <div>
                      <label className="text-[10.5px] font-semibold text-slate-700 mb-1 block">
                        Registered Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="krushilgadhiya138@gmail.com"
                        className="app-field w-full text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="app-btn w-full py-2.5 text-xs font-bold shadow-md cursor-pointer"
                    >
                      {isLoading ? 'Sending Code...' : 'Send Verification OTP'}
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: OTP Verification Orbital Screen */}
              {forgotStep === 'otp' && (
                <div className="p-4 bg-[#0A101D] rounded-3xl border border-slate-800 shadow-2xl animate-fade-in">
                  <OtpVerificationOrbital
                    targetContact={forgotEmail}
                    expectedOtp={currentOtp}
                    onVerify={handleVerifyForgotOtp}
                    onResend={() => authApi.sendOtp(forgotEmail, 'forgot_password')}
                    onBack={() => setForgotStep('email')}
                  />
                </div>
              )}

              {/* Step 3: Set New Password */}
              {forgotStep === 'reset' && (
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-[16px] text-slate-900">
                        Set New Password
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Create a secure password for {forgotEmail}
                      </p>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-1.5 mb-3 border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5 mb-3 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleResetPasswordSubmit} className="space-y-3 mt-3">
                    <div>
                      <label className="text-[10.5px] font-semibold text-slate-700 mb-1 block">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="app-field w-full text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] font-semibold text-slate-700 mb-1 block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="app-field w-full text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="app-btn w-full py-2.5 text-xs font-bold shadow-md cursor-pointer"
                    >
                      {isLoading ? 'Updating...' : 'Update & Save Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 3: STANDARD LOGIN & SIGN UP TABS */}
          {/* ============================================================== */}
          {viewState === 'auth' && (
            <>
              {/* Header Title */}
              <div className="mt-1">
                <h2 className="font-heading font-extrabold text-[22px] text-slate-900">
                  {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-[11.5px] text-slate-500 -mt-0.5">
                  {activeTab === 'login'
                    ? 'Continue your green charging journey'
                    : 'Join Gujarat’s real-time green charging grid'}
                </p>
              </div>

              {/* Log In / Sign Up Top Switcher */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 my-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Role Choice Selector */}
              <div className="my-0.5">
                <label className="text-[10px] font-heading font-semibold text-slate-600 mb-1 block">
                  Select Role:
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 rounded-xl border border-green-200">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('driver')}
                    className={`py-1.5 text-xs font-heading font-bold rounded-lg transition-all cursor-pointer ${
                      role === 'driver'
                        ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500'
                        : 'text-slate-600 hover:text-emerald-800'
                    }`}
                  >
                    🚗 EV Driver
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('grid_operator')}
                    className={`py-1.5 text-[10.5px] font-heading font-bold rounded-lg transition-all cursor-pointer ${
                      role === 'grid_operator'
                        ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500'
                        : 'text-slate-600 hover:text-emerald-800'
                    }`}
                  >
                    ⚡ Grid Op
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('operator')}
                    className={`py-1.5 text-xs font-heading font-bold rounded-lg transition-all cursor-pointer ${
                      role === 'operator'
                        ? 'bg-emerald-400 text-emerald-950 shadow-sm border border-emerald-500'
                        : 'text-slate-600 hover:text-emerald-800'
                    }`}
                  >
                    🏢 Station Op
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-1.5 border border-red-200 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 animate-fade-in font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ============================================================== */}
              {/* FORM: LOG IN */}
              {/* ============================================================== */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2.5">
                  {role !== 'driver' && (
                    <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                      <label className="text-[10px] text-emerald-950 font-heading font-bold mb-1 flex items-center justify-between">
                        <span>{role === 'grid_operator' ? '🏢 Grid Organization' : '🏢 Operator Company'}</span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Tata Power, Jio-bp"
                        className="app-field w-full text-xs bg-white mb-1"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10.5px] text-slate-700 font-semibold mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="krushilgadhiya138@gmail.com"
                      className="app-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10.5px] text-slate-700 font-semibold">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setViewState('forgot_flow');
                          setForgotStep('email');
                          setErrorMessage('');
                        }}
                        className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="app-field w-full text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="app-btn w-full mt-1.5 font-bold shadow-md cursor-pointer"
                  >
                    {isLoading ? 'Verifying Account...' : 'Log In'}
                  </button>
                </form>
              ) : (
                /* ============================================================== */
                /* FORM: SIGN UP */
                /* ============================================================== */
                <form onSubmit={handleSignupInit} className="flex flex-col gap-2.5">
                  <div>
                    <label className="text-[10.5px] text-slate-700 font-semibold mb-1 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Krushil Gadhiya"
                      className="app-field w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-700 font-semibold mb-1 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="krushilgadhiya138@gmail.com"
                      className="app-field w-full text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10.5px] text-slate-700 font-semibold mb-1 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="app-field w-full text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] text-slate-700 font-semibold mb-1 block">
                        Set Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="app-field w-full text-xs"
                      />
                    </div>
                  </div>

                  {role !== 'driver' && (
                    <div>
                      <label className="text-[10.5px] text-slate-700 font-semibold mb-1 block">
                        {role === 'grid_operator' ? 'Grid Organization' : 'Operator Company Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Tata Power, Jio-bp"
                        className="app-field w-full text-xs"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="app-btn w-full mt-1.5 font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isLoading ? 'Checking...' : 'Verify OTP & Create Account'}</span>
                  </button>
                </form>
              )}

              {/* Switch Tab Prompt */}
              <div className="text-center text-[11px] text-slate-500 mt-2">
                {activeTab === 'login' ? (
                  <span>
                    New user?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Sign up for free
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Log in here
                    </button>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* POPUP MODAL 1: ACCOUNT NOT FOUND MODAL */}
      {/* ============================================================== */}
      {showNotFoundModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-amber-200 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6" />
            </div>

            <h3 className="font-heading font-extrabold text-[16px] text-slate-900">
              Account Not Found
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              No registered account was found with <b>{email}</b>.
            </p>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 mt-3">
              New user? Please sign up to create your EV GreenCharge account.
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowNotFoundModal(false);
                  setViewState('auth');
                  setActiveTab('signup');
                  setErrorMessage('');
                }}
                className="app-btn w-full py-2.5 text-xs font-bold shadow-sm cursor-pointer"
              >
                Switch to Sign Up
              </button>
              <button
                type="button"
                onClick={() => setShowNotFoundModal(false)}
                className="py-2 text-xs text-slate-500 font-heading font-semibold hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* POPUP MODAL 2: ALREADY REGISTERED MODAL */}
      {/* ============================================================== */}
      {showAlreadyRegisteredModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-emerald-200 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            </div>

            <h3 className="font-heading font-extrabold text-[16px] text-slate-900">
              Already Registered!
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              An account with <b>{email}</b> is already registered.
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 mt-3">
              Please log in using your existing credentials or reset your password.
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAlreadyRegisteredModal(false);
                  setViewState('auth');
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className="app-btn w-full py-2.5 text-xs font-bold shadow-sm cursor-pointer"
              >
                Switch to Log In
              </button>
              <button
                type="button"
                onClick={() => setShowAlreadyRegisteredModal(false)}
                className="py-2 text-xs text-slate-500 font-heading font-semibold hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pb-3 text-center text-[10px] text-slate-400">
        Python Backend &amp; SQLite Active • Gujarat SLDC Connected
      </div>
    </div>
  );
};

export default MobileLoginScreen;
