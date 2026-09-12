import { Router } from 'express';
import { pricingController } from '../controllers/pricingController.js';

const router = Router();

router.get('/best-window', pricingController.getBestChargingWindow);
router.get('/forecast', pricingController.getPriceForecast);
router.post('/calculate', pricingController.calculateCost);
router.get('/tariff', pricingController.getDiscomTariff);

export default router;
