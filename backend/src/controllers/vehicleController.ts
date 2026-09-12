import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { AppError } from '../middleware/errorHandler.js';

export const vehicleController = {
  async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const vehicles = await prisma.vehicle.findMany({
        where: { userId },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
      });

      res.json({ success: true, data: vehicles });
    } catch (error) {
      next(error);
    }
  },

  async getVehicleById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const vehicle = await prisma.vehicle.findFirst({
        where: { id, userId },
      });

      if (!vehicle) {
        throw new AppError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found or does not belong to you');
      }

      res.json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  },

  async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;

      // If user marks this as primary, demote existing primary vehicles
      if (data.isPrimary) {
        await prisma.vehicle.updateMany({
          where: { userId, isPrimary: true },
          data: { isPrimary: false },
        });
      } else {
        // If this is the user's first vehicle, make it primary automatically
        const count = await prisma.vehicle.count({ where: { userId } });
        if (count === 0) {
          data.isPrimary = true;
        }
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          ...data,
          userId, // Strictly derived from JWT session
        },
      });

      res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  },

  async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data = req.body;

      // Verify ownership
      const existing = await prisma.vehicle.findFirst({ where: { id, userId } });
      if (!existing) {
        throw new AppError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found or does not belong to you');
      }

      if (data.isPrimary) {
        await prisma.vehicle.updateMany({
          where: { userId, isPrimary: true, id: { not: id } },
          data: { isPrimary: false },
        });
      }

      const updated = await prisma.vehicle.update({
        where: { id },
        data,
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.vehicle.findFirst({ where: { id, userId } });
      if (!existing) {
        throw new AppError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found or does not belong to you');
      }

      await prisma.vehicle.delete({ where: { id } });

      // If deleted vehicle was primary, promote another one if available
      if (existing.isPrimary) {
        const nextVehicle = await prisma.vehicle.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        if (nextVehicle) {
          await prisma.vehicle.update({
            where: { id: nextVehicle.id },
            data: { isPrimary: true },
          });
        }
      }

      res.json({ success: true, data: { message: 'Vehicle deleted successfully' } });
    } catch (error) {
      next(error);
    }
  },

  async setPrimaryVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const existing = await prisma.vehicle.findFirst({ where: { id, userId } });
      if (!existing) {
        throw new AppError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found or does not belong to you');
      }

      await prisma.$transaction([
        prisma.vehicle.updateMany({
          where: { userId, isPrimary: true },
          data: { isPrimary: false },
        }),
        prisma.vehicle.update({
          where: { id },
          data: { isPrimary: true },
        }),
      ]);

      const primary = await prisma.vehicle.findUnique({ where: { id } });

      res.json({ success: true, data: primary });
    } catch (error) {
      next(error);
    }
  },
};
