import Redis from 'ioredis';
import { env } from '../config/env.js';
import { logger } from './logger.js';

interface MemoryCacheItem {
  value: any;
  expiresAt: number;
}

class CacheService {
  private redis: Redis | null = null;
  private memoryCache: Map<string, MemoryCacheItem> = new Map();
  private isRedisConnected = false;

  constructor() {
    if (env.REDIS_URL) {
      try {
        this.redis = new Redis(env.REDIS_URL, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          retryStrategy: () => null, // Don't hang if redis is not running
        });

        this.redis.connect()
          .then(() => {
            this.isRedisConnected = true;
            logger.info('Connected to Redis cache successfully');
          })
          .catch((err) => {
            this.isRedisConnected = false;
            logger.info('Redis not accessible, using built-in high-performance in-memory cache');
          });

        this.redis.on('error', () => {
          this.isRedisConnected = false;
        });
      } catch (e) {
        this.isRedisConnected = false;
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isRedisConnected && this.redis) {
      try {
        const val = await this.redis.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        // Fallback to memory
      }
    }

    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (err) {
        // Fallback to memory
      }
    }

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.del(key);
      } catch (err) {}
    }
    this.memoryCache.delete(key);
  }

  async clear(): Promise<void> {
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.flushdb();
      } catch (err) {}
    }
    this.memoryCache.clear();
  }
}

export const cache = new CacheService();
