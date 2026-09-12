import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { NavigationDrawer } from '../navigation/NavigationDrawer';
import { useDrawer } from '../../context/DrawerContext';
import { LogOut } from 'lucide-react';

export const MobileAppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, closeDrawer } = useDrawer();
  const [showExitModal, setShowExitModal] = useState(false);

  const isDrawerOpenRef = useRef(isOpen);
  isDrawerOpenRef.current = isOpen;

  const showExitModalRef = useRef(showExitModal);
  showExitModalRef.current = showExitModal;

  const currentPathRef = useRef(location.pathname);
  currentPathRef.current = location.pathname;

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Back button handler
  const handleBackButton = useCallback(() => {
    // 1. If Exit Modal is open, close it
    if (showExitModalRef.current) {
      setShowExitModal(false);
      return;
    }

    // 2. If Navigation Drawer is open, close it
    if (isDrawerOpenRef.current) {
      closeDrawer();
      return;
    }

    // 3. Root Dashboard / Home / Login paths
    const rootPaths = ['/', '/dashboard', '/operator', '/grid-operator', '/login', '/splash'];
    const isRoot = rootPaths.includes(currentPathRef.current);

    if (isRoot) {
      // Show exit confirmation modal when on dashboard / home
      setShowExitModal(true);
    } else {
      // Navigate to previous / last page
      navigate(-1);
    }
  }, [closeDrawer, navigate]);

  // Register Capacitor Android Hardware Back Button Listener
  useEffect(() => {
    let backButtonListener = null;

    const setupListener = async () => {
      try {
        backButtonListener = await CapacitorApp.addListener('backButton', () => {
          handleBackButton();
        });
      } catch {
        // Fallback for non-Capacitor environments
      }
    };

    setupListener();

    return () => {
      if (backButtonListener && typeof backButtonListener.remove === 'function') {
        backButtonListener.remove();
      }
    };
  }, [handleBackButton]);

  const confirmExitApp = () => {
    setShowExitModal(false);
    try {
      CapacitorApp.exitApp();
    } catch {
      window.close();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] flex items-center justify-center p-0 md:p-6 antialiased selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(8,13,26,0))]">
      {/* Mobile Phone Screen Viewport */}
      <div className="w-full md:max-w-[395px] h-screen md:h-[844px] bg-slate-950 md:rounded-[44px] p-0 md:p-[8px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_8px_#1e293b] md:border md:border-slate-800 relative flex flex-col transition-all overflow-hidden">
        {/* Inner App Container with Drawer Overlay */}
        <div className="w-full h-full bg-white md:rounded-[36px] overflow-y-auto overflow-x-hidden flex flex-col justify-start relative select-none">
          {/* Main App Page Content */}
          {children}

          {/* Navigation Drawer & Overlay (Slides from left on hamburger tap) */}
          <NavigationDrawer />

          {/* Home Indicator Bar */}
          <div className="w-full py-1.5 flex justify-center items-center shrink-0 bg-white/95">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>

      {/* Exit App Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in select-none">
          <div className="bg-white w-full max-w-[320px] rounded-3xl p-5 shadow-2xl border border-slate-200 animate-slide-up flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                Exit Application?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Are you sure you want to exit EV GreenCharge?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmExitApp}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-heading font-extrabold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Exit App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAppShell;
