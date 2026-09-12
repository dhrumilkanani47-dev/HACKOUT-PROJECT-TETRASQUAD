import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { calculateDistanceKm } from '../utils/geo.js';
import { vehicleCompatibilityService } from '../services/vehicleCompatibilityService.js';
import { AppError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

export const stationController = {
  async getStations(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        network,
        minPower,
        maxPrice,
        available,
        city,
        state,
      } = req.query as any;

      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (network && network !== 'all') {
        where.networkId = network;
      }

      if (city) {
        where.city = { contains: city, mode: 'insensitive' };
      }

      if (state) {
        where.state = { contains: state, mode: 'insensitive' };
      }

      if (minPower) {
        where.chargingPowerKW = { gte: parseFloat(minPower) };
      }

      if (maxPrice) {
        where.pricePerKWh = { lte: parseFloat(maxPrice) };
      }

      if (available === 'true' || available === true) {
        where.availableChargers = { gt: 0 };
      }

      const stations = await prisma.station.findMany({
        where,
        include: {
          network: true,
        },
        orderBy: { name: 'asc' },
      });

      res.json({ success: true, data: stations });
    } catch (error) {
      next(error);
    }
  },

  async getStationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const station = await prisma.station.findUnique({
        where: { id },
        include: {
          network: true,
          pricingRecords: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
          availabilityRecords: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      });

      if (!station) {
        throw new AppError(404, 'STATION_NOT_FOUND', 'Charging station not found');
      }

      res.json({ success: true, data: station });
    } catch (error) {
      next(error);
    }
  },

  async getNearbyStations(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = parseFloat((req.query.latitude as string) || String(env.DEFAULT_LATITUDE));
      const lon = parseFloat((req.query.longitude as string) || String(env.DEFAULT_LONGITUDE));
      const radius = parseFloat((req.query.radius as string) || '25');

      const allStations = await prisma.station.findMany({
        include: { network: true },
      });

      const withDistance = allStations
        .map((st) => {
          const distanceKm = calculateDistanceKm(lat, lon, st.latitude, st.longitude);
          return {
            ...st,
            distanceKm,
          };
        })
        .filter((st) => st.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      res.json({
        success: true,
        data: {
          searchCenter: { latitude: lat, longitude: lon, radiusKm: radius },
          count: withDistance.length,
          stations: withDistance,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getCompatibleStations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const vehicleId = req.query.vehicleId as string;

      let vehicle = null;
      if (vehicleId) {
        vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      } else if (userId) {
        vehicle = await prisma.vehicle.findFirst({
          where: { userId, isPrimary: true },
        });
      }

      if (!vehicle) {
        // Fallback to default Tata Nexon EV CCS2
        vehicle = {
          connectorType: 'CCS2',
          maxChargingPowerKW: 50,
          type: 'SUV',
        } as any;
      }

      const allStations = await prisma.station.findMany({
        include: { network: true },
      });

      const compatibleStations = allStations.map((st) => {
        const comp = vehicleCompatibilityService.checkCompatibility(vehicle, st);
        return {
          ...st,
          compatibility: comp,
        };
      }).filter((st) => st.compatibility.compatible);

      res.json({
        success: true,
        data: {
          vehicleMatched: vehicle,
          count: compatibleStations.length,
          stations: compatibleStations,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getNetworks(req: Request, res: Response, next: NextFunction) {
    try {
      const networks = await prisma.chargingNetwork.findMany({
        where: { active: true },
        include: {
          _count: {
            select: { stations: true },
          },
        },
      });

      res.json({ success: true, data: networks });
    } catch (error) {
      next(error);
    }
  },

  async getMapContext(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = parseFloat((req.query.latitude as string) || String(env.DEFAULT_LATITUDE));
      const lon = parseFloat((req.query.longitude as string) || String(env.DEFAULT_LONGITUDE));
      const radius = parseFloat((req.query.radius as string) || '30');

      const [stations, hospitals, networks] = await Promise.all([
        prisma.station.findMany({ include: { network: true } }),
        prisma.hospital.findMany(),
        prisma.chargingNetwork.findMany({ where: { active: true } }),
      ]);

      const stationsNearby = stations
        .map((s) => ({
          ...s,
          distanceKm: calculateDistanceKm(lat, lon, s.latitude, s.longitude),
        }))
        .filter((s) => s.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      const hospitalsNearby = hospitals
        .map((h) => ({
          ...h,
          distanceKm: calculateDistanceKm(lat, lon, h.latitude, h.longitude),
        }))
        .filter((h) => h.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      res.json({
        success: true,
        data: {
          center: { latitude: lat, longitude: lon, radiusKm: radius },
          stations: stationsNearby,
          hospitals: hospitalsNearby,
          networks,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
