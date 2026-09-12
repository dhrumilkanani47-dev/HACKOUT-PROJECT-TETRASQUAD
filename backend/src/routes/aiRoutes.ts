import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { optionalAuthenticate, authenticate } from '../middleware/authMiddleware.js';
import { validateBody, validateQuery } from '../middleware/validationMiddleware.js';
import { aiChatSchema, aiScheduleSchema, aiRecommendationQuerySchema } from '../schemas/index.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/recommendation', optionalAuthenticate, validateQuery(aiRecommendationQuerySchema), aiController.getRecommendation);
router.post('/chat', aiRateLimiter, optionalAuthenticate, validateBody(aiChatSchema), aiController.chat);
router.post('/schedule', authenticate, validateBody(aiScheduleSchema), aiController.schedule);

export default router;
