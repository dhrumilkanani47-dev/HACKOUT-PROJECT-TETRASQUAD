import { prisma } from '../../database/prismaClient.js';

export interface ExternalStationFeed {
  networkName: string;
  externalId: string;
  name: string;
  latitude: number;
  longitude: number;
  availableChargers: number;
  totalChargers: number;
  pricePerKWh: number;
}

export class StationAdapter {
  async fetchNetworkStations(networkName: string): Promise<ExternalStationFeed[]> {
    // In production, queries OCPI (Open Charge Point Interface) or network partner APIs (Tata Power EZ Charge, Jio-bp pulse)
    const stations = await prisma.station.findMany({
      where: {
        network: {
          name: {
            contains: networkName,
            mode: 'insensitive',
          },
        },
      },
      include: {
        network: true,
      },
    });

    return stations.map((s) => ({
      networkName: s.network.name,
      externalId: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      availableChargers: s.availableChargers,
      totalChargers: s.totalChargers,
      pricePerKWh: s.pricePerKWh,
    }));
  }
}

export const stationAdapter = new StationAdapter();
