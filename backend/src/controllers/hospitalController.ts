import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { calculateDistanceKm } from '../utils/geo.js';

export const hospitalController = {
  async getNearbyHospitals(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = parseFloat(req.query.latitude as string);
      const lon = parseFloat(req.query.longitude as string);
      const radius = parseFloat((req.query.radius as string) || '15');

      const hospitals = await prisma.hospital.findMany();

      const nearby = hospitals
        .map((h) => {
          const distanceKm = calculateDistanceKm(lat, lon, h.latitude, h.longitude);
          return {
            id: h.id,
            name: h.name,
            latitude: h.latitude,
            longitude: h.longitude,
            address: h.address,
            city: h.city,
            state: h.state,
            phone: h.phone || 'DATA_UNAVAILABLE',
            emergencyAvailable: h.emergencyAvailable || 'UNKNOWN', // Never fabricated
            distanceKm,
            lastUpdated: h.lastUpdated,
          };
        })
        .filter((h) => h.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      res.json({
        success: true,
        data: {
          searchCenter: { latitude: lat, longitude: lon, radiusKm: radius },
          count: nearby.length,
          hospitals: nearby,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
