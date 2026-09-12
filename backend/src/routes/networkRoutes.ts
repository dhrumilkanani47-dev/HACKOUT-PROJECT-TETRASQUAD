import { Router } from 'express';
import { networkController } from '../controllers/networkController.js';

const router = Router();

router.get('/', networkController.getNetworks);

export default router;
