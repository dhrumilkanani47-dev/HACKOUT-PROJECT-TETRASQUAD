import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const savedStationController = {
  async getSavedStations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const saved = await prisma.savedStation.findMany({
        where: { userId },
        include: {
          station: {
            include: { network: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: saved });
    } catch (error) {
      next(error);
    }
  },

  async saveStation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { stationId } = req.body;

      if (!stationId) {
        throw new AppError(400, 'STATION_ID_REQUIRED', 'stationId is required');
      }

      const existing = await prisma.savedStation.findUnique({
        where: {
          userId_stationId: {
            userId,
            stationId,
          },
        },
      });

      if (existing) {
        return res.json({ success: true, data: existing, message: 'Station already saved' });
      }

      const saved = await prisma.savedStation.create({
        data: {
          userId,
          stationId,
        },
        include: {
          station: { include: { network: true } },
        },
      });

      res.status(201).json({ success: true, data: saved });
    } catch (error) {
      next(error);
    }
  },

  async removeSavedStation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const record = await prisma.savedStation.findFirst({
        where: {
          OR: [
            { id, userId },
            { stationId: id, userId },
          ],
        },
      });

      if (!record) {
        throw new AppError(404, 'SAVED_STATION_NOT_FOUND', 'Saved station not found');
      }

      await prisma.savedStation.delete({ where: { id: record.id } });

      res.json({ success: true, data: { message: 'Station removed from saved list' } });
    } catch (error) {
      next(error);
    }
  },
};
