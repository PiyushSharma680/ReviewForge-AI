import Redis from 'ioredis';
import { getRequiredEnv } from './env.js';
import { logger } from '../utils/logger.js';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(getRequiredEnv('REDIS_URL'), {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      connectTimeout: 10_000,
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis connection error: ${err.message}`);
    });
  }

  return redisClient;
};

export const connectRedis = async (): Promise<void> => {
  const client = getRedisClient();
  if (client.status === 'wait') {
    await client.connect();
  }
  await client.ping();
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
