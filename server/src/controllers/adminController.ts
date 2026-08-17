import { Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { Review } from '../models/Review.js';
import { Repository } from '../models/Repository.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AdminController {
  static async getSystemStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const [totalUsers, totalReviews, totalRepos] = await Promise.all([
        User.countDocuments(),
        Review.countDocuments(),
        Repository.countDocuments(),
      ]);

      return sendSuccess(res, 'System stats fetched', {
        totalUsers,
        totalReviews,
        totalRepos,
        systemHealth: '100% Operational',
        activeQueues: {
          reviewQueue: 0,
          repoSyncQueue: 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await User.find().sort({ createdAt: -1 }).limit(50);
      return sendSuccess(res, 'Users retrieved for admin', users);
    } catch (error) {
      next(error);
    }
  }
}
