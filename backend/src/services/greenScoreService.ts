export class GreenScoreService {
  /**
   * Calculate Green Score (0-100)
   * Factors:
   * - Renewable % (60% weight)
   * - Off-peak / Grid demand factor (25% weight)
   * - Station local solar generation availability (15% weight)
   */
  calculateGreenScore(
    renewablePercentage: number,
    gridDemand: number = 50,
    hasLocalSolar: boolean = false
  ): number {
    const renewablePart = (Math.min(Math.max(renewablePercentage, 0), 100) / 100) * 60;
    const gridPart = (Math.min(Math.max(100 - gridDemand, 0), 100) / 100) * 25;
    const localSolarPart = hasLocalSolar ? 15 : 8;

    const total = Math.round(renewablePart + gridPart + localSolarPart);
    return Math.min(Math.max(total, 10), 100);
  }
}

export const greenScoreService = new GreenScoreService();
