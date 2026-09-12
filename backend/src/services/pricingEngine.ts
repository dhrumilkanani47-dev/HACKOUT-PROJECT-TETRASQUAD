import { DynamicPriceBreakdown, DynamicPriceResult, EnergyMix, PriceType } from '../types/index.js';

export interface PricingInput {
  basePricePerKWh?: number;
  solarAvailability?: number; // 0-100
  windAvailability?: number;  // 0-100
  gridDemand?: number;        // 0-100
  fossilFuelPercentage?: number; // 0-100
  hour?: number;              // 0-23
  stationFee?: number;        // In INR
  actualStationPrice?: number;
}

export interface PricingCoefficients {
  baseEnergyRate: number;      // Default base ₹/kWh (e.g. 7.50)
  gridDemandWeight: number;    // Multiplier for grid demand (e.g. 0.03)
  fossilFuelWeight: number;    // Multiplier for thermal generation (e.g. 0.02)
  solarDiscountRate: number;   // Multiplier for high solar yield (e.g. 0.025)
  windDiscountRate: number;    // Multiplier for wind generation (e.g. 0.02)
  peakSurcharge: number;       // Surcharge during peak hours (e.g. 2.20)
  defaultStationFee: number;   // Default network connection fee (e.g. 0.50)
}

export const DEFAULT_PRICING_COEFFICIENTS: PricingCoefficients = {
  baseEnergyRate: 7.20,
  gridDemandWeight: 0.03,
  fossilFuelWeight: 0.02,
  solarDiscountRate: 0.025,
  windDiscountRate: 0.018,
  peakSurcharge: 2.20,
  defaultStationFee: 0.50,
};

export class PricingEngine {
  private coefficients: PricingCoefficients;

  constructor(coefficients: Partial<PricingCoefficients> = {}) {
    this.coefficients = { ...DEFAULT_PRICING_COEFFICIENTS, ...coefficients };
  }

  /**
   * Determine whether current hour is in the Indian evening peak window (18:00 - 22:00)
   * or morning peak (08:00 - 10:00).
   */
  isPeakHour(hour: number): boolean {
    return (hour >= 18 && hour <= 22) || (hour >= 8 && hour <= 10);
  }

  /**
   * Calculate real-time energy generation mix based on hour of day, solar and wind.
   */
  calculateEnergyMix(hour: number, solarAvailability: number = 0, windAvailability: number = 25): {
    energyMix: EnergyMix;
    renewablePercentage: number;
    fossilPercentage: number;
  } {
    // Solar generation profile peaking between 11:00 and 15:00
    let effectiveSolar = 0;
    if (hour >= 6 && hour <= 18) {
      const solarPeakFactor = Math.sin(((hour - 6) / 12) * Math.PI);
      effectiveSolar = Math.round(solarAvailability * solarPeakFactor * 0.75);
    }

    const effectiveWind = Math.round(Math.min(windAvailability * 0.6, 40));
    const hydro = Math.round(hour >= 18 && hour <= 22 ? 18 : 12); // Hydro supports evening peak

    const renewablePercentage = Math.min(Math.max(effectiveSolar + effectiveWind + hydro, 15), 98);
    const fossilRemainder = 100 - renewablePercentage;

    const coal = Math.round(fossilRemainder * 0.82);
    const gas = Math.round(fossilRemainder * 0.14);
    const other = Math.max(0, fossilRemainder - coal - gas);

    const energyMix: EnergyMix = {
      solar: effectiveSolar,
      wind: effectiveWind,
      hydro,
      coal,
      gas,
      other,
    };

    return {
      energyMix,
      renewablePercentage,
      fossilPercentage: fossilRemainder,
    };
  }

  /**
   * Calculate Green Score (0-100)
   */
  calculateGreenScore(
    renewablePercentage: number,
    fossilPercentage: number,
    gridDemand: number
  ): number {
    const renewableWeight = renewablePercentage * 0.70;
    const lowDemandBonus = (100 - gridDemand) * 0.20;
    const cleanFuelBonus = (100 - fossilPercentage) * 0.10;

    const rawScore = Math.round(renewableWeight + lowDemandBonus + cleanFuelBonus);
    return Math.min(Math.max(rawScore, 10), 100);
  }

  /**
   * Calculate Estimated Dynamic Charging Price (₹/kWh)
   * Formula: basePrice + gridDemandAdjustment + fossilFuelAdjustment + peakHourAdjustment - solarBenefit - windBenefit + stationFee
   */
  calculateDynamicPrice(input: PricingInput = {}): DynamicPriceResult {
    const currentHour = input.hour !== undefined ? input.hour : new Date().getHours();
    const solarAvail = input.solarAvailability ?? (currentHour >= 9 && currentHour <= 16 ? 70 : 0);
    const windAvail = input.windAvailability ?? 30;
    const demand = input.gridDemand ?? (this.isPeakHour(currentHour) ? 82 : 45);

    const { energyMix, renewablePercentage, fossilPercentage } = this.calculateEnergyMix(
      currentHour,
      solarAvail,
      windAvail
    );

    const baseCost = input.basePricePerKWh ?? this.coefficients.baseEnergyRate;
    const gridDemandAdjustment = Math.round(demand * this.coefficients.gridDemandWeight * 100) / 100;
    const fossilFuelAdjustment = Math.round(fossilPercentage * this.coefficients.fossilFuelWeight * 100) / 100;
    const peakHourAdjustment = this.isPeakHour(currentHour) ? this.coefficients.peakSurcharge : 0;
    const solarBenefit = Math.round(energyMix.solar * this.coefficients.solarDiscountRate * 100) / 100;
    const windBenefit = Math.round(energyMix.wind * this.coefficients.windDiscountRate * 100) / 100;
    const stationFee = input.stationFee ?? this.coefficients.defaultStationFee;

    const calculatedPrice =
      baseCost +
      gridDemandAdjustment +
      fossilFuelAdjustment +
      peakHourAdjustment -
      solarBenefit -
      windBenefit +
      stationFee;

    // Minimum ₹4.50/kWh baseline tariff in India
    const estimatedPricePerKWh = Math.round(Math.max(calculatedPrice, 4.50) * 100) / 100;

    const priceType: PriceType = input.actualStationPrice ? 'ACTUAL' : 'ESTIMATED';
    const greenScore = this.calculateGreenScore(renewablePercentage, fossilPercentage, demand);

    let priceStatus: 'CHEAP' | 'GOOD' | 'NORMAL' | 'EXPENSIVE' = 'NORMAL';
    if (estimatedPricePerKWh <= 6.80) {
      priceStatus = 'CHEAP';
    } else if (estimatedPricePerKWh <= 8.20) {
      priceStatus = 'GOOD';
    } else if (estimatedPricePerKWh > 10.00) {
      priceStatus = 'EXPENSIVE';
    }

    let recommendation = 'Current tariff is normal. Standard charging recommended.';
    if (priceStatus === 'CHEAP' || greenScore >= 88) {
      recommendation = 'Optimal charging conditions right now! High green energy share and low tariff.';
    } else if (priceStatus === 'EXPENSIVE') {
      recommendation = 'Peak grid demand. Consider deferring non-urgent charging until off-peak hours.';
    }

    // Standard Indian grid carbon baseline ~0.71 kg CO2/kWh; clean renewables reduce this significantly
    const carbonEstimate = Math.round((0.71 * (fossilPercentage / 100)) * 1000) / 1000;

    return {
      estimatedPricePerKWh,
      priceType,
      renewablePercentage,
      fossilPercentage,
      greenScore,
      priceStatus,
      recommendation,
      carbonEstimate,
      confidence: 'HIGH',
      energyMix,
      breakdown: {
        baseEnergyCost: baseCost,
        gridDemandAdjustment,
        fossilFuelAdjustment,
        peakHourAdjustment,
        solarBenefit,
        windBenefit,
        stationFee,
        estimatedPrice: estimatedPricePerKWh,
      },
    };
  }

  /**
   * Calculate charging cost for an EV:
   * energyNeeded = ((target% - current%) / 100) * capacity / efficiencyLoss
   */
  calculateChargingCost(
    currentBatteryPct: number,
    targetBatteryPct: number,
    batteryCapacityKWh: number,
    pricePerKWh: number,
    stationFee: number = 0,
    chargingEfficiency: number = 0.90 // 10% charging loss
  ): {
    energyRequiredKWh: number;
    pricePerKWh: number;
    totalCostInr: number;
    stationFeeInr: number;
  } {
    const deltaPct = Math.max(0, targetBatteryPct - currentBatteryPct);
    const netEnergyKWh = (deltaPct / 100) * batteryCapacityKWh;
    const energyRequiredKWh = Math.round((netEnergyKWh / chargingEfficiency) * 10) / 10;
    const totalCostInr = Math.round((energyRequiredKWh * pricePerKWh + stationFee) * 10) / 10;

    return {
      energyRequiredKWh,
      pricePerKWh,
      totalCostInr,
      stationFeeInr: stationFee,
    };
  }

  /**
   * Calculate carbon impact and CO2 avoided vs fossil generator
   */
  calculateCarbonImpact(
    energyKWh: number,
    renewablePercentage: number
  ): {
    estimatedCarbonKg: number;
    baselineCarbonKg: number;
    potentialReductionKg: number;
    co2AvoidedKg: number;
  } {
    const gridBaseline = 0.71; // kg CO2 / kWh in India average
    const baselineCarbonKg = Math.round(energyKWh * gridBaseline * 10) / 10;
    const actualEmissionFactor = gridBaseline * ((100 - renewablePercentage) / 100);
    const estimatedCarbonKg = Math.round(energyKWh * actualEmissionFactor * 10) / 10;
    const co2AvoidedKg = Math.round((baselineCarbonKg - estimatedCarbonKg) * 10) / 10;

    return {
      estimatedCarbonKg,
      baselineCarbonKg,
      potentialReductionKg: co2AvoidedKg,
      co2AvoidedKg,
    };
  }

  /**
   * Scan next 24 hours to find the optimal charging window (lowest price, highest renewables).
   */
  findBestChargingWindow(): {
    bestWindow: string;
    bestPrice: number;
    bestRenewable: number;
    bestGreenScore: number;
    estimatedSavingInr: number;
    confidence: 'HIGH' | 'MEDIUM';
    hourlyForecast: Array<{
      hour: number;
      time: string;
      estimatedPrice: number;
      renewablePercentage: number;
      greenScore: number;
      gridDemand: number;
      status: 'CHEAP' | 'GOOD' | 'NORMAL' | 'EXPENSIVE';
    }>;
  } {
    const hourlyForecast = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const forecastHour = (now.getHours() + i) % 24;
      const res = this.calculateDynamicPrice({ hour: forecastHour });
      hourlyForecast.push({
        hour: forecastHour,
        time: `${forecastHour.toString().padStart(2, '0')}:00`,
        estimatedPrice: res.estimatedPricePerKWh,
        renewablePercentage: res.renewablePercentage,
        greenScore: res.greenScore,
        gridDemand: res.breakdown.gridDemandAdjustment > 1 ? 75 : 40,
        status: res.priceStatus,
      });
    }

    // Find 2-hour window with lowest average price and highest green score
    let bestIdx = 0;
    let minCost = Infinity;

    for (let i = 0; i < hourlyForecast.length - 2; i++) {
      const avgPrice = (hourlyForecast[i].estimatedPrice + hourlyForecast[i + 1].estimatedPrice) / 2;
      const greenBonus = (hourlyForecast[i].greenScore + hourlyForecast[i + 1].greenScore) / 200;
      const compositeCost = avgPrice - greenBonus * 0.5;

      if (compositeCost < minCost) {
        minCost = compositeCost;
        bestIdx = i;
      }
    }

    const bestSlot = hourlyForecast[bestIdx];
    const endSlotHour = (bestSlot.hour + 2) % 24;
    const windowStr = `${bestSlot.time} – ${endSlotHour.toString().padStart(2, '0')}:00`;

    // Calculate saving vs peak price
    const maxPrice = Math.max(...hourlyForecast.map((h) => h.estimatedPrice));
    const estimatedSavingInr = Math.round((maxPrice - bestSlot.estimatedPrice) * 35); // based on 35kWh typical charge

    return {
      bestWindow: windowStr,
      bestPrice: bestSlot.estimatedPrice,
      bestRenewable: bestSlot.renewablePercentage,
      bestGreenScore: bestSlot.greenScore,
      estimatedSavingInr: Math.max(estimatedSavingInr, 30),
      confidence: 'HIGH',
      hourlyForecast,
    };
  }
}

export const pricingEngine = new PricingEngine();
