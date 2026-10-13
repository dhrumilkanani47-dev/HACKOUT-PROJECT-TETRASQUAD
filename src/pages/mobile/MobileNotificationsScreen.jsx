import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileStatusBar } from '../../components/mobile/MobileStatusBar';
import { MobileTopNav } from '../../components/mobile/MobileTopNav';
import {
  Bell,
  Sliders,
  Check,
  TrendingDown,
  TrendingUp,
  CalendarCheck,
  Activity,
  Zap,
  Leaf,
  AlertTriangle,
  BatteryCharging,
  Layers,
  Save,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useStations } from '../../context/StationContext';
import { useAuth } from '../../context/AuthContext';

// Clean Toggle Switch Component
const SettingToggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-2 border-t border-slate-100 first:border-0">
    <div className="pr-3">
      <div className="text-[11px] font-semibold text-slate-800">{label}</div>
      {description && <div className="text-[9px] text-slate-400 leading-tight mt-0.5">{description}</div>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
        enabled ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
    >
      <div
        className={`bg-white w-3.5 h-3.5 rounded-full shadow-xs transform transition-transform duration-200 ${
          enabled ? 'translate-x-3.5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const MobileNotificationsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stations } = useStations();
  const role = user?.role || 'driver';

  // 1. Driver state with localStorage persistence
  const [driverSettings, setDriverSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('egc_alert_settings_driver');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      targetPrice: 7.00,
      priceAlerts: true,
      bookingAlerts: true,
      greenAlerts: true,
      soundEnabled: true,
    };
  });

  // 2. Station Operator state with localStorage persistence
  const [operatorSettings, setOperatorSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('egc_alert_settings_operator');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      occupancyThreshold: 80,
      occupancyAlerts: true,
      bookingAlerts: true,
      greenTariffAlerts: true,
      autoDispatchNotice: true,
    };
  });

  // 3. Grid Operator state with localStorage persistence
  const [gridSettings, setGridSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('egc_alert_settings_grid_operator');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      frequencyThreshold: 49.85,
      frequencyAlerts: true,
      renewableSurgeAlerts: true,
      peakLoadAlerts: true,
      autoStabilizeNotice: true,
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(() => {
    return localStorage.getItem(`egc_alerts_last_saved_${role}`) || null;
  });

  const bookingStation = stations.find((station) => localStorage.getItem(`egc_booking_${station.id}`));
  const bookingTime = bookingStation ? localStorage.getItem(`egc_booking_${bookingStation.id}`) : null;

  const nearbyStations = useMemo(() => stations.filter((station) => (station.distanceKm || 99) <= 5), [stations]);
  const cheapestStation = [...nearbyStations].sort((a, b) => a.pricePerKwh - b.pricePerKwh)[0];
  const expensiveStation = [...nearbyStations].sort((a, b) => b.pricePerKwh - a.pricePerKwh)[0];

  // Save handler for current role
  const handleSave = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (role === 'grid_operator') {
      localStorage.setItem('egc_alert_settings_grid_operator', JSON.stringify(gridSettings));
      localStorage.setItem('egc_grid_freq_threshold', gridSettings.frequencyThreshold.toString());
    } else if (role === 'operator') {
      localStorage.setItem('egc_alert_settings_operator', JSON.stringify(operatorSettings));
      localStorage.setItem('egc_operator_occupancy_threshold', operatorSettings.occupancyThreshold.toString());
    } else {
      localStorage.setItem('egc_alert_settings_driver', JSON.stringify(driverSettings));
      localStorage.setItem('egc_driver_target_price', driverSettings.targetPrice.toString());
    }

    localStorage.setItem(`egc_alerts_last_saved_${role}`, timestamp);
    setLastSavedTime(timestamp);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Immediate sync for toggle adjustments
  useEffect(() => {
    if (role === 'grid_operator') {
      localStorage.setItem('egc_alert_settings_grid_operator', JSON.stringify(gridSettings));
    } else if (role === 'operator') {
      localStorage.setItem('egc_alert_settings_operator', JSON.stringify(operatorSettings));
    } else {
      localStorage.setItem('egc_alert_settings_driver', JSON.stringify(driverSettings));
    }
  }, [driverSettings, operatorSettings, gridSettings, role]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full h-full min-h-[580px] flex flex-col justify-between bg-white select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <MobileStatusBar />
        <MobileTopNav
          title={
            role === 'grid_operator'
              ? 'Grid Alerts & Data'
              : role === 'operator'
              ? 'Station Alerts'
              : 'Notifications & Alerts'
          }
          onBack={handleBack}
        />

        {/* Success floating badge */}
        {savedSuccess && (
          <div className="mx-4 mt-2 px-3 py-2 bg-emerald-500 text-slate-950 font-heading font-bold text-xs rounded-xl flex items-center justify-between shadow-md transition-all animate-in fade-in slide-in-from-top-1">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              Changes saved successfully!
            </span>
            <span className="text-[10px] font-normal text-slate-900/80">Active now</span>
          </div>
        )}

        {/* Content Container */}
        <div className="px-4 pt-2 pb-5 flex flex-col gap-2.5">
          {/* ======================================================== */}
          {/* 1. GRID OPERATOR VIEW                                    */}
          {/* ======================================================== */}
          {role === 'grid_operator' && (
            <>
              {gridSettings.frequencyAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="pill-tag green flex items-center gap-1 w-fit">
                      <Activity className="w-3 h-3" /> Grid Stability Alert
                    </span>
                    <span className="text-[9.5px] text-emerald-700 font-bold">Live</span>
                  </div>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    Gujarat SLDC Frequency is currently <b>50.02 Hz (Nominal)</b>. All regional feeders and substation transformers are balanced.
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Real-time telemetry update • SLDC Feed
                  </div>
                </div>
              )}

              {gridSettings.renewableSurgeAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="pill-tag sky flex items-center gap-1 w-fit">
                      <Leaf className="w-3 h-3 text-emerald-600" /> Renewable Surge
                    </span>
                    <span className="text-[9.5px] text-sky-700 font-bold">Optimal</span>
                  </div>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    High solar injection detected across Charanka & Dholera solar parks (<b>64% clean energy mix</b>). Optimal window for EV charging absorption.
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Clean energy dispatch recommendation
                  </div>
                </div>
              )}

              {gridSettings.peakLoadAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="pill-tag amber flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" /> Peak Demand Advisory
                    </span>
                    <span className="text-[9.5px] text-amber-700 font-bold">18:00 - 21:00</span>
                  </div>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    Peak evening demand anticipated between <b>18:00 – 21:00 IST</b>. Consider triggering dynamic tariff incentives to prevent feeder bottlenecks.
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Grid load balancing notification
                  </div>
                </div>
              )}

              {/* Grid Settings & Threshold Configuration Card */}
              <div className="app-card mt-1 py-3 px-3 bg-white border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    Frequency Low Alert: {gridSettings.frequencyThreshold.toFixed(2)} Hz
                  </span>
                  {lastSavedTime && (
                    <span className="text-[9px] text-slate-400 font-medium">
                      Saved {lastSavedTime}
                    </span>
                  )}
                </div>

                <input
                  type="range"
                  min="49.50"
                  max="50.20"
                  step="0.05"
                  value={gridSettings.frequencyThreshold}
                  onChange={(e) =>
                    setGridSettings((prev) => ({
                      ...prev,
                      frequencyThreshold: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />

                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium">
                  <span>49.50 Hz (Critical trip)</span>
                  <span>50.20 Hz (High)</span>
                </div>

                {/* Grid Operator Notification Toggles */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col">
                  <SettingToggle
                    label="Frequency Trip Warning"
                    description="Trigger instant push notification when frequency dips below threshold"
                    enabled={gridSettings.frequencyAlerts}
                    onChange={(val) => setGridSettings((p) => ({ ...p, frequencyAlerts: val }))}
                  />
                  <SettingToggle
                    label="Solar & Wind Surge Alerts"
                    description="Alert when green power share exceeds 60% across state"
                    enabled={gridSettings.renewableSurgeAlerts}
                    onChange={(val) => setGridSettings((p) => ({ ...p, renewableSurgeAlerts: val }))}
                  />
                  <SettingToggle
                    label="Peak Load Advisories"
                    description="Notify during peak demand intervals to throttle high loads"
                    enabled={gridSettings.peakLoadAlerts}
                    onChange={(val) => setGridSettings((p) => ({ ...p, peakLoadAlerts: val }))}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="app-btn w-full mt-3 py-2 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Grid Alert Settings
                </button>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 2. STATION OPERATOR VIEW                                 */}
          {/* ======================================================== */}
          {role === 'operator' && (
            <>
              {operatorSettings.occupancyAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="pill-tag amber flex items-center gap-1 w-fit">
                      <BatteryCharging className="w-3 h-3" /> High Station Occupancy
                    </span>
                    <span className="text-[9.5px] text-amber-700 font-bold">75% Load</span>
                  </div>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    Charging hub Gandhinagar Central has <b>3 of 4 bays occupied (75% load)</b>. High traffic expected during next 2 hours.
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Live station capacity alert
                  </div>
                </div>
              )}

              {operatorSettings.bookingAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="pill-tag sky flex items-center gap-1 w-fit">
                      <CalendarCheck className="w-3 h-3" /> Slot Booking Request
                    </span>
                    <span className="text-[9.5px] text-sky-700 font-bold">Pending</span>
                  </div>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    A driver requested a <b>45-minute CCS2 fast charging slot</b> for a Tata Nexon EV at 16:00 IST. Check slot booking requests to approve.
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Booking queue notification
                  </div>
                </div>
              )}

              {operatorSettings.greenTariffAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="pill-tag green flex items-center gap-1 w-fit">
                      <TrendingDown className="w-3 h-3" /> Green Energy Tariff Window
                    </span>
                    <span className="text-[9.5px] text-emerald-700 font-bold">+24% Drivers</span>
                  </div>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    Grid renewable availability is above 60%. Lowering tariffs to <b>₹7.20/kWh</b> could increase station turnover by ~24%.
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Revenue optimization advice
                  </div>
                </div>
              )}

              {/* Operator Settings & Threshold Card */}
              <div className="app-card mt-1 py-3 px-3 bg-white border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    High Occupancy Alert Threshold: {operatorSettings.occupancyThreshold}%
                  </span>
                  {lastSavedTime && (
                    <span className="text-[9px] text-slate-400 font-medium">
                      Saved {lastSavedTime}
                    </span>
                  )}
                </div>

                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={operatorSettings.occupancyThreshold}
                  onChange={(e) =>
                    setOperatorSettings((prev) => ({
                      ...prev,
                      occupancyThreshold: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />

                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium">
                  <span>50% (Moderate)</span>
                  <span>95% (Near full capacity)</span>
                </div>

                {/* Operator Notification Toggles */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col">
                  <SettingToggle
                    label="Station Occupancy Warnings"
                    description="Send warnings when bays are occupied beyond threshold"
                    enabled={operatorSettings.occupancyAlerts}
                    onChange={(val) => setOperatorSettings((p) => ({ ...p, occupancyAlerts: val }))}
                  />
                  <SettingToggle
                    label="Incoming Slot Requests"
                    description="Instant alert when driver submits slot reservation"
                    enabled={operatorSettings.bookingAlerts}
                    onChange={(val) => setOperatorSettings((p) => ({ ...p, bookingAlerts: val }))}
                  />
                  <SettingToggle
                    label="Green Tariff Recommendations"
                    description="Smart prompt to adjust pricing during high renewable supply"
                    enabled={operatorSettings.greenTariffAlerts}
                    onChange={(val) => setOperatorSettings((p) => ({ ...p, greenTariffAlerts: val }))}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="app-btn w-full mt-3 py-2 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Station Alert Settings
                </button>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 3. EV DRIVER VIEW                                        */}
          {/* ======================================================== */}
          {role !== 'operator' && role !== 'grid_operator' && (
            <>
              {driverSettings.priceAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <span className="pill-tag amber flex items-center gap-1 w-fit">
                    <TrendingUp className="w-3 h-3" /> High price nearby
                  </span>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    {expensiveStation ? (
                      <>
                        <b>{expensiveStation.name}</b> is charging{' '}
                        <b className="font-heading text-red-600">
                          ₹{expensiveStation.pricePerKwh.toFixed(2)}/kWh
                        </b>.
                      </>
                    ) : (
                      'No nearby high-price station data is available.'
                    )}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Nearby station price alert
                  </div>
                </div>
              )}

              {driverSettings.priceAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <span className="pill-tag green flex items-center gap-1 w-fit">
                    <TrendingDown className="w-3 h-3" /> Low price nearby
                  </span>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    {cheapestStation ? (
                      <>
                        <b>{cheapestStation.name}</b> is charging{' '}
                        <b className="font-heading text-emerald-700">
                          ₹{cheapestStation.pricePerKwh.toFixed(2)}/kWh
                        </b>{' '}
                        and has {cheapestStation.availableChargers} slots available.
                      </>
                    ) : (
                      'No nearby low-price station data is available.'
                    )}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Best nearby price
                  </div>
                </div>
              )}

              {driverSettings.bookingAlerts && (
                <div className="app-card py-2.5 px-3 bg-white">
                  <span className="pill-tag sky flex items-center gap-1 w-fit">
                    <CalendarCheck className="w-3 h-3" /> Booking status
                  </span>
                  <div className="text-[11.5px] text-slate-800 mt-1.5 leading-snug">
                    {bookingStation ? (
                      <>
                        <b>{bookingStation.name}</b> has a confirmed charging slot at{' '}
                        <b>{bookingTime}</b>. You can cancel it from the station details screen.
                      </>
                    ) : (
                      'No active charging slot is booked. Select a station on the map to reserve a time.'
                    )}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-sans">
                    Booking update
                  </div>
                </div>
              )}

              {/* Set Price Alert Target & Driver Notification Settings */}
              <div className="app-card mt-1 py-3 px-3 bg-white border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    Target Price Alert: ₹{driverSettings.targetPrice.toFixed(2)}/kWh
                  </span>
                  {lastSavedTime && (
                    <span className="text-[9px] text-slate-400 font-medium">
                      Saved {lastSavedTime}
                    </span>
                  )}
                </div>

                <input
                  type="range"
                  min="5.50"
                  max="9.50"
                  step="0.25"
                  value={driverSettings.targetPrice}
                  onChange={(e) =>
                    setDriverSettings((prev) => ({
                      ...prev,
                      targetPrice: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-green-100 rounded-lg"
                />

                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium">
                  <span>₹5.50 (Super cheap)</span>
                  <span>₹9.50 (Normal)</span>
                </div>

                {/* Driver Notification Toggles */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col">
                  <SettingToggle
                    label="Station Price Alerts"
                    description="Notify when nearby stations drop below your target price"
                    enabled={driverSettings.priceAlerts}
                    onChange={(val) => setDriverSettings((p) => ({ ...p, priceAlerts: val }))}
                  />
                  <SettingToggle
                    label="Slot Booking Reminders"
                    description="Remind 15 minutes before your confirmed charging session"
                    enabled={driverSettings.bookingAlerts}
                    onChange={(val) => setDriverSettings((p) => ({ ...p, bookingAlerts: val }))}
                  />
                  <SettingToggle
                    label="Green Energy Peak Alerts"
                    description="Alert when clean solar/wind power reaches over 60%"
                    enabled={driverSettings.greenAlerts}
                    onChange={(val) => setDriverSettings((p) => ({ ...p, greenAlerts: val }))}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="app-btn w-full mt-3 py-2 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Alert Preferences
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationsScreen;


