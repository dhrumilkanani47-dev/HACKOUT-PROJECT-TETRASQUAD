export interface ExplanationDetails {
  stationName: string;
  networkName: string;
  distanceKm: number;
  pricePerKWh: number;
  priceType: string;
  greenScore: number;
  renewablePct: number;
  availableChargers: number;
  powerKW: number;
  isPeakHour: boolean;
  bestWindow?: string;
}

export class ExplanationEngine {
  generate(details: ExplanationDetails): {
    summary: string;
    whyThisStation: string;
    whyThisTime: string;
    whyThisPrice: string;
    whyThisGreenScore: string;
  } {
    const whyThisStation = `${details.stationName} (${details.networkName}) is ${details.distanceKm} km away, features ${details.powerKW} kW high-speed charging guns, and currently has ${details.availableChargers} ports free.`;

    const whyThisTime = details.isPeakHour
      ? 'Current evening peak demand is elevated. Charging now provides emergency power, but scheduling for off-peak will maximize savings.'
      : `Optimal solar generation window active. State grid has surplus clean energy.`;

    const whyThisPrice = `Tariff stands at ₹${details.pricePerKWh.toFixed(2)}/kWh (${details.priceType.toLowerCase()}), reflecting current generation mix and off-peak DISCOM rates.`;

    const whyThisGreenScore = `Green Score of ${details.greenScore}/100 powered by ${details.renewablePct}% clean solar and wind energy, avoiding significant carbon emissions.`;

    const summary = `Recommended because the charger is fully compatible with your EV, has high availability (${details.availableChargers} open ports), and currently offers a favourable tariff with ${details.renewablePct}% clean energy.`;

    return {
      summary,
      whyThisStation,
      whyThisTime,
      whyThisPrice,
      whyThisGreenScore,
    };
  }
}

export const explanationEngine = new ExplanationEngine();
