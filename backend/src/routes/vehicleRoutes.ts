import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { vehicleCreateSchema, vehicleUpdateSchema } from '../schemas/index.js';

const router = Router();

router.use(authenticate);

router.get('/', vehicleController.getVehicles);
router.post('/', validateBody(vehicleCreateSchema), vehicleController.createVehicle);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', validateBody(vehicleUpdateSchema), vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);
router.put('/:id/primary', vehicleController.setPrimaryVehicle);

export default router;
