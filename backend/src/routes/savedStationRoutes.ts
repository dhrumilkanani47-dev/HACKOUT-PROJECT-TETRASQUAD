import { Router } from 'express';
import { savedStationController } from '../controllers/savedStationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', savedStationController.getSavedStations);
router.post('/', savedStationController.saveStation);
router.delete('/:id', savedStationController.removeSavedStation);

export default router;
