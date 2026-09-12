import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, prisma } from './database/prismaClient.js';
import { jobRunner } from './jobs/jobRunner.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    // 1. Connect to PostgreSQL
    await connectDatabase();

    // 2. Start Background Jobs (Station telemetry refresh, price alert dispatcher)
    jobRunner.startAll();

    // 3. Start HTTP Server
    const server = app.listen(env.PORT, () => {
      logger.info(`⚡ EV GreenCharge Backend running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`📖 Swagger Documentation: http://localhost:${env.PORT}/api-docs`);
      logger.info(`🩺 Health check: http://localhost:${env.PORT}/health`);
    });

    // Graceful Shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      jobRunner.stopAll();
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Closed database connection & server terminated cleanly');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start EV GreenCharge server', { error: String(error) });
    process.exit(1);
  }
}

startServer();
