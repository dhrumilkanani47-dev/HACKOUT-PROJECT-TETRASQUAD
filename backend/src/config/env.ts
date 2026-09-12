import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/evgreencharge',
  JWT_SECRET: process.env.JWT_SECRET || 'evgreencharge_super_secure_jwt_secret_key_2026_india',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REDIS_URL: process.env.REDIS_URL || '',
  DEMO_MODE: process.env.DEMO_MODE !== 'false',
  AI_API_KEY: process.env.AI_API_KEY || '',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
  MAP_API_KEY: process.env.MAP_API_KEY || '',
  GRID_API_KEY: process.env.GRID_API_KEY || '',
  RENEWABLE_API_KEY: process.env.RENEWABLE_API_KEY || '',
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata',
  DEFAULT_STATE: process.env.DEFAULT_STATE || 'Gujarat',
  DEFAULT_CITY: process.env.DEFAULT_CITY || 'Gandhinagar',
  DEFAULT_LATITUDE: parseFloat(process.env.DEFAULT_LATITUDE || '23.1884'),
  DEFAULT_LONGITUDE: parseFloat(process.env.DEFAULT_LONGITUDE || '72.6289'),
};
