import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const profileController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          vehicles: true,
          preferences: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
      }

      const { passwordHash: _, ...safeUser } = user;
      res.json({ success: true, data: safeUser });
    } catch (error) {
      next(error);
    }
  },

  async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { state, city, latitude, longitude, locationSource } = req.body;

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          state,
          city,
          latitude,
          longitude,
          locationSource: locationSource || 'manual',
        },
        select: {
          id: true,
          name: true,
          email: true,
          state: true,
          city: true,
          latitude: true,
          longitude: true,
          locationSource: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};
