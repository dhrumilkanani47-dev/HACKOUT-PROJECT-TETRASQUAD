import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES_CITIES } from '../utils/constants';
import {
  MapPin,
  Bell,
  Navigation,
  CheckCircle2,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateLocation, updateProfile } = useAuth();

  const [selectedState, setSelectedState] = useState(user?.state || 'Gujarat');
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Gandhinagar');
  const [priceThreshold, setPriceThreshold] = useState(user?.priceAlertThreshold || 7.00);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const availableCities = INDIAN_STATES_CITIES[selectedState] || ['Ahmedabad', 'Gandhinagar', 'Surat'];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const cities = INDIAN_STATES_CITIES[newState] || [];
    setSelectedCity(cities[0] || '');
  };

  const handleUseGps = () => {
    setIsGpsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsGpsLocating(false);
          updateLocation(
            'Gujarat',
            'Gandhinagar',
            pos.coords.latitude,
            pos.coords.longitude,
            'GPS Auto-detected'
          );
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        },
        () => {
          setIsGpsLocating(false);
          // Graceful fallback
          updateLocation('Gujarat', 'Gandhinagar', 23.1884, 72.6289, 'Default Regional Grid');
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        }
      );
    } else {
      setIsGpsLocating(false);
    }
  };

  const handleSaveAll = async () => {
    await updateLocation(selectedState, selectedCity, 23.1884, 72.6289, 'Manual Selection');
    await updateProfile({
      priceAlertThreshold: Number(priceThreshold)
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-forest/15 dark:border-white/10 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-ink-soft dark:text-ink-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-heading font-semibold uppercase text-forest dark:text-emerald-400">
              Preferences
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest dark:text-white">
              App Settings
            </h1>
          </div>
        </div>

        {/* Location Section (Prompt Section 14: Where do you live?) */}
        <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest dark:text-leaf flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-base text-ink dark:text-white">
                  Where do you live?
                </h2>
                <span className="text-xs text-ink-soft dark:text-ink-muted">
                  Used to sync regional grid carbon intensity and state solar tariffs.
                </span>
              </div>
            </div>

            <button
              onClick={handleUseGps}
              disabled={isGpsLocating}
              className="min-h-[38px] px-3 rounded-xl bg-forest-50 dark:bg-forest-950/50 border border-forest/15 text-forest dark:text-emerald-400 text-xs font-heading font-semibold flex items-center gap-1.5 hover:bg-forest-100"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isGpsLocating ? 'Locating...' : 'Use GPS Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                State / Union Territory
              </label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
              >
                {Object.keys(INDIAN_STATES_CITIES).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-ink-soft dark:text-ink-muted mb-1">
                City / Hub
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-paper-card dark:bg-paper-surface border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[11px] text-ink-soft dark:text-ink-muted flex items-center gap-1 pt-1">
            <Globe className="w-3.5 h-3.5 text-forest" />
            <span>Active Location: <b>{selectedCity}, {selectedState}</b> ({user?.locationSource || 'Saved'})</span>
          </div>
        </div>

        {/* Price Drop Alert Settings */}
        <div className="bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-light text-amber-dark flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-base text-ink dark:text-white">
                  Price Drop &amp; Solar Peak Alerts
                </h2>
                <span className="text-xs text-ink-soft dark:text-ink-muted">
                  Get notified when tariff drops below your budget threshold.
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={priceAlertsEnabled}
              onChange={(e) => setPriceAlertsEnabled(e.target.checked)}
              className="w-5 h-5 accent-forest rounded"
            />
          </div>

          <div className="p-4 rounded-2xl bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-heading font-semibold">
              <span className="text-ink-soft dark:text-ink-muted">Alert Target Price:</span>
              <span className="text-forest dark:text-emerald-400 font-bold">
                ≤ ₹{Number(priceThreshold).toFixed(2)}/kWh
              </span>
            </div>
            <input
              type="range"
              min="5.50"
              max="9.00"
              step="0.10"
              value={priceThreshold}
              onChange={(e) => setPriceThreshold(e.target.value)}
              className="w-full accent-amber cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-soft dark:text-ink-muted">
              <span>₹5.50 (Ultra Cheap)</span>
              <span>₹7.00 (Standard Target)</span>
              <span>₹9.00</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveAll}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-sm shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Preferences Saved Successfully</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>
    </div>
  );
};
