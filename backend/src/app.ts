import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import stationRoutes from './routes/stationRoutes.js';
import networkRoutes from './routes/networkRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import savedStationRoutes from './routes/savedStationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

export const app = express();

// Security and utility middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Structured Request Logger with timing & sanitized metadata
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const latencyMs = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} (${latencyMs}ms)`, {
      requestId,
      method: req.method,
      endpoint: req.originalUrl,
      status: res.statusCode,
      latencyMs,
    });
  });

  next();
});

// General rate limiter
app.use('/api', generalRateLimiter);

// Interactive Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'evgreencharge-backend',
    version: '1.0.0',
    region: 'India (Asia/Kolkata)',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/saved-stations', savedStationRoutes);
app.use('/api/notifications', notificationRoutes);

// Map API alias
app.get('/api/map', (req: Request, res: Response, next: NextFunction) => {
  req.url = '/map-context';
  stationRoutes(req, res, next);
});

// 404 Route Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);
