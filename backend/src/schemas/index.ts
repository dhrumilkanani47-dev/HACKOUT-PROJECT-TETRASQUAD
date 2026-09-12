import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  locationSource: z.enum(['manual', 'gps']).default('manual'),
  role: z.enum(['DRIVER', 'OPERATOR']).default('DRIVER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateLocationSchema = z.object({
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationSource: z.enum(['manual', 'gps']).default('manual'),
});

export const vehicleCreateSchema = z.object({
  type: z.string().min(1, 'Vehicle type required (e.g. 4W, 2W, SUV)'),
  brand: z.string().min(1, 'Brand required (e.g. Tata, Ather, MG)'),
  model: z.string().min(1, 'Model required (e.g. Nexon EV, 450X)'),
  nickname: z.string().optional(),
  batteryCapacityKWh: z.number().positive('Battery capacity must be > 0'),
  connectorType: z.string().min(1, 'Connector type required (e.g. CCS2, Type 2, CHAdeMO)'),
  maxChargingPowerKW: z.number().positive('Max charging power must be > 0'),
  currentBatteryPercentage: z.number().int().min(0).max(100),
  targetBatteryPercentage: z.number().int().min(1).max(100).default(80),
  isPrimary: z.boolean().default(false),
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial();

export const stationQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().default(20),
  connector: z.string().optional(),
  minPower: z.coerce.number().optional(),
  network: z.string().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  available: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  greenEnergy: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  nearHospital: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  search: z.string().optional(),
});

export const hospitalQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().default(15),
});

export const aiRecommendationQuerySchema = z.object({
  mode: z.enum(['SMART', 'CHEAPEST', 'GREENEST', 'FASTEST', 'EMERGENCY']).default('SMART'),
  vehicleId: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  currentBatteryPercentage: z.coerce.number().min(0).max(100).optional(),
  targetBatteryPercentage: z.coerce.number().min(1).max(100).optional(),
});

export const aiChatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
  vehicleId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mode: z.enum(['SMART', 'CHEAPEST', 'GREENEST', 'FASTEST', 'EMERGENCY']).default('SMART'),
});

export const aiScheduleSchema = z.object({
  vehicleId: z.string(),
  targetBattery: z.number().int().min(10).max(100),
  deadline: z.string().or(z.date()), // Target ready time
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  preferences: z.object({
    mode: z.enum(['SMART', 'CHEAPEST', 'GREENEST', 'FASTEST']).default('SMART'),
    allowSolarOnly: z.boolean().default(false),
  }).optional(),
});

export const priceAlertSchema = z.object({
  targetPrice: z.number().positive('Target price must be positive'),
  vehicleId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusKm: z.number().positive().default(15),
  isForecastBased: z.boolean().default(false),
});

export const userPreferencesSchema = z.object({
  preferredMode: z.enum(['SMART', 'CHEAPEST', 'GREENEST', 'FASTEST', 'EMERGENCY']).default('SMART'),
  preferredNetworks: z.string().default('all'),
  preferredChargingTime: z.string().optional(),
  targetBattery: z.number().int().min(20).max(100).default(80),
  costPreference: z.number().int().min(0).max(100).default(50),
  speedPreference: z.number().int().min(0).max(100).default(50),
  greenPreference: z.number().int().min(0).max(100).default(50),
});
