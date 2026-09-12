import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const activityController = {
  async getActivitySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const sessions = await prisma.chargingSession.findMany({
        where: { userId },
        include: {
          station: { include: { network: true } },
          vehicle: true,
        },
        orderBy: { startTime: 'desc' },
      });

      const totalSessions = sessions.length;
      const totalEnergyKWh = Math.round(sessions.reduce((acc, s) => acc + s.energyConsumedKWh, 0) * 10) / 10;
      const totalCostInr = Math.round(sessions.reduce((acc, s) => acc + s.totalCost, 0));
      const totalCo2AvoidedKg = Math.round(sessions.reduce((acc, s) => acc + (s.co2AvoidedKg || 0), 0) * 10) / 10;
      const avgGreenScore = totalSessions > 0
        ? Math.round(sessions.reduce((acc, s) => acc + s.greenScore, 0) / totalSessions)
        : 90;

      res.json({
        success: true,
        data: {
          stats: {
            totalSessions,
            totalEnergyChargedKWh: totalEnergyKWh,
            totalCostInr,
            totalCo2AvoidedKg,
            averageGreenScore: avgGreenScore,
            totalSavedInr: Math.round(totalCostInr * 0.28), // savings vs petrol
          },
          recentSessions: sessions.slice(0, 5),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getChargingSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const sessions = await prisma.chargingSession.findMany({
        where: { userId },
        include: {
          station: { include: { network: true } },
          vehicle: true,
        },
        orderBy: { startTime: 'desc' },
      });

      res.json({ success: true, data: sessions });
    } catch (error) {
      next(error);
    }
  },

  async createChargingSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        vehicleId,
        stationId,
        energyConsumedKWh,
        pricePerKWh,
        totalCost,
        energyMix,
        greenScore,
        carbonEstimate,
        co2AvoidedKg,
      } = req.body;

      const session = await prisma.chargingSession.create({
        data: {
          userId,
          vehicleId,
          stationId,
          energyConsumedKWh,
          pricePerKWh,
          totalCost,
          energyMix: typeof energyMix === 'object' ? JSON.stringify(energyMix) : (energyMix || '{}'),
          greenScore: greenScore || 85,
          carbonEstimate: carbonEstimate || 0.15,
          co2AvoidedKg: co2AvoidedKg || (energyConsumedKWh * 0.55),
          status: 'COMPLETED',
          endTime: new Date(),
        },
      });

      res.status(201).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  },
};
