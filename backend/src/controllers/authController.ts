import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prismaClient.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phone, state, city, latitude, longitude, locationSource, role } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError(409, 'USER_EXISTS', 'A user with this email address already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          phone,
          state,
          city,
          latitude: latitude ?? env.DEFAULT_LATITUDE,
          longitude: longitude ?? env.DEFAULT_LONGITUDE,
          locationSource: locationSource || 'manual',
          role: role || 'DRIVER',
          preferences: {
            create: {
              preferredMode: 'SMART',
              preferredNetworks: 'all',
              targetBattery: 80,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          state: true,
          city: true,
          latitude: true,
          longitude: true,
          locationSource: true,
          role: true,
          createdAt: true,
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any }
      );

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          vehicles: {
            where: { isPrimary: true },
            take: 1,
          },
          preferences: true,
        },
      });

      if (!user) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any }
      );

      const { passwordHash: _, ...safeUser } = user;

      res.json({
        success: true,
        data: {
          user: safeUser,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          vehicles: true,
          preferences: true,
          savedStations: {
            include: {
              station: {
                include: { network: true },
              },
            },
          },
        },
      });

      if (!user) {
        throw new AppError(404, 'USER_NOT_FOUND', 'User profile not found');
      }

      const { passwordHash: _, ...safeUser } = user;

      res.json({
        success: true,
        data: safeUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response) {
    // Stateless JWT logout (client discards token)
    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  },
};
