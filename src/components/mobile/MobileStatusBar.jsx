import React from 'react';

/**
 * Mobile status bar safe-area spacer.
 * The real Android OS already renders the device's native status bar with actual battery,
 * Wi-Fi, time, and signal. We maintain a clean spacer to prevent content colliding with the status bar.
 */
export const MobileStatusBar = () => {
  return <div className="h-1.5 w-full select-none shrink-0" />;
};

export default MobileStatusBar;
