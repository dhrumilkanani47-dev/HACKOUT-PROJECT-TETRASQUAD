import React from 'react';

/**
 * Mobile status bar safe-area top spacer for mobile / Android devices.
 */
export const MobileStatusBar = () => {
  return (
    <div
      className="w-full shrink-0 select-none pointer-events-none"
      style={{ height: 'max(20px, env(safe-area-inset-top, 20px))' }}
      aria-hidden="true"
    />
  );
};

export default MobileStatusBar;

