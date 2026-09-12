import { Router } from 'express';
import { activityController } from '../controllers/activityController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', activityController.getActivitySummary);
router.get('/charging', activityController.getChargingSessions);
router.post('/charging', activityController.createChargingSession);

export default router;
