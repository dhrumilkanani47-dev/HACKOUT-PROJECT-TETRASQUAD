import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding EV GreenCharge Indian dataset...');

  // 1. Seed Charging Networks
  const networksData = [
    {
      id: 'net_tata',
      name: 'Tata Power EZ Charge',
      logo: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=100&h=100&fit=crop',
      website: 'https://www.tatapower.com/evcharge/',
      active: true,
      metadata: JSON.stringify({ roaming: true, tollFree: '1800-209-5161' }),
    },
    {
      id: 'net_jiobp',
      name: 'Jio-bp pulse',
      logo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=100&h=100&fit=crop',
      website: 'https://www.jiobp.com/pulse',
      active: true,
      metadata: JSON.stringify({ ultraFast: true, partnership: 'BP & Reliance' }),
    },
    {
      id: 'net_chargezone',
      name: 'ChargeZone',
      logo: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop',
      website: 'https://www.chargezone.com',
      active: true,
      metadata: JSON.stringify({ highwayCorridors: true, highPowerDC: true }),
    },
    {
      id: 'net_statiq',
      name: 'Statiq',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&h=100&fit=crop',
      website: 'https://www.statiq.in',
      active: true,
      metadata: JSON.stringify({ verifiedChargers: true }),
    },
    {
      id: 'net_zeon',
      name: 'Zeon Charging',
      logo: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=100&h=100&fit=crop',
      website: 'https://www.zeoncharging.com',
      active: true,
      metadata: JSON.stringify({ southernCorridor: true }),
    },
    {
      id: 'net_hpcl',
      name: 'HPCL EV Power',
      logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=100&h=100&fit=crop',
      website: 'https://www.hindustanpetroleum.com',
      active: true,
      metadata: JSON.stringify({ petrolPumpCoLocation: true }),
    },
    {
      id: 'net_iocl',
      name: 'IndianOil EV e-Charge',
      logo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=100&h=100&fit=crop',
      website: 'https://iocl.com',
      active: true,
      metadata: JSON.stringify({ nationalHighwayPresence: true }),
    },
    {
      id: 'net_bpcl',
      name: 'BPCL e-Drive',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop',
      website: 'https://www.bharatpetroleum.in',
      active: true,
      metadata: JSON.stringify({ fastChargerHubs: true }),
    },
  ];

  for (const n of networksData) {
    await prisma.chargingNetwork.upsert({
      where: { id: n.id },
      update: n,
      create: n,
    });
  }
  console.log(`✅ Seeded ${networksData.length} Charging Networks`);

  // 2. Seed Users
  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash('GreenCharge@2026', salt);

  const demoDriver = await prisma.user.upsert({
    where: { email: 'shani.kakadiya@evgreencharge.in' },
    update: {
      name: 'Shani Kakadiya',
      phone: '+91 98765 43210',
      state: 'Gujarat',
      city: 'Gandhinagar',
      latitude: 23.1884,
      longitude: 72.6289,
      locationSource: 'gps',
      role: 'DRIVER',
    },
    create: {
      email: 'shani.kakadiya@evgreencharge.in',
      passwordHash: hashedPw,
      name: 'Shani Kakadiya',
      phone: '+91 98765 43210',
      state: 'Gujarat',
      city: 'Gandhinagar',
      latitude: 23.1884,
      longitude: 72.6289,
      locationSource: 'gps',
      role: 'DRIVER',
    },
  });

  await prisma.userPreference.upsert({
    where: { userId: demoDriver.id },
    update: {
      preferredMode: 'SMART',
      preferredNetworks: 'all',
      targetBattery: 85,
    },
    create: {
      userId: demoDriver.id,
      preferredMode: 'SMART',
      preferredNetworks: 'all',
      targetBattery: 85,
    },
  });

  // 3. Seed Vehicles for Demo User
  const vehiclesData = [
    {
      id: 'veh_nexon_01',
      userId: demoDriver.id,
      type: 'SUV',
      brand: 'Tata',
      model: 'Nexon EV Empowered+',
      nickname: 'Stealth Green',
      batteryCapacityKWh: 40.5,
      connectorType: 'CCS2',
      maxChargingPowerKW: 50.0,
      currentBatteryPercentage: 68,
      targetBatteryPercentage: 85,
      isPrimary: true,
    },
    {
      id: 'veh_ather_02',
      userId: demoDriver.id,
      type: 'Scooter (2W)',
      brand: 'Ather',
      model: '450X Gen 3',
      nickname: 'City Dart',
      batteryCapacityKWh: 3.7,
      connectorType: 'Type 2',
      maxChargingPowerKW: 3.3,
      currentBatteryPercentage: 84,
      targetBatteryPercentage: 100,
      isPrimary: false,
    },
    {
      id: 'veh_mg_03',
      userId: demoDriver.id,
      type: 'SUV',
      brand: 'MG',
      model: 'ZS EV Exclusive',
      nickname: 'Highway Cruiser',
      batteryCapacityKWh: 50.3,
      connectorType: 'CCS2',
      maxChargingPowerKW: 60.0,
      currentBatteryPercentage: 32,
      targetBatteryPercentage: 80,
      isPrimary: false,
    },
  ];

  for (const v of vehiclesData) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      update: v,
      create: v,
    });
  }
  console.log(`✅ Seeded ${vehiclesData.length} Vehicles for Demo Driver`);

  // 4. Seed EV Stations across Gandhinagar, Ahmedabad, GIFT City
  const stationsData = [
    {
      id: 'st_01',
      networkId: 'net_tata',
      name: 'Tata Power — Infocity Tech Park',
      latitude: 23.1895,
      longitude: 72.6312,
      address: 'Near Gate 3, Infocity, Super Corridor, Gandhinagar',
      city: 'Gandhinagar',
      state: 'Gujarat',
      connectors: 'CCS2, Type 2',
      chargingPowerKW: 60,
      availability: 'AVAILABLE',
      pricePerKWh: 8.40,
      priceType: 'ACTUAL',
      openingStatus: 'OPEN_24_7',
      availableChargers: 4,
      totalChargers: 6,
    },
    {
      id: 'st_02',
      networkId: 'net_jiobp',
      name: 'Jio-bp pulse — Kudasan Hub',
      latitude: 23.1764,
      longitude: 72.6389,
      address: 'Kudasan Crossroad, Gandhinagar Bypass',
      city: 'Gandhinagar',
      state: 'Gujarat',
      connectors: 'CCS2, CHAdeMO',
      chargingPowerKW: 120,
      availability: 'AVAILABLE',
      pricePerKWh: 7.60,
      priceType: 'ACTUAL',
      openingStatus: 'OPEN_24_7',
      availableChargers: 3,
      totalChargers: 4,
    },
    {
      id: 'st_03',
      networkId: 'net_chargezone',
      name: 'ChargeZone Hypercharger — GIFT City Tower 1',
      latitude: 23.1612,
      longitude: 72.6841,
      address: 'Processing Zone, GIFT City, Gandhinagar',
      city: 'Gandhinagar',
      state: 'Gujarat',
      connectors: 'CCS2',
      chargingPowerKW: 150,
      availability: 'AVAILABLE',
      pricePerKWh: 6.80,
      priceType: 'ACTUAL',
      openingStatus: 'OPEN_24_7',
      availableChargers: 5,
      totalChargers: 6,
    },
    {
      id: 'st_04',
      networkId: 'net_statiq',
      name: 'Statiq GreenHub — SG Highway Bodakdev',
      latitude: 23.0384,
      longitude: 72.5112,
      address: 'Near Pakwan Crossroads, SG Highway, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      connectors: 'CCS2, Type 2',
      chargingPowerKW: 60,
      availability: 'AVAILABLE',
      pricePerKWh: 7.20,
      priceType: 'ESTIMATED',
      openingStatus: 'OPEN_24_7',
      availableChargers: 2,
      totalChargers: 4,
    },
    {
      id: 'st_05',
      networkId: 'net_tata',
      name: 'Tata Power — Apollo Hospitals Circle',
      latitude: 23.1114,
      longitude: 72.5932,
      address: 'Opposite Apollo Hospital, Gandhinagar-Ahmedabad Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      connectors: 'CCS2, Type 2',
      chargingPowerKW: 60,
      availability: 'AVAILABLE',
      pricePerKWh: 8.10,
      priceType: 'ACTUAL',
      openingStatus: 'OPEN_24_7',
      availableChargers: 3,
      totalChargers: 4,
    },
    {
      id: 'st_06',
      networkId: 'net_zeon',
      name: 'Zeon Solar Charge Hub — PDPU Road',
      latitude: 23.1554,
      longitude: 72.6621,
      address: 'Near Pandit Deendayal Energy University, Raisan',
      city: 'Gandhinagar',
      state: 'Gujarat',
      connectors: 'CCS2, Type 2',
      chargingPowerKW: 50,
      availability: 'AVAILABLE',
      pricePerKWh: 6.40,
      priceType: 'ESTIMATED',
      openingStatus: 'OPEN_24_7',
      availableChargers: 2,
      totalChargers: 2,
    },
    {
      id: 'st_07',
      networkId: 'net_hpcl',
      name: 'HPCL e-Station — Airport Road Hansol',
      latitude: 23.0789,
      longitude: 72.6245,
      address: 'HP Fuel Station, Airport Circle, Hansol, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      connectors: 'CCS2',
      chargingPowerKW: 60,
      availability: 'AVAILABLE',
      pricePerKWh: 7.90,
      priceType: 'ACTUAL',
      openingStatus: 'OPEN_24_7',
      availableChargers: 1,
      totalChargers: 2,
    },
  ];

  for (const s of stationsData) {
    await prisma.station.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Seeded ${stationsData.length} Stations`);

  // 5. Seed Real Hospitals for Medical Emergency Proximity
  const hospitalsData = [
    {
      id: 'hosp_apollo',
      name: 'Apollo Hospitals International',
      latitude: 23.1119,
      longitude: 72.5938,
      address: 'Plot No. 1A, Bhat GIDC Estate, Gandhinagar Highway',
      city: 'Gandhinagar',
      state: 'Gujarat',
      phone: '+91 79 6670 1800',
      emergencyAvailable: '24x7 Trauma & Emergency Center',
    },
    {
      id: 'hosp_civil',
      name: 'Gandhinagar Civil Hospital (GMERS)',
      latitude: 23.2201,
      longitude: 72.6512,
      address: 'Sector 12, Gandhinagar',
      city: 'Gandhinagar',
      state: 'Gujarat',
      phone: '+91 79 2322 1931',
      emergencyAvailable: '24x7 Emergency Casualty',
    },
    {
      id: 'hosp_kd',
      name: 'KD Hospital (Kusum Dhirajlal)',
      latitude: 23.1098,
      longitude: 72.5441,
      address: 'Near Vaishnodevi Circle, SG Highway, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      phone: '+91 79 6777 0000',
      emergencyAvailable: '24x7 Emergency Services',
    },
    {
      id: 'hosp_cims',
      name: 'Marengo CIMS Hospital',
      latitude: 23.0782,
      longitude: 72.5184,
      address: 'Off Science City Road, Sola, Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      phone: '+91 79 4805 1000',
      emergencyAvailable: '24x7 Cardiac & Emergency Care',
    },
  ];

  for (const h of hospitalsData) {
    await prisma.hospital.upsert({
      where: { id: h.id },
      update: h,
      create: h,
    });
  }
  console.log(`✅ Seeded ${hospitalsData.length} Hospitals`);

  // 6. Seed Charging Sessions & Activity History for Demo User
  const sampleSessions = [
    {
      id: 'sess_01',
      userId: demoDriver.id,
      vehicleId: 'veh_nexon_01',
      stationId: 'st_01',
      startTime: new Date(Date.now() - 3 * 86400000),
      endTime: new Date(Date.now() - 3 * 86400000 + 35 * 60000),
      energyConsumedKWh: 24.8,
      pricePerKWh: 8.40,
      totalCost: 208.3,
      energyMix: JSON.stringify({ solar: 65, wind: 20, coal: 10, hydro: 5 }),
      greenScore: 94,
      carbonEstimate: 0.12,
      co2AvoidedKg: 14.6,
      status: 'COMPLETED',
    },
    {
      id: 'sess_02',
      userId: demoDriver.id,
      vehicleId: 'veh_nexon_01',
      stationId: 'st_03',
      startTime: new Date(Date.now() - 86400000),
      endTime: new Date(Date.now() - 86400000 + 22 * 60000),
      energyConsumedKWh: 28.5,
      pricePerKWh: 6.80,
      totalCost: 193.8,
      energyMix: JSON.stringify({ solar: 80, wind: 15, coal: 3, hydro: 2 }),
      greenScore: 98,
      carbonEstimate: 0.05,
      co2AvoidedKg: 18.9,
      status: 'COMPLETED',
    },
  ];

  for (const s of sampleSessions) {
    await prisma.chargingSession.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Seeded ${sampleSessions.length} Past Charging Sessions`);

  console.log('✨ Seeding complete! Database is primed with realistic Indian EV data.');
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
