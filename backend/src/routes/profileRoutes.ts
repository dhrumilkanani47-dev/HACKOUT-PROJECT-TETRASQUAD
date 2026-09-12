import { Router } from 'express';
import { profileController } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { updateLocationSchema } from '../schemas/index.js';

const router = Router();

router.use(authenticate);

router.get('/', profileController.getProfile);
router.put('/location', validateBody(updateLocationSchema), profileController.updateLocation);

export default router;
