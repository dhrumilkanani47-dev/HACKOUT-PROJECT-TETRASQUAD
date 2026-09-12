import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const notificationController = {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });

      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  },

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;

      const updated = await prisma.userPreference.upsert({
        where: { userId },
        create: {
          userId,
          ...data,
        },
        update: data,
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const notif = await prisma.notification.findFirst({
        where: { id, userId },
      });

      if (!notif) {
        throw new AppError(404, 'NOTIF_NOT_FOUND', 'Notification not found');
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { read: true },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },
};
