import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft, XCircle, ShieldAlert, Mail } from 'lucide-react';

export const OtpVerificationOrbital = ({
  targetContact = 'krushilgadhiya138@gmail.com',
  isPhone = false,
  liveOtp,
  onVerify,
  onResend,
  onBack
}) => {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRevolving, setIsRevolving] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'revolving' | 'ok' | 'bad'
  const [errorMessage, setErrorMessage] = useState('');
  const [showInvalidPopup, setShowInvalidPopup] = useState(false);
  const [activeLiveOtp, setActiveLiveOtp] = useState(liveOtp || '');
  const inputRef = useRef(null);
  const orbitalRef = useRef(null);

  // Focus hidden input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (liveOtp) {
      setActiveLiveOtp(liveOtp);
    }
  }, [liveOtp]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle hidden input change (supports paste and full 4-digit input)
  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    const newDigits = ['', '', '', ''];
    for (let i = 0; i < val.length; i++) {
      newDigits[i] = val[i];
    }
    setDigits(newDigits);
    setActiveIndex(Math.min(val.length, 3));
    setStatus('idle');
    setErrorMessage('');
    setShowInvalidPopup(false);

    if (val.length === 4) {
      triggerVerification(val);
    }
  };

  const handleSlotClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAutofillLive = (code) => {
    if (!code) return;
    const val = String(code).slice(0, 4);
    const newDigits = val.split('');
    setDigits(newDigits);
    setActiveIndex(3);
    if (inputRef.current) {
      inputRef.current.value = val;
    }
    triggerVerification(val);
  };

  const triggerVerification = async (codeToVerify) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 4) {
      setStatus('bad');
      setErrorMessage('Please enter all 4 digits');
      return;
    }

    // 1. Trigger roundly moved orbital spin animation
    setIsRevolving(true);
    setIsVerifying(true);
    setStatus('revolving');

    // Allow the smooth orbital spin animation (800ms) to play
    await new Promise(res => setTimeout(res, 850));

    try {
      if (onVerify) {
        const isValid = await onVerify(code);
        setIsRevolving(false);
        if (isValid) {
          setStatus('ok');
          setErrorMessage('');
        } else {
          setStatus('bad');
          setErrorMessage('Invalid OTP code. Please check your inbox.');
          setShowInvalidPopup(true);
        }
      } else {
        setIsRevolving(false);
        setStatus('bad');
        setShowInvalidPopup(true);
      }
    } catch (err) {
      setIsRevolving(false);
      setStatus('bad');
      setErrorMessage(err.message || 'Verification failed');
      setShowInvalidPopup(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendClick = async () => {
    if (timer > 0) return;
    setDigits(['', '', '', '']);
    setActiveIndex(0);
    setStatus('idle');
    setErrorMessage('');
    setShowInvalidPopup(false);
    setTimer(30);

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }

    if (onResend) {
      const res = await onResend();
      if (res && res.otp) {
        setActiveLiveOtp(res.otp);
      }
    }
  };

  const handleTryAgain = () => {
    setShowInvalidPopup(false);
    setDigits(['', '', '', '']);
    setActiveIndex(0);
    setStatus('idle');
    setErrorMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  // Slot positions: Top (0), Right (1), Bottom (2), Left (3)
  const slotPositions = [
    { top: '8px', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', right: '8px', transform: 'translateY(-50%)' },
    { bottom: '8px', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', left: '8px', transform: 'translateY(-50%)' }
  ];

  return (
    <div className="w-full flex flex-col items-center justify-between text-white animate-fade-in relative px-3 py-2 select-none">
      {/* Hidden real input for keyboard & autofill support */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={4}
        value={digits.join('')}
        onChange={handleInputChange}
        className="opacity-0 absolute -z-10 pointer-events-none"
      />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        ) : <div />}
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
          OTP Verification v3
        </span>
      </div>

      {/* Real-Time OTP Dispatch Notice Banner (Instant Notification) */}
      {activeLiveOtp && (
        <div
          onClick={() => handleAutofillLive(activeLiveOtp)}
          className="w-full mb-2.5 p-2 bg-emerald-950/90 border border-emerald-500/50 rounded-xl flex items-center justify-between gap-2 shadow-lg cursor-pointer hover:bg-emerald-900/90 transition-all group animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                Live OTP Dispatched:
              </div>
              <div className="text-xs font-mono font-extrabold text-emerald-200">
                Code: <span className="text-white text-[13px] bg-emerald-800/80 px-1.5 py-0.2 rounded">{activeLiveOtp}</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.8 rounded-lg group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-colors">
            Tap to Fill ⚡
          </span>
        </div>
      )}

      {/* Main Title & Contact Info */}
      <div className="text-center mb-2">
        <h3 className="font-heading font-extrabold text-[18px] text-white tracking-tight">
          {isPhone ? 'Verify your number' : 'Verify your email'}
        </h3>
        <p className="text-[11.5px] text-slate-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
          Enter the 4-digit real code sent to <br />
          <b className="text-emerald-400 font-mono tracking-wide">{targetContact}</b>
        </p>
      </div>

      {/* ========================================================= */}
      {/* ORBITAL RING CONTAINER (ROUNDLY REVOLVES ON ENTERING OTP) */}
      {/* ========================================================= */}
      <div
        ref={orbitalRef}
        onClick={handleSlotClick}
        className="relative w-[210px] h-[210px] my-3 flex items-center justify-center cursor-pointer group"
      >
        {/* Orbital Track SVG Ring */}
        <svg
          className={`absolute inset-0 w-full h-full transition-transform duration-700 ${
            isRevolving ? 'animate-[spin_0.8s_cubic-bezier(0.2,0.8,0.2,1)_1]' : ''
          }`}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={
              status === 'ok'
                ? '#2ee6a8'
                : status === 'bad'
                ? '#ff4d6a'
                : 'rgba(255, 255, 255, 0.18)'
            }
            strokeWidth="1.5"
            strokeDasharray="2 8"
            className="transition-colors duration-500"
          />
        </svg>

        {/* Ambient Glow Halo */}
        <div
          className={`absolute w-[160px] h-[160px] rounded-full blur-xl pointer-events-none transition-all duration-500 ${
            status === 'ok'
              ? 'bg-[#2ee6a8]/25 scale-110'
              : status === 'bad'
              ? 'bg-[#ff4d6a]/25 scale-110'
              : 'bg-emerald-500/10'
          }`}
        />

        {/* Center Orbit Hub */}
        <div
          className={`absolute w-3 h-3 rounded-full z-0 transition-all duration-500 ${
            status === 'ok'
              ? 'bg-[#2ee6a8] shadow-[0_0_16px_#2ee6a8] scale-125'
              : status === 'bad'
              ? 'bg-[#ff4d6a] shadow-[0_0_16px_#ff4d6a] scale-125'
              : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
          }`}
        />

        {/* Rotating Slots Wrapper for the "roundly moved" animation */}
        <div
          className={`absolute inset-0 w-full h-full transition-transform ${
            isRevolving
              ? 'animate-[spin_0.85s_cubic-bezier(0.25,1,0.5,1)_1]'
              : status === 'bad'
              ? 'animate-[shake_0.4s_ease-in-out_1]'
              : ''
          }`}
        >
          {digits.map((digit, idx) => {
            const isFilled = digit !== '';
            const isCurrent = activeIndex === idx;

            let borderColor = 'border-white/20 bg-[#121B2A]/90';
            let textColor = 'text-[#dceaff]';
            let glowShadow = 'shadow-md';

            if (status === 'ok') {
              borderColor = 'border-[#2ee6a8] bg-[#0c241d]';
              textColor = 'text-[#2ee6a8]';
              glowShadow = 'shadow-[0_0_18px_rgba(46,230,168,0.6)]';
            } else if (status === 'bad') {
              borderColor = 'border-[#ff4d6a] bg-[#2a0e14]';
              textColor = 'text-[#ff4d6a]';
              glowShadow = 'shadow-[0_0_18px_rgba(255,77,106,0.6)]';
            } else if (isCurrent) {
              borderColor = 'border-emerald-400 bg-[#162335]';
              glowShadow = 'shadow-[0_0_12px_rgba(34,197,94,0.4)]';
            }

            return (
              <div
                key={idx}
                style={slotPositions[idx]}
                className={`absolute w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${borderColor} ${glowShadow} backdrop-blur-md transition-all duration-300 transform hover:scale-105 select-none`}
              >
                <span className={`font-heading font-extrabold text-xl ${textColor} transition-all`}>
                  {digit ? digit : isCurrent ? '•' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline Status Message */}
      {status === 'ok' && (
        <div className="text-[12px] text-[#2ee6a8] flex items-center gap-1.5 my-1 animate-fade-in font-bold bg-[#0c241d]/80 px-3 py-1.5 rounded-full border border-[#2ee6a8]/30">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2ee6a8]" />
          <span>Verified Successfully!</span>
        </div>
      )}

      {status === 'bad' && !showInvalidPopup && (
        <div className="text-[11.5px] text-[#ff4d6a] flex items-center gap-1 my-1 animate-fade-in font-semibold bg-[#2a0e14]/80 px-3 py-1 rounded-full border border-[#ff4d6a]/30">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage || 'Invalid OTP code'}</span>
        </div>
      )}

      {/* Resend Countdown Timer */}
      <div className="text-[11.5px] text-slate-400 mt-2 text-center">
        {timer > 0 ? (
          <span>
            Didn't receive the code? Resend in <b className="text-white font-mono">{timer}s</b>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resend Code to Inbox</span>
          </button>
        )}
      </div>

      {/* Manual Verify Action Button */}
      <button
        type="button"
        onClick={() => triggerVerification()}
        disabled={isVerifying || digits.join('').length < 4}
        className={`w-full mt-3 py-2.5 text-xs rounded-xl font-heading font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 ${
          status === 'ok'
            ? 'bg-[#2ee6a8] text-emerald-950 hover:bg-[#28cf97]'
            : 'app-btn'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isVerifying ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Verifying Code...</span>
          </>
        ) : status === 'ok' ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Greenly Verified</span>
          </>
        ) : (
          <span>Verify OTP</span>
        )}
      </button>

      {/* ========================================================= */}
      {/* POPUP MODAL: RED INVALID OTP POP-UP (AS REQUESTED) */}
      {/* ========================================================= */}
      {showInvalidPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-[#160b10] border-2 border-[#ff4d6a] rounded-3xl p-5 shadow-[0_0_30px_rgba(255,77,106,0.35)] animate-slide-up text-center">
            {/* Red Alert Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#ff4d6a]/15 text-[#ff4d6a] flex items-center justify-center mx-auto mb-3 border border-[#ff4d6a]/40">
              <ShieldAlert className="w-8 h-8 text-[#ff4d6a]" />
            </div>

            <h3 className="font-heading font-extrabold text-[17px] text-white">
              Invalid OTP Code
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              The 4-digit verification code you entered is incorrect or expired.
            </p>

            <div className="p-2.5 bg-[#2a0e14] rounded-xl border border-[#ff4d6a]/30 text-[11px] text-[#ff8095] mt-3 font-medium">
              Please check your inbox at <b>{targetContact}</b> for the real-time OTP.
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={handleTryAgain}
                className="w-full py-2.5 bg-[#ff4d6a] hover:bg-[#e03b58] text-white rounded-xl font-heading font-bold text-xs shadow-lg cursor-pointer transition-all"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleResendClick}
                className="w-full py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl font-heading font-semibold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend New Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtpVerificationOrbital;
