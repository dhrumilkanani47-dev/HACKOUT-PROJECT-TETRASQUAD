export const formatCurrency = (amount, decimals = 2) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return `₹${Number(amount).toFixed(decimals)}`;
};

export const formatEnergy = (kwh, decimals = 1) => {
  if (kwh === undefined || kwh === null || isNaN(kwh)) return '0.0 kWh';
  return `${Number(kwh).toFixed(decimals)} kWh`;
};

export const formatDistance = (km) => {
  if (km === undefined || km === null || isNaN(km)) return '0.0 km';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${Number(km).toFixed(1)} km`;
};

export const formatPercent = (pct) => {
  if (pct === undefined || pct === null || isNaN(pct)) return '0%';
  return `${Math.round(Number(pct))}%`;
};

export const formatTime = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const formatDate = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const calculateSavings = (actualPrice, baselinePrice = 11.5, energyKwh = 24.5) => {
  const diff = Math.max(0, baselinePrice - actualPrice);
  return Math.round(diff * energyKwh);
};

export const calculateCo2Avoided = (kwh, renewablePct = 75) => {
  // Coal grid emits ~0.82 kg CO2 per kWh in India.
  // Renewable saves corresponding ratio.
  const carbonAvoidedPerKwh = 0.82 * (renewablePct / 100);
  return (kwh * carbonAvoidedPerKwh).toFixed(1);
};
