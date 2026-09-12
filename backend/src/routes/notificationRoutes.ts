import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { userPreferencesSchema } from '../schemas/index.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.post('/preferences', validateBody(userPreferencesSchema), notificationController.updatePreferences);
router.put('/:id/read', notificationController.markAsRead);

export default router;
