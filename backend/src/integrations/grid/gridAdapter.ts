import { gridService, GridConditions } from '../../services/gridService.js';

export interface IGridProvider {
  fetchGridConditions(state: string): Promise<GridConditions>;
}

export class GridAdapter implements IGridProvider {
  async fetchGridConditions(state: string = 'Gujarat'): Promise<GridConditions> {
    // Connects to external POSOCO/SLDC API if key configured, otherwise gridService
    return gridService.getGridConditions(state);
  }
}

export const gridAdapter = new GridAdapter();
