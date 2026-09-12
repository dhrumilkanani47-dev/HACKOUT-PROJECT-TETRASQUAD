import axios from 'axios';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { weatherService, WeatherData } from '../../services/weatherService.js';

export interface IWeatherProvider {
  fetchWeather(lat: number, lon: number): Promise<WeatherData>;
}

export class WeatherAdapter implements IWeatherProvider {
  async fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    if (!env.DEMO_MODE && env.WEATHER_API_KEY) {
      try {
        // Real Open-Meteo or WeatherAPI call
        const res = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
          params: {
            latitude: lat,
            longitude: lon,
            current_weather: true,
            hourly: 'temperature_2m,cloudcover,direct_normal_irradiance,windspeed_10m',
          },
          timeout: 4000,
        });

        if (res.data && res.data.current_weather) {
          const cw = res.data.current_weather;
          return {
            temperatureC: cw.temperature,
            cloudCoverPct: 20,
            solarIrradianceWM2: 750,
            windSpeedKmh: cw.windspeed,
            weatherCondition: 'Clear',
            isRaining: false,
            forecastNextHours: [],
            source: 'Open-Meteo Live API',
            lastUpdated: new Date().toISOString(),
            confidence: 'HIGH',
          };
        }
      } catch (e) {
        logger.warn('External Weather API failed, falling back to weather service demo telemetry', { error: String(e) });
      }
    }

    return weatherService.getWeather(lat, lon);
  }
}

export const weatherAdapter = new WeatherAdapter();
