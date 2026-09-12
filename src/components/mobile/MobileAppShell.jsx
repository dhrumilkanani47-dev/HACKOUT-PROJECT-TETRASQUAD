import React, { useEffect } from 'react';

export const MobileAppShell = ({ children }) => {
  // Ensure dark class is not stuck from previous sessions
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-start relative max-w-md mx-auto shadow-none sm:shadow-2xl sm:border-x sm:border-slate-100 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default MobileAppShell;
