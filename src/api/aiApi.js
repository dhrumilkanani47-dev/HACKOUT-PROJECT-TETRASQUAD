import { STATIONS_DATA, CURRENT_LIVE_METRICS, INITIAL_VEHICLES } from '../utils/mockData';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const aiApi = {
  async askGreenChargeAi(prompt, userVehicle = INITIAL_VEHICLES[0], mode = 'smart') {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/ai/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, userVehicle, mode })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('aiApi: fallback to local AI engine', e);
      }
    }

    await new Promise(r => setTimeout(r, 650));
    const lower = prompt.toLowerCase();

    // Context analysis
    if (lower.includes('cheap') || lower.includes('lowest price') || lower.includes('cost')) {
      const cheapestStation = [...STATIONS_DATA].sort((a, b) => a.pricePerKwh - b.pricePerKwh)[0];
      const energyNeeded = ((userVehicle.targetBatteryPct - userVehicle.currentBatteryPct) / 100) * userVehicle.batteryCapacity;
      const estimatedCost = (energyNeeded * cheapestStation.pricePerKwh).toFixed(1);

      return {
        id: `ai_${Date.now()}`,
        query: prompt,
        recommendation: `Head to **${cheapestStation.name}** (${cheapestStation.network}) for the lowest tariff in your vicinity.`,
        station: cheapestStation,
        price: `₹${cheapestStation.pricePerKwh.toFixed(2)}/kWh`,
        priceType: cheapestStation.priceType,
        distance: `${cheapestStation.distanceKm} km`,
        chargingTime: `${Math.round((energyNeeded / (cheapestStation.powerKw * 0.85)) * 60)} mins`,
        renewablePct: cheapestStation.renewablePct,
        greenScore: cheapestStation.greenScore,
        estimatedCost: `₹${estimatedCost}`,
        reasons: [
          `Lowest tariff at ₹${cheapestStation.pricePerKwh}/kWh (saves ~₹42 vs regional average)`,
          `${cheapestStation.availableChargers} of ${cheapestStation.totalChargers} high-speed DC guns currently free`,
          `${cheapestStation.renewablePct}% clean wind+solar power share`
        ],
        confidence: 'High',
        confidenceScore: 98,
        dataFreshness: 'Live telemetry synced 45s ago',
        action: {
          type: 'VIEW_STATION',
          label: 'View Station & Navigate',
          stationId: cheapestStation.id
        }
      };
    }

    if (lower.includes('green') || lower.includes('solar') || lower.includes('clean') || lower.includes('eco')) {
      const greenestStation = [...STATIONS_DATA].sort((a, b) => b.renewablePct - a.renewablePct)[0];
      return {
        id: `ai_${Date.now()}`,
        query: prompt,
        recommendation: `**${greenestStation.name}** currently offers maximum clean energy mix (${greenestStation.renewablePct}% solar + wind).`,
        station: greenestStation,
        price: `₹${greenestStation.pricePerKwh.toFixed(2)}/kWh`,
        priceType: greenestStation.priceType,
        distance: `${greenestStation.distanceKm} km`,
        chargingTime: '24 mins (Fast DC)',
        renewablePct: greenestStation.renewablePct,
        greenScore: greenestStation.greenScore,
        reasons: [
          `${greenestStation.renewablePct}% verified renewable energy source`,
          `Green Score of ${greenestStation.greenScore}/100 helps avoid 21.8 kg CO₂ emissions`,
          `Equipped with ultra-fast ${greenestStation.powerKw} kW DC chargers`
        ],
        confidence: 'High',
        confidenceScore: 95,
        dataFreshness: 'Grid solar data updated 1 min ago',
        action: {
          type: 'VIEW_STATION',
          label: 'Select Greenest Station',
          stationId: greenestStation.id
        }
      };
    }

    if (lower.includes('when') || lower.includes('time') || lower.includes('best time')) {
      const rec = CURRENT_LIVE_METRICS.aiRecommendation;
      return {
        id: `ai_${Date.now()}`,
        query: prompt,
        recommendation: `The best charging window today is **${CURRENT_LIVE_METRICS.smartChargingWindow.bestWindow}**. Tariff drops to ₹${CURRENT_LIVE_METRICS.smartChargingWindow.bestPrice}/kWh with ${CURRENT_LIVE_METRICS.smartChargingWindow.bestRenewable}% solar power.`,
        station: STATIONS_DATA[0],
        price: `₹${CURRENT_LIVE_METRICS.smartChargingWindow.bestPrice}/kWh`,
        priceType: 'Estimated charging price',
        distance: 'Nearby grid',
        chargingTime: '30 mins optimum',
        renewablePct: CURRENT_LIVE_METRICS.smartChargingWindow.bestRenewable,
        greenScore: CURRENT_LIVE_METRICS.smartChargingWindow.bestGreenScore,
        reasons: [
          `Save estimated ₹${CURRENT_LIVE_METRICS.smartChargingWindow.saving} compared to evening peak tariff`,
          `Solar generation peak in Western India Grid keeps coal emissions down`,
          `Avoid 7:00 PM – 9:00 PM peak (tariffs rise to ₹11.40/kWh)`
        ],
        confidence: 'High',
        confidenceScore: 94,
        dataFreshness: 'State Load Despatch Centre (SLDC) Forecast',
        action: {
          type: 'SCHEDULE_CHARGE',
          label: 'Schedule Best Time Charging'
        }
      };
    }

    if (lower.includes('compare') || lower.includes('tata') || lower.includes('chargezone') || lower.includes('jio')) {
      return {
        id: `ai_${Date.now()}`,
        query: prompt,
        recommendation: `**Tata Power** has higher reliability and hospital proximity in this zone (4/6 available, ₹8.40/kWh), while **ChargeZone** offers higher speed (150kW) and cheaper rates (₹6.80/kWh, 94% renewable).`,
        station: STATIONS_DATA[2],
        price: '₹6.80 vs ₹8.40 /kWh',
        priceType: 'Actual station price',
        distance: '0.8 km vs 5.6 km',
        chargingTime: '18 mins vs 30 mins',
        renewablePct: 94,
        greenScore: 96,
        reasons: [
          'ChargeZone GIFT City: 150 kW hyper charger, ₹6.80/kWh, 94% renewable',
          'Tata Power Infocity: 60 kW charger, 0.8 km away, right opposite Apollo hospital',
          'Recommendation: Choose Tata Power for urgent charging, or ChargeZone for hyper-speed green savings.'
        ],
        confidence: 'High',
        confidenceScore: 92,
        dataFreshness: 'Live station status synced',
        action: {
          type: 'FILTER_MAP',
          label: 'Compare on Interactive Map'
        }
      };
    }

    if (lower.includes('range') || lower.includes('reach') || lower.includes('battery')) {
      return {
        id: `ai_${Date.now()}`,
        query: prompt,
        recommendation: `Your **${userVehicle.name}** has **${userVehicle.currentBatteryPct}% battery** (~${userVehicle.currentRangeEstimate} km realistic range). You can comfortably reach all 8 nearby charging stations.`,
        station: STATIONS_DATA[0],
        price: '₹8.40/kWh',
        priceType: 'Actual station price',
        distance: '0.8 km to nearest',
        chargingTime: '26 mins to reach 85%',
        renewablePct: 90,
        greenScore: 94,
        reasons: [
          `Nearest station is only 0.8 km away (GreenHub Solar)`,
          `Estimated energy to reach 80% target: ${(((userVehicle.targetBatteryPct - userVehicle.currentBatteryPct) / 100) * userVehicle.batteryCapacity).toFixed(1)} kWh`,
          `Battery health status: 98% (Optimal condition)`
        ],
        confidence: 'High',
        confidenceScore: 99,
        dataFreshness: 'Vehicle BMS Telemetry',
        action: {
          type: 'VIEW_VEHICLE',
          label: 'View EV Range & Health'
        }
      };
    }

    // Default smart assistant response
    const defaultStation = STATIONS_DATA[0];
    return {
      id: `ai_${Date.now()}`,
      query: prompt,
      recommendation: `Based on your ${userVehicle.name} and current grid demand, **${defaultStation.name}** is the optimal pick with ${defaultStation.availableChargers} open guns and 90% solar energy.`,
      station: defaultStation,
      price: `₹${defaultStation.pricePerKwh.toFixed(2)}/kWh`,
      priceType: defaultStation.priceType,
      distance: `${defaultStation.distanceKm} km`,
      chargingTime: '26 mins',
      renewablePct: defaultStation.renewablePct,
      greenScore: defaultStation.greenScore,
      reasons: [
        `Optimal balance of distance (0.8 km) and DC charging speed (60 kW)`,
        `High Green Score (${defaultStation.greenScore}/100) with verified solar source`,
        `Includes lounge and café amenities during charge`
      ],
      confidence: 'High',
      confidenceScore: 93,
      dataFreshness: 'Real-time multi-network sync',
      action: {
        type: 'VIEW_STATION',
        label: 'Open Station Details',
        stationId: defaultStation.id
      }
    };
  }
};
