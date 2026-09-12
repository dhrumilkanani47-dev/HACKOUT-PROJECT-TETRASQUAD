import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const OtpVerificationOrbital = ({
  targetContact = 'krushilgadhiya138@gmail.com',
  isPhone = false,
  onVerify,
  onResend,
  onBack,
  expectedOtp = '4719'
}) => {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'ok' | 'bad'
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);

  // Focus hidden input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

    if (val.length === 4) {
      triggerVerification(val);
    }
  };

  const handleSlotClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const triggerVerification = async (codeToVerify) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 4) {
      setStatus('bad');
      setErrorMessage('Please enter all 4 digits');
      return;
    }

    setIsVerifying(true);
    setStatus('idle');

    try {
      if (onVerify) {
        const isValid = await onVerify(code);
        if (isValid) {
          setStatus('ok');
        } else {
          setStatus('bad');
          setErrorMessage('Invalid OTP code. Try 4719 or resend.');
        }
      } else {
        // Fallback validation
        if (code === expectedOtp || code === '4719') {
          setStatus('ok');
        } else {
          setStatus('bad');
          setErrorMessage('Invalid OTP code. Try 4719 or resend.');
        }
      }
    } catch (err) {
      setStatus('bad');
      setErrorMessage(err.message || 'Verification failed');
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
    setTimer(30);

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }

    if (onResend) {
      await onResend();
    }
  };

  // Quick autofill for demo testing
  const handleAutofill = (sampleCode = expectedOtp || '4719') => {
    const arr = sampleCode.split('').slice(0, 4);
    setDigits(arr);
    setActiveIndex(3);
    if (inputRef.current) {
      inputRef.current.value = sampleCode;
    }
    triggerVerification(sampleCode);
  };

  // Orbital positions for the 4 slots
  const slotPositions = [
    { top: '10%', left: '50%', transform: 'translate(-50%, 0) rotate(0deg)' },
    { top: '50%', left: '90%', transform: 'translate(-100%, -50%) rotate(90deg)' },
    { top: '90%', left: '50%', transform: 'translate(-50%, -100%) rotate(180deg)' },
    { top: '50%', left: '10%', transform: 'translate(0, -50%) rotate(270deg)' }
  ];

  return (
    <div className="w-full flex flex-col items-center justify-between text-white animate-fade-in relative px-3 py-2">
      {/* Hidden real input for keyboard support */}
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
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          OTP Verification v3
        </span>
      </div>

      <div className="text-center mb-3">
        <h3 className="font-heading font-extrabold text-[18px] text-white tracking-tight">
          {isPhone ? 'Verify your number' : 'Verify your email'}
        </h3>
        <p className="text-[11.5px] text-slate-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
          Enter the 4-digit code sent to <br />
          <b className="text-emerald-400 font-mono">{targetContact}</b>
        </p>
      </div>

      {/* ========================================================= */}
      {/* ORBITAL RING CONTAINER (EXACT MATCH TO ATTACHED SCREENSHOT) */}
      {/* ========================================================= */}
      <div
        onClick={handleSlotClick}
        className="relative w-[230px] h-[230px] my-2 flex items-center justify-center cursor-pointer group"
      >
        {/* Orbital Track SVG Ring */}
        <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.2"
            strokeDasharray="2 6"
            className="vector-effect-non-scaling-stroke"
          />
        </svg>

        {/* Outer Glow Halo */}
        <div className="absolute w-[180px] h-[180px] rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />

        {/* Central Hub Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#2ee6a8] z-0" />

        {/* 4 Orbiting Slots */}
        {digits.map((digit, idx) => {
          const isFilled = digit !== '';
          const isCurrent = activeIndex === idx;

          let borderColor = 'border-white/15 bg-[#121B2A]/90';
          let textColor = 'text-[#dceaff]';
          let glowShadow = 'shadow-lg';

          if (status === 'ok') {
            borderColor = 'border-[#2ee6a8] bg-[#0c241d]';
            textColor = 'text-[#2ee6a8]';
            glowShadow = 'shadow-[0_0_15px_rgba(46,230,168,0.4)]';
          } else if (status === 'bad') {
            borderColor = 'border-[#ff4d6a] bg-[#2a0e14]';
            textColor = 'text-[#ff4d6a]';
            glowShadow = 'shadow-[0_0_15px_rgba(255,77,106,0.4)]';
          } else if (isCurrent) {
            borderColor = 'border-emerald-400 bg-[#162335]';
            glowShadow = 'shadow-[0_0_12px_rgba(34,197,94,0.35)]';
          }

          return (
            <div
              key={idx}
              style={slotPositions[idx]}
              className={`absolute w-12 h-12 rounded-2xl flex items-center justify-center border ${borderColor} ${glowShadow} backdrop-blur-md transition-all duration-300 transform hover:scale-105 select-none`}
            >
              <span className={`font-heading font-bold text-xl ${textColor} transition-all`}>
                {digit ? digit : isCurrent ? '•' : ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error / Status Feedback */}
      {errorMessage && (
        <div className="text-[11px] text-red-400 flex items-center gap-1 my-1 animate-fade-in font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {status === 'ok' && (
        <div className="text-[11px] text-emerald-400 flex items-center gap-1 my-1 animate-fade-in font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Code verified successfully!</span>
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
            <span>Resend Code Now</span>
          </button>
        )}
      </div>

      {/* Demo helper quick autofill matching screenshot */}
      <div className="mt-3 text-[10.5px] text-slate-400 text-center">
        <span>Type it, paste it, or </span>
        <button
          type="button"
          onClick={() => handleAutofill(expectedOtp || '4719')}
          className="text-emerald-400 font-bold hover:underline cursor-pointer font-mono"
        >
          {expectedOtp || '4719'} is the good one.
        </button>
      </div>

      {/* Manual Verify Button */}
      <button
        type="button"
        onClick={() => triggerVerification()}
        disabled={isVerifying || digits.join('').length < 4}
        className="app-btn w-full mt-3 py-2.5 text-xs rounded-xl font-bold shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>
    </div>
  );
};

export default OtpVerificationOrbital;
