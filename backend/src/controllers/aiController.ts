import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient.js';
import { aiEngine } from '../ai/AIEngine.js';
import { recommendationEngine } from '../ai/RecommendationEngine.js';
import { chargingTimePrediction } from '../ai/ChargingTimePrediction.js';
import { pricingEngine } from '../services/pricingEngine.js';
import { AIMode } from '../types/index.js';
import { env } from '../config/env.js';

export const aiController = {
  async getRecommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const mode = (req.query.mode as AIMode) || 'SMART';
      const lat = parseFloat((req.query.latitude as string) || String(env.DEFAULT_LATITUDE));
      const lon = parseFloat((req.query.longitude as string) || String(env.DEFAULT_LONGITUDE));
      const vehicleId = req.query.vehicleId as string;
      const batteryPct = req.query.currentBatteryPercentage
        ? parseInt(req.query.currentBatteryPercentage as string, 10)
        : undefined;
      const targetBatteryPct = req.query.targetBatteryPercentage
        ? parseInt(req.query.targetBatteryPercentage as string, 10)
        : undefined;

      const userId = req.user?.id;

      // Find vehicle
      let vehicle = null;
      if (vehicleId) {
        vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      } else if (userId) {
        vehicle = await prisma.vehicle.findFirst({
          where: { userId, isPrimary: true },
        });
      }

      if (!vehicle) {
        vehicle = {
          id: 'preset_nexon',
          brand: 'Tata',
          model: 'Nexon EV Empowered+',
          connectorType: 'CCS2',
          maxChargingPowerKW: 50,
          batteryCapacityKWh: 40.5,
          currentBatteryPercentage: batteryPct ?? 24,
          targetBatteryPercentage: targetBatteryPct ?? 80,
          type: 'SUV',
        } as any;
      } else {
        if (batteryPct !== undefined) vehicle.currentBatteryPercentage = batteryPct;
        if (targetBatteryPct !== undefined) vehicle.targetBatteryPercentage = targetBatteryPct;
      }

      const stations = await prisma.station.findMany({
        include: { network: true },
      });

      const recommendation = recommendationEngine.getRecommendation({
        userLocation: { latitude: lat, longitude: lon },
        vehicle: vehicle!,
        mode,
        stations,
      });

      if (!recommendation) {
        return res.json({
          success: true,
          data: {
            message: 'No stations found in the current vicinity.',
            recommendation: null,
          },
        });
      }

      const bestWindowData = pricingEngine.findBestChargingWindow();

      res.json({
        success: true,
        data: {
          bestStation: {
            id: recommendation.stationId,
            name: recommendation.stationName,
            network: recommendation.networkName,
            distanceKm: recommendation.distanceKm,
            score: recommendation.score,
          },
          bestTime: bestWindowData.bestWindow,
          estimatedPrice: `₹${recommendation.estimatedPricePerKWh.toFixed(2)}/kWh`,
          estimatedPricePerKWh: recommendation.estimatedPricePerKWh,
          estimatedCost: `₹${recommendation.estimatedCostInr}`,
          estimatedCostInr: recommendation.estimatedCostInr,
          estimatedChargingTime: `${recommendation.chargingTimeMinutes} mins`,
          chargingTimeMinutes: recommendation.chargingTimeMinutes,
          renewablePercentage: recommendation.renewablePercentage,
          greenScore: recommendation.greenScore,
          reasons: recommendation.reasons,
          confidence: recommendation.confidence,
          action: recommendation.action,
          mode,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, conversationId, vehicleId, latitude, longitude, mode } = req.body;
      const userId = req.user?.id;

      let vehicle = null;
      if (vehicleId) {
        vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      } else if (userId) {
        vehicle = await prisma.vehicle.findFirst({
          where: { userId, isPrimary: true },
        });
      }

      const stations = await prisma.station.findMany({
        include: { network: true },
      });

      const userLoc = {
        latitude: latitude ?? env.DEFAULT_LATITUDE,
        longitude: longitude ?? env.DEFAULT_LONGITUDE,
      };

      const response = await aiEngine.processChat(message, {
        userLocation: userLoc,
        vehicle,
        stations,
        mode,
      });

      res.json({
        success: true,
        data: {
          conversationId: conversationId || `conv_${Date.now()}`,
          ...response,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async schedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId, targetBattery, deadline, latitude, longitude, preferences } = req.body;
      const userId = req.user?.id;

      let vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle && userId) {
        vehicle = await prisma.vehicle.findFirst({ where: { userId, isPrimary: true } });
      }

      const batteryCap = vehicle?.batteryCapacityKWh || 40.5;
      const currentPct = vehicle?.currentBatteryPercentage || 30;

      const durationInfo = chargingTimePrediction.predict({
        batteryCapacityKWh: batteryCap,
        currentBatteryPercentage: currentPct,
        targetBatteryPercentage: targetBattery,
        vehicleMaxPowerKW: vehicle?.maxChargingPowerKW || 50,
        stationPowerKW: 60,
      });

      const bestWindow = pricingEngine.findBestChargingWindow();
      const dynamicPrice = pricingEngine.calculateDynamicPrice({ hour: 13 }); // Peak solar slot

      const energyReq = ((targetBattery - currentPct) / 100) * batteryCap;
      const estimatedCost = Math.round(energyReq * dynamicPrice.estimatedPricePerKWh * 10) / 10;

      // Recommended start time: Schedule to begin during optimal window
      const now = new Date();
      const recommendedStartTime = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
      const recommendedEndTime = new Date(now.getTime() + (2 * 60 + durationInfo.estimatedMinutes) * 60 * 1000).toISOString();

      res.json({
        success: true,
        data: {
          recommendedStartTime,
          recommendedEndTime,
          durationMinutes: durationInfo.estimatedMinutes,
          durationFormatted: durationInfo.durationFormatted,
          bestWindowSlot: bestWindow.bestWindow,
          estimatedCost,
          estimatedCostInr: estimatedCost,
          pricePerKWh: dynamicPrice.estimatedPricePerKWh,
          renewablePercentage: bestWindow.bestRenewable,
          greenScore: bestWindow.bestGreenScore,
          estimatedSaving: bestWindow.estimatedSavingInr,
          confidence: 'HIGH',
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
