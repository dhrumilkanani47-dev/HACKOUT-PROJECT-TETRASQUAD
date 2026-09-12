import { Router } from 'express';
import { hospitalController } from '../controllers/hospitalController.js';
import { validateQuery } from '../middleware/validationMiddleware.js';
import { hospitalQuerySchema } from '../schemas/index.js';

const router = Router();

router.get('/nearby', validateQuery(hospitalQuerySchema), hospitalController.getNearbyHospitals);

export default router;
