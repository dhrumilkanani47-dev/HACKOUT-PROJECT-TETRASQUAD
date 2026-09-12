import { prisma } from '../database/prismaClient.js';
import { pricingEngine } from '../services/pricingEngine.js';
import { logger } from '../utils/logger.js';

export class JobRunner {
  private intervals: NodeJS.Timeout[] = [];

  startAll() {
    logger.info('Starting EV GreenCharge background jobs...');

    // 1. Station Data Refresh & Availability (Every 5 minutes)
    const stationJob = setInterval(async () => {
      try {
        await this.refreshStationAvailability();
      } catch (err) {
        logger.error('Failed to run refreshStationAvailability job', { error: String(err) });
      }
    }, 5 * 60 * 1000);
    this.intervals.push(stationJob);

    // 2. Price Alerts Evaluator (Every 3 minutes)
    const alertJob = setInterval(async () => {
      try {
        await this.evaluatePriceAlerts();
      } catch (err) {
        logger.error('Failed to run evaluatePriceAlerts job', { error: String(err) });
      }
    }, 3 * 60 * 1000);
    this.intervals.push(alertJob);

    // Execute immediately once on startup
    this.evaluatePriceAlerts().catch(() => {});
  }

  stopAll() {
    for (const interval of this.intervals) {
      clearInterval(interval);
    }
    this.intervals = [];
    logger.info('Stopped all background jobs');
  }

  async refreshStationAvailability() {
    const stations = await prisma.station.findMany({ take: 50 });
    for (const st of stations) {
      // Small simulated variation in availability
      const available = Math.min(st.totalChargers, Math.max(0, st.availableChargers + (Math.random() > 0.5 ? 1 : -1)));
      await prisma.station.update({
        where: { id: st.id },
        data: {
          availableChargers: available,
          lastUpdated: new Date(),
        },
      });
    }
    logger.info('Station availability refresh job executed');
  }

  async evaluatePriceAlerts() {
    const dynamicPrice = pricingEngine.calculateDynamicPrice();
    const currentPrice = dynamicPrice.estimatedPricePerKWh;

    const activeAlerts = await prisma.priceAlert.findMany({
      where: { triggered: false },
      include: { user: true },
    });

    for (const alert of activeAlerts) {
      if (currentPrice <= alert.targetPrice) {
        // Price dropped to or below user target! Create notification
        await prisma.$transaction([
          prisma.priceAlert.update({
            where: { id: alert.id },
            data: { triggered: true },
          }),
          prisma.notification.create({
            data: {
              userId: alert.userId,
              title: `Green Tariff Alert: ₹${currentPrice.toFixed(2)}/kWh reached!`,
              message: `Estimated EV charging price dropped to ₹${currentPrice.toFixed(2)}/kWh (Target: ₹${alert.targetPrice}). High solar energy available now.`,
              type: 'PRICE_DROP',
              metadata: JSON.stringify({
                targetPrice: alert.targetPrice,
                currentPrice,
                greenScore: dynamicPrice.greenScore,
                renewablePct: dynamicPrice.renewablePercentage,
                isForecastBased: alert.isForecastBased,
              }),
            },
          }),
        ]);
        logger.info(`Triggered price alert for user ${alert.userId}: Target ₹${alert.targetPrice} vs Current ₹${currentPrice}`);
      }
    }
  }
}

export const jobRunner = new JobRunner();
