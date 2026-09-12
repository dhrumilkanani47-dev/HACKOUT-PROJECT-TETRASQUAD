export interface DiscomTariff {
  state: string;
  discom: string;
  category: string; // e.g. 'Public EV Charging Station'
  baseRatePerKWh: number;
  timeOfDayMultiplier: {
    offPeak: number; // 22:00 - 06:00
    normal: number;  // 06:00 - 18:00
    peak: number;    // 18:00 - 22:00
  };
  regulatorySurchargePct: number;
  gstPct: number; // EV charging GST 18% on service component
}

export const STATE_DISCOM_TARIFFS: Record<string, DiscomTariff> = {
  gujarat: {
    state: 'Gujarat',
    discom: 'UGVCL / DGVCL / Torrent Power',
    category: 'LT/HT EV Charging Stations (GERC Tariff)',
    baseRatePerKWh: 4.10,
    timeOfDayMultiplier: {
      offPeak: 0.85,
      normal: 1.00,
      peak: 1.45,
    },
    regulatorySurchargePct: 4.5,
    gstPct: 18.0,
  },
  maharashtra: {
    state: 'Maharashtra',
    discom: 'MSEDCL / Adani Electricity Mumbai',
    category: 'EV Charging Specific Tariff (MERC Order)',
    baseRatePerKWh: 5.50,
    timeOfDayMultiplier: {
      offPeak: 0.75,
      normal: 1.00,
      peak: 1.50,
    },
    regulatorySurchargePct: 5.0,
    gstPct: 18.0,
  },
  delhi: {
    state: 'Delhi',
    discom: 'BSES Rajdhani / BSES Yamuna / TPDDL',
    category: 'Special EV Tariff (DERC Tariff)',
    baseRatePerKWh: 4.50,
    timeOfDayMultiplier: {
      offPeak: 0.80,
      normal: 1.00,
      peak: 1.20,
    },
    regulatorySurchargePct: 8.0,
    gstPct: 18.0,
  },
  karnataka: {
    state: 'Karnataka',
    discom: 'BESCOM Bangalore Electricity Supply',
    category: 'LT-6 EV Charging Tariff (KERC)',
    baseRatePerKWh: 5.00,
    timeOfDayMultiplier: {
      offPeak: 0.80,
      normal: 1.00,
      peak: 1.30,
    },
    regulatorySurchargePct: 4.0,
    gstPct: 18.0,
  },
};

export class TariffService {
  getApplicableTariff(state: string = 'Gujarat', hour: number = new Date().getHours()) {
    const key = state.toLowerCase();
    const tariff = STATE_DISCOM_TARIFFS[key] || STATE_DISCOM_TARIFFS.gujarat;

    let period: 'offPeak' | 'normal' | 'peak' = 'normal';
    if (hour >= 22 || hour < 6) {
      period = 'offPeak';
    } else if (hour >= 18 && hour < 22) {
      period = 'peak';
    }

    const multiplier = tariff.timeOfDayMultiplier[period];
    const energyCharge = tariff.baseRatePerKWh * multiplier;
    const taxesAndSurcharges = energyCharge * (tariff.regulatorySurchargePct / 100);
    const applicableTariffPerKWh = Math.round((energyCharge + taxesAndSurcharges) * 100) / 100;

    return {
      state: tariff.state,
      discom: tariff.discom,
      category: tariff.category,
      timeOfDayPeriod: period.toUpperCase(),
      baseRatePerKWh: tariff.baseRatePerKWh,
      multiplier,
      applicableTariffPerKWh,
      taxesAndSurchargesPerKWh: Math.round(taxesAndSurcharges * 100) / 100,
      currency: 'INR (₹/kWh)',
    };
  }
}

export const tariffService = new TariffService();
