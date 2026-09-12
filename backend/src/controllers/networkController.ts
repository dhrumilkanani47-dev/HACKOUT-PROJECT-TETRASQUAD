import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';

export const networkController = {
  async getNetworks(req: Request, res: Response, next: NextFunction) {
    try {
      const networks = await prisma.chargingNetwork.findMany({
        where: { active: true },
        include: {
          _count: {
            select: { stations: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      res.json({ success: true, data: networks });
    } catch (error) {
      next(error);
    }
  },
};
