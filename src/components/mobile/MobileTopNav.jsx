import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MobileTopNav = ({ title, onBack, showBack = true, rightAction = null }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 font-heading font-semibold text-[14.5px] border-b border-green-100 select-none bg-white/95 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-2.5 truncate">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-7 h-7 -ml-1.5 flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-green-50 active:scale-95 transition-all text-xl font-sans"
            aria-label="Back"
          >
            ‹
          </button>
        )}
        <span className="text-slate-900 font-extrabold truncate">{title}</span>
      </div>

      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </div>
  );
};

export default MobileTopNav;
