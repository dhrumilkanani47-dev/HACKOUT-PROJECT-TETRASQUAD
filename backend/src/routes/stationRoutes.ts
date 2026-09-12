import { Router } from 'express';
import { stationController } from '../controllers/stationController.js';
import { optionalAuthenticate } from '../middleware/authMiddleware.js';
import { validateQuery } from '../middleware/validationMiddleware.js';
import { stationQuerySchema } from '../schemas/index.js';

const router = Router();

router.get('/nearby', stationController.getNearbyStations);
router.get('/compatible', optionalAuthenticate, stationController.getCompatibleStations);
router.get('/networks', stationController.getNetworks);
router.get('/map-context', stationController.getMapContext);
router.get('/:id', stationController.getStationById);
router.get('/', validateQuery(stationQuerySchema), stationController.getStations);

export default router;
