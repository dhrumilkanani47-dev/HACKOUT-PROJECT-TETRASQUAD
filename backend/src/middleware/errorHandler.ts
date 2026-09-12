import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    logger.warn('Validation error', {
      requestId,
      endpoint: req.originalUrl,
      method: req.method,
      status: 400,
      errorCode: 'VALIDATION_ERROR',
      message: 'Invalid request payload',
      issues: err.issues,
    });

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.issues[0]?.message || 'Validation failed',
        details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
    });
  }

  // Handle Custom App Errors
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, {
      requestId,
      endpoint: req.originalUrl,
      method: req.method,
      status: err.statusCode,
      errorCode: err.code,
      message: err.message,
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Fallback for Unexpected Internal Errors (do not leak internal details)
  logger.error(`Internal Server Error: ${err.message || err}`, {
    requestId,
    endpoint: req.originalUrl,
    method: req.method,
    status: 500,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
    },
  });
}
