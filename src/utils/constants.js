export const PRICE_STATUS_LEVELS = {
  CHEAP: {
    label: 'CHEAP',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    threshold: 7.0
  },
  GOOD: {
    label: 'GOOD',
    color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800',
    dot: 'bg-green-500',
    threshold: 8.5
  },
  NORMAL: {
    label: 'NORMAL',
    color: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    dot: 'bg-sky-500',
    threshold: 10.0
  },
  EXPENSIVE: {
    label: 'EXPENSIVE',
    color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
    threshold: 12.5
  },
  VERY_EXPENSIVE: {
    label: 'VERY EXPENSIVE',
    color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
    threshold: Infinity
  }
};

export const getPriceStatus = (price) => {
  if (price <= 7.0) return PRICE_STATUS_LEVELS.CHEAP;
  if (price <= 8.5) return PRICE_STATUS_LEVELS.GOOD;
  if (price <= 10.0) return PRICE_STATUS_LEVELS.NORMAL;
  if (price <= 12.5) return PRICE_STATUS_LEVELS.EXPENSIVE;
  return PRICE_STATUS_LEVELS.VERY_EXPENSIVE;
};

export const CHARGING_NETWORKS = [
  { id: 'jio-bp', name: 'Jio-bp pulse', logo: '⚡', color: '#00529B', count: 1420 },
  { id: 'tata-power', name: 'Tata Power EZ Charge', logo: '🔋', color: '#0072CE', count: 4800 },
  { id: 'chargezone', name: 'ChargeZone', logo: '⚡', color: '#38A169', count: 2100 },
  { id: 'statiq', name: 'Statiq', logo: '🔌', color: '#E53E3E', count: 1850 },
  { id: 'zeon', name: 'Zeon Charging', logo: '⚡', color: '#DD6B20', count: 950 },
  { id: 'hpcl', name: 'HPCL EV', logo: '⛽', color: '#D69E2E', count: 2400 },
  { id: 'iocl', name: 'IndianOil EV', logo: '⛽', color: '#E53E3E', count: 3200 },
  { id: 'bpcl', name: 'BPCL eDrive', logo: '⛽', color: '#319795', count: 2900 },
  { id: 'other', name: 'Other Independent', logo: '⚡', color: '#718096', count: 1100 }
];

export const CONNECTOR_TYPES = [
  { id: 'ccs2', name: 'CCS2 (DC Fast)', speed: 'Fast DC (30 - 150 kW)', category: 'Car / SUV' },
  { id: 'type2', name: 'Type 2 (AC Fast)', speed: 'Fast AC (7.4 - 22 kW)', category: 'All' },
  { id: 'gbt', name: 'GB/T (DC Fast)', speed: 'DC Fast (15 - 50 kW)', category: 'Fleet / Car' },
  { id: 'chademo', name: 'CHAdeMO (DC)', speed: 'DC Fast (25 - 50 kW)', category: 'Car' },
  { id: 'bharat_ac', name: 'Bharat AC001', speed: 'AC Slow (3.3 kW x 3)', category: '2W / 3W / 4W' },
  { id: '15a_socket', name: '15A Standard Socket', speed: 'Standard AC (3.3 kW)', category: '2W / 3W' }
];

export const VEHICLE_TYPES = [
  'Car',
  'SUV',
  'Sedan',
  'Hatchback',
  'Scooter',
  'Motorcycle',
  'Other EV'
];

export const INDIAN_STATES_CITIES = {
  'Gujarat': ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  'Delhi NCR': ['New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur']
};

export const VEHICLE_PRESETS = [
  { brand: 'Tata', model: 'Nexon EV Long Range', type: 'SUV', capacity: 40.5, connector: 'CCS2', maxPower: 50, standardRange: 453 },
  { brand: 'Tata', model: 'Punch EV', type: 'SUV', capacity: 35.0, connector: 'CCS2', maxPower: 45, standardRange: 365 },
  { brand: 'Tata', model: 'Tiago EV', type: 'Hatchback', capacity: 24.0, connector: 'CCS2', maxPower: 25, standardRange: 250 },
  { brand: 'Tata', model: 'Curvv EV', type: 'SUV', capacity: 55.0, connector: 'CCS2', maxPower: 70, standardRange: 502 },
  { brand: 'Mahindra', model: 'XUV400 EV', type: 'SUV', capacity: 39.4, connector: 'CCS2', maxPower: 50, standardRange: 456 },
  { brand: 'MG', model: 'ZS EV', type: 'SUV', capacity: 50.3, connector: 'CCS2', maxPower: 60, standardRange: 461 },
  { brand: 'MG', model: 'Comet EV', type: 'Hatchback', capacity: 17.3, connector: 'Type 2', maxPower: 3.3, standardRange: 230 },
  { brand: 'Hyundai', model: 'Ioniq 5', type: 'SUV', capacity: 72.6, connector: 'CCS2', maxPower: 350, standardRange: 631 },
  { brand: 'BYD', model: 'Atto 3', type: 'SUV', capacity: 60.48, connector: 'CCS2', maxPower: 80, standardRange: 521 },
  { brand: 'Ola', model: 'S1 Pro Gen 2', type: 'Scooter', capacity: 4.0, connector: '15A Socket', maxPower: 3.0, standardRange: 195 },
  { brand: 'Ather', model: '450X Gen 3', type: 'Scooter', capacity: 3.7, connector: 'Type 2', maxPower: 3.0, standardRange: 150 },
  { brand: 'TVS', model: 'iQube ST', type: 'Scooter', capacity: 5.1, connector: '15A Socket', maxPower: 2.5, standardRange: 140 }
];

export const AI_MODES = [
  { id: 'smart', label: 'Smart AI', icon: 'Sparkles', desc: 'Balances cost, speed & green energy mix' },
  { id: 'cheapest', label: 'Cheapest', icon: 'TrendingDown', desc: 'Prioritizes lowest ₹/kWh & discounts' },
  { id: 'greenest', label: 'Greenest', icon: 'Leaf', desc: 'Highest solar/wind % and Green Score' },
  { id: 'fastest', label: 'Fastest', icon: 'Zap', desc: 'High-power 60kW-150kW DC chargers' },
  { id: 'emergency', label: 'Emergency', icon: 'AlertTriangle', desc: 'Nearest available functional charger' }
];
