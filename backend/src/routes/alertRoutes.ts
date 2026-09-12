import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { priceAlertSchema } from '../schemas/index.js';

const router = Router();

router.use(authenticate);

router.post('/price', validateBody(priceAlertSchema), alertController.createPriceAlert);
router.get('/price', alertController.getPriceAlerts);
router.delete('/price/:id', alertController.deletePriceAlert);

export default router;
