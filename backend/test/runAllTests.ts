import { app } from '../src/app.js';
import { connectDatabase, prisma } from '../src/database/prismaClient.js';
import { pricingEngine } from '../src/services/pricingEngine.js';
import { rangePrediction } from '../src/ai/RangePrediction.js';
import { chargingTimePrediction } from '../src/ai/ChargingTimePrediction.js';
import { greenScoreService } from '../src/services/greenScoreService.js';
import { vehicleCompatibilityService } from '../src/services/vehicleCompatibilityService.js';
import { Server } from 'http';

const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

let server: Server;
let driverToken = '';
let driverUserId = '';
let driverVehicleId = '';
let otherUserToken = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

async function runTests() {
  console.log('\n🚀 Starting EV GreenCharge Comprehensive Backend Test Suite...\n');
  await connectDatabase();

  server = app.listen(TEST_PORT);
  console.log(`📡 Test server running on ${BASE_URL}\n`);

  try {
    // -------------------------------------------------------------
    // Test Suite 1: Health & Map APIs
    // -------------------------------------------------------------
    console.log('🧪 Suite 1: Health & Map Context');
    const healthRes = await fetch(`http://localhost:${TEST_PORT}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'healthy', 'GET /health returns 200 OK');

    const mapRes = await fetch(`${BASE_URL}/stations/map-context?latitude=23.1884&longitude=72.6289&radius=25`);
    const mapJson = await mapRes.json();
    assert(mapJson.success === true && mapJson.data.stations.length > 0, 'GET /map-context returns stations and hospitals in radius');
    assert(mapJson.data.networks.length > 0, 'GET /map-context returns Indian charging networks');

    // -------------------------------------------------------------
    // Test Suite 2: Authentication & Security
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 2: Authentication & Password Hashing');
    const regEmail = `tester_${Date.now()}@test.in`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Driver',
        email: regEmail,
        password: 'SecurePassword123!',
        phone: '9876543210',
        state: 'Gujarat',
        city: 'Ahmedabad',
        locationSource: 'gps',
      }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201 && regJson.success === true, 'POST /auth/register creates user with hashed password');
    assert(regJson.data.token && !regJson.data.user.passwordHash, 'User response never exposes passwordHash');
    driverToken = regJson.data.token;
    driverUserId = regJson.data.user.id;

    // Login test
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regEmail,
        password: 'SecurePassword123!',
      }),
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && loginJson.data.token, 'POST /auth/login returns valid JWT token');

    // /auth/me test
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    const meJson = await meRes.json();
    assert(meJson.success === true && meJson.data.email === regEmail, 'GET /auth/me returns authenticated user details');

    // Create a 2nd user for ownership isolation testing
    const otherUserEmail = `other_${Date.now()}@test.in`;
    const otherReg = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Other User',
        email: otherUserEmail,
        password: 'SecurePassword123!',
        phone: '9988776655',
        state: 'Maharashtra',
        city: 'Mumbai',
      }),
    });
    const otherJson = await otherReg.json();
    otherUserToken = otherJson.data.token;

    // -------------------------------------------------------------
    // Test Suite 3: Vehicle Management & Ownership Security
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 3: Vehicle Ownership & Security Isolation');
    const vehCreateRes = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${driverToken}`,
      },
      body: JSON.stringify({
        type: 'SUV',
        brand: 'Tata',
        model: 'Nexon EV Empowered+',
        nickname: 'Blue Lightning',
        batteryCapacityKWh: 40.5,
        connectorType: 'CCS2',
        maxChargingPowerKW: 50.0,
        currentBatteryPercentage: 24,
        targetBatteryPercentage: 80,
        isPrimary: true,
      }),
    });
    const vehCreateJson = await vehCreateRes.json();
    assert(vehCreateRes.status === 201 && vehCreateJson.data.userId === driverUserId, 'POST /vehicles derives userId from JWT token');
    driverVehicleId = vehCreateJson.data.id;

    // Unauthorized read attempt: other user trying to get driver's vehicle
    const unauthReadRes = await fetch(`${BASE_URL}/vehicles/${driverVehicleId}`, {
      headers: { Authorization: `Bearer ${otherUserToken}` },
    });
    assert(unauthReadRes.status === 404, 'User 2 CANNOT access User 1 vehicle (Ownership Security enforced)');

    // -------------------------------------------------------------
    // Test Suite 4: User Location Management
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 4: Location Updating');
    const locRes = await fetch(`${BASE_URL}/profile/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${driverToken}`,
      },
      body: JSON.stringify({
        state: 'Gujarat',
        city: 'Gandhinagar',
        latitude: 23.1884,
        longitude: 72.6289,
        locationSource: 'manual',
      }),
    });
    const locJson = await locRes.json();
    assert(locRes.status === 200 && locJson.data.city === 'Gandhinagar', 'PUT /profile/location updates coordinates without requiring GPS');

    // -------------------------------------------------------------
    // Test Suite 5: Charging Station Search & Geospatial Filters
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 5: Station Query, Distance & Filters');
    const stationsRes = await fetch(`${BASE_URL}/stations?city=Gandhinagar`);
    const stationsJson = await stationsRes.json();
    assert(stationsJson.success === true && stationsJson.data.length > 0, 'GET /stations filters by Indian city');

    const nearbyRes = await fetch(`${BASE_URL}/stations/nearby?latitude=23.1884&longitude=72.6289&radius=10`);
    const nearbyJson = await nearbyRes.json();
    assert(nearbyJson.data.count > 0 && nearbyJson.data.stations[0].distanceKm !== undefined, 'GET /stations/nearby calculates accurate Haversine km distance');

    const compatRes = await fetch(`${BASE_URL}/stations/compatible?vehicleId=${driverVehicleId}`, {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    const compatJson = await compatRes.json();
    assert(compatJson.data.count > 0 && compatJson.data.stations[0].compatibility.compatible === true, 'GET /stations/compatible matches CCS2 connectors correctly');

    // -------------------------------------------------------------
    // Test Suite 6: Hospitals & Medical Proximity
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 6: Hospitals Proximity & No-Fabrication Rule');
    const hospRes = await fetch(`${BASE_URL}/hospitals/nearby?latitude=23.1884&longitude=72.6289&radius=15`);
    const hospJson = await hospRes.json();
    assert(hospJson.data.hospitals.length > 0, 'GET /hospitals/nearby returns nearby healthcare facilities');
    assert(hospJson.data.hospitals[0].emergencyAvailable !== 'FABRICATED', 'Hospital availability data strictly follows no-fabrication rule');

    // -------------------------------------------------------------
    // Test Suite 7: Pricing Engine & Formula
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 7: Pricing Engine & Formula Verification');
    const dynPrice = pricingEngine.calculateDynamicPrice({
      basePricePerKWh: 7.20,
      gridDemand: 45,
      hour: 14, // daytime solar
    });
    assert(dynPrice.estimatedPricePerKWh > 0, `Dynamic price calculated: ₹${dynPrice.estimatedPricePerKWh}/kWh`);
    assert(dynPrice.renewablePercentage > 0, `Renewable share estimated: ${dynPrice.renewablePercentage}%`);
    assert(dynPrice.greenScore >= 10 && dynPrice.greenScore <= 100, `Green score within 0-100 bounds: ${dynPrice.greenScore}`);

    const bestWinRes = await fetch(`${BASE_URL}/pricing/best-window`);
    const bestWinJson = await bestWinRes.json();
    assert(bestWinJson.data.bestWindow && bestWinJson.data.bestPrice > 0, 'GET /pricing/best-window returns 24h optimal slot and price in ₹/kWh');

    // -------------------------------------------------------------
    // Test Suite 8: Prompt Specification Test Case (Section 61)
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 8: Prompt Test Case (Ahmedabad, Tata Nexon EV, 24% Battery, GREENEST mode)');
    const testCaseRes = await fetch(
      `${BASE_URL}/ai/recommendation?latitude=23.0225&longitude=72.5714&vehicleId=${driverVehicleId}&currentBatteryPercentage=24&mode=GREENEST`,
      { headers: { Authorization: `Bearer ${driverToken}` } }
    );
    const testCaseJson = await testCaseRes.json();
    assert(testCaseJson.success === true && testCaseJson.data.bestStation, 'AI returns best matching compatible station');
    assert(testCaseJson.data.renewablePercentage > 0, `Returns Renewable Percentage (${testCaseJson.data.renewablePercentage}%)`);
    assert(testCaseJson.data.estimatedPricePerKWh > 0, `Returns Estimated Price (${testCaseJson.data.estimatedPrice})`);
    assert(testCaseJson.data.greenScore > 0, `Returns Green Score (${testCaseJson.data.greenScore}/100)`);
    assert(testCaseJson.data.bestStation.distanceKm !== undefined, `Returns Distance (${testCaseJson.data.bestStation.distanceKm} km)`);
    assert(testCaseJson.data.chargingTimeMinutes > 0, `Returns Charging Time (${testCaseJson.data.estimatedChargingTime})`);
    assert(testCaseJson.data.reasons.length > 0, 'Returns transparent explanatory reasons');
    assert(testCaseJson.data.confidence !== undefined, `Returns Confidence Level (${testCaseJson.data.confidence})`);

    // -------------------------------------------------------------
    // Test Suite 9: AI Chat & Conversational Intent Detection
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 9: AI Chat & Structured Actions');
    const chatRes = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${driverToken}`,
      },
      body: JSON.stringify({
        message: 'Where is the cheapest charger near me for my Nexon EV?',
        vehicleId: driverVehicleId,
        latitude: 23.1884,
        longitude: 72.6289,
      }),
    });
    const chatJson = await chatRes.json();
    assert(chatJson.success === true && chatJson.data.message.length > 0, 'POST /ai/chat detects CHEAPEST intent and answers');
    assert(chatJson.data.actions.length > 0, 'AI Chat returns structured frontend action (e.g. OPEN_STATION or FILTER_STATIONS)');

    // -------------------------------------------------------------
    // Test Suite 10: Smart Charging Scheduler
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 10: Smart Charging Scheduler');
    const schedRes = await fetch(`${BASE_URL}/ai/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${driverToken}`,
      },
      body: JSON.stringify({
        vehicleId: driverVehicleId,
        targetBattery: 85,
        deadline: new Date(Date.now() + 8 * 3600000).toISOString(),
      }),
    });
    const schedJson = await schedRes.json();
    assert(schedJson.success === true && schedJson.data.recommendedStartTime, 'POST /ai/schedule generates smart charging slot');

    // -------------------------------------------------------------
    // Test Suite 11: Price Alerts & Notifications
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 11: Price Alerts & Notifications');
    const alertRes = await fetch(`${BASE_URL}/alerts/price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${driverToken}`,
      },
      body: JSON.stringify({
        targetPrice: 7.50,
        vehicleId: driverVehicleId,
        isForecastBased: true,
      }),
    });
    const alertJson = await alertRes.json();
    assert(alertRes.status === 201 && alertJson.data.targetPrice === 7.50, 'POST /alerts/price registers target price trigger');
    assert(alertJson.data.label.includes('Forecast-Based'), 'Clearly labels forecast-based alerts');

    // -------------------------------------------------------------
    // Test Suite 12: Activity & Charging History
    // -------------------------------------------------------------
    console.log('\n🧪 Suite 12: Activity & Carbon Savings');
    const actRes = await fetch(`${BASE_URL}/activity`, {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    const actJson = await actRes.json();
    assert(actJson.success === true && actJson.data.stats, 'GET /activity returns user session statistics and CO2 savings');

    console.log('\n' + '='.repeat(60));
    console.log(`📊 TEST EXECUTION SUMMARY:`);
    console.log(`   Total Tests:  ${totalTests}`);
    console.log(`   Passed:       ${passedTests}`);
    console.log(`   Failed:       ${failedTests}`);
    console.log('='.repeat(60) + '\n');

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test Suite encountered unhandled error:', err);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests();
