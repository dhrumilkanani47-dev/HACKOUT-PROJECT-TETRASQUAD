import { Request, Response, NextFunction } from 'express';
import { pricingEngine } from '../services/pricingEngine.js';
import { tariffService } from '../services/tariffService.js';
import { carbonService } from '../services/carbonService.js';

export const pricingController = {
  async getBestChargingWindow(req: Request, res: Response, next: NextFunction) {
    try {
      const bestWindowData = pricingEngine.findBestChargingWindow();
      const currentPrice = pricingEngine.calculateDynamicPrice();

      res.json({
        success: true,
        data: {
          currentPrice: {
            estimatedPricePerKWh: currentPrice.estimatedPricePerKWh,
            priceType: currentPrice.priceType,
            greenScore: currentPrice.greenScore,
            renewablePercentage: currentPrice.renewablePercentage,
            status: currentPrice.priceStatus,
            label: 'Estimated Dynamic Charging Price',
          },
          bestWindow: bestWindowData.bestWindow,
          bestPrice: bestWindowData.bestPrice,
          bestRenewable: bestWindowData.bestRenewable,
          bestGreenScore: bestWindowData.bestGreenScore,
          estimatedSavingInr: bestWindowData.estimatedSavingInr,
          confidence: bestWindowData.confidence,
          hourlyForecast: bestWindowData.hourlyForecast,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getPriceForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const state = (req.query.state as string) || 'Gujarat';
      const windowData = pricingEngine.findBestChargingWindow();

      res.json({
        success: true,
        data: {
          state,
          currency: '₹/kWh',
          confidence: 'HIGH',
          lastUpdated: new Date().toISOString(),
          forecast: windowData.hourlyForecast,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async calculateCost(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        currentBatteryPercentage,
        targetBatteryPercentage,
        batteryCapacityKWh,
        stationPricePerKWh,
        stationFee,
      } = req.body;

      const dynamicPrice = pricingEngine.calculateDynamicPrice({
        actualStationPrice: stationPricePerKWh,
      });

      const effectivePrice = stationPricePerKWh || dynamicPrice.estimatedPricePerKWh;

      const costResult = pricingEngine.calculateChargingCost(
        currentBatteryPercentage,
        targetBatteryPercentage,
        batteryCapacityKWh,
        effectivePrice,
        stationFee || 0
      );

      const carbon = carbonService.calculateCarbon(
        costResult.energyRequiredKWh,
        dynamicPrice.renewablePercentage
      );

      res.json({
        success: true,
        data: {
          ...costResult,
          currency: '₹',
          priceType: stationPricePerKWh ? 'ACTUAL' : 'ESTIMATED',
          priceLabel: stationPricePerKWh ? 'Actual station price' : 'Estimated Dynamic Charging Price',
          greenScore: dynamicPrice.greenScore,
          renewablePercentage: dynamicPrice.renewablePercentage,
          carbonImpact: carbon,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getDiscomTariff(req: Request, res: Response, next: NextFunction) {
    try {
      const state = (req.query.state as string) || 'Gujarat';
      const tariff = tariffService.getApplicableTariff(state);
      res.json({ success: true, data: tariff });
    } catch (error) {
      next(error);
    }
  },
};
