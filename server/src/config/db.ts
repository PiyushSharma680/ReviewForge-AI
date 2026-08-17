import mongoose from 'mongoose';
import { getRequiredEnv } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
  const mongoUri = getRequiredEnv('MONGODB_URI');
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });
  logger.info('MongoDB connected successfully');
};
