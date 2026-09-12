/**
 * Central API Base Configuration.
 * Automatically resolves localhost vs Android Emulator (10.0.2.2) when running inside Capacitor.
 */
export function getApiBase() {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  if (typeof window !== 'undefined') {
    // Check if running inside native Android WebView (Capacitor)
    const isCapacitor = Boolean(window.Capacitor?.isNativePlatform?.());
    const isAndroid = isCapacitor || (navigator?.userAgent ? navigator.userAgent.toLowerCase().includes('android') : false);

    if (isAndroid && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      // 10.0.2.2 is the Android Emulator's alias for the host development machine
      return envUrl.replace('localhost', '10.0.2.2').replace('127.0.0.1', '10.0.2.2');
    }
  }

  return envUrl;
}

export const API_BASE = getApiBase();
