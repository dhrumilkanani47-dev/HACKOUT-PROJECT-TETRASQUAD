import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const MobileHeader = ({ title, showBack = true, action, rightElement }) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur-md sticky top-0 z-20 border-b border-forest/10 dark:border-white/10">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => (action ? action() : navigate(-1))}
            className="p-1 -ml-1 text-ink-soft dark:text-ink-muted hover:text-forest transition-colors rounded-lg"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="font-heading font-bold text-base text-forest dark:text-emerald-400 truncate">
          {title}
        </h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};
