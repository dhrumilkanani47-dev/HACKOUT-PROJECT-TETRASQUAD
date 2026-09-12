export class CarbonService {
  /**
   * Average Indian Grid carbon intensity is ~710 g CO2/kWh (0.71 kg CO2/kWh).
   */
  calculateCarbon(energyKWh: number, renewablePercentage: number) {
    const baselineIntensity = 0.71; // kg CO2 / kWh
    const baselineEmissionKg = Math.round(energyKWh * baselineIntensity * 100) / 100;

    // Renewables (Solar, Wind, Hydro) have near-zero operational emissions (~0.04 kg CO2/kWh lifecycle)
    const effectiveIntensity =
      baselineIntensity * ((100 - renewablePercentage) / 100) +
      0.04 * (renewablePercentage / 100);

    const estimatedCarbonKg = Math.round(energyKWh * effectiveIntensity * 100) / 100;
    const co2AvoidedKg = Math.round(Math.max(0, baselineEmissionKg - estimatedCarbonKg) * 100) / 100;

    // Comparison equivalent: e.g. equivalent trees planted or petrol car km avoided (petrol car ~0.14 kg CO2/km)
    const kmPetrolAvoided = Math.round(co2AvoidedKg / 0.14);
    const treesEquivalent = Math.round((co2AvoidedKg / 21.7) * 10) / 10; // 1 tree absorbs ~21.7 kg CO2 / year

    return {
      estimatedCarbonKg,
      baselineEmissionKg,
      co2AvoidedKg,
      comparison: `Avoided ${co2AvoidedKg} kg CO₂ (~${kmPetrolAvoided} km of petrol vehicle emissions, equivalent to ${treesEquivalent} mature trees).`,
      potentialReductionPct: Math.round(((baselineEmissionKg - estimatedCarbonKg) / baselineEmissionKg) * 100),
      isEstimate: true,
      calculationBasis: 'Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector',
    };
  }
}

export const carbonService = new CarbonService();
