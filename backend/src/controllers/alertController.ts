import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const alertController = {
  async createPriceAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { targetPrice, vehicleId, latitude, longitude, radiusKm, isForecastBased } = req.body;

      const alert = await prisma.priceAlert.create({
        data: {
          userId,
          vehicleId,
          targetPrice,
          latitude,
          longitude,
          radiusKm: radiusKm || 15,
          isForecastBased: Boolean(isForecastBased),
        },
      });

      res.status(201).json({
        success: true,
        data: {
          ...alert,
          label: isForecastBased ? 'Forecast-Based Tariff Alert' : 'Live Real-Time Tariff Alert',
          message: `Alert configured: You will be notified when dynamic charging price drops to ₹${targetPrice}/kWh.`,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getPriceAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const alerts = await prisma.priceAlert.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: alerts });
    } catch (error) {
      next(error);
    }
  },

  async deletePriceAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const alert = await prisma.priceAlert.findFirst({
        where: { id, userId },
      });

      if (!alert) {
        throw new AppError(404, 'ALERT_NOT_FOUND', 'Price alert not found');
      }

      await prisma.priceAlert.delete({ where: { id } });

      res.json({ success: true, data: { message: 'Alert deleted successfully' } });
    } catch (error) {
      next(error);
    }
  },
};
