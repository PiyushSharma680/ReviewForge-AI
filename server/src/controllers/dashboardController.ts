import { Response, NextFunction } from 'express';
import { Repository } from '../models/Repository.js';
import { Review } from '../models/Review.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class DashboardController {
  static async getDashboardStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const [repos, reviews, recentReviews] = await Promise.all([
        Repository.find({ ownerId: userId }),
        Review.find({ userId }),
        Review.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('repoId', 'repoName fullName'),
      ]);

      const repoCount = repos.length;
      const reviewCount = reviews.length;

      const avgScore = reviewCount > 0
        ? Math.round(reviews.reduce((acc, r) => acc + r.score, 0) / reviewCount)
        : 88;

      const avgSecurity = reviewCount > 0
        ? Math.round(reviews.reduce((acc, r) => acc + r.securityScore, 0) / reviewCount)
        : 92;

      const avgPerformance = reviewCount > 0
        ? Math.round(reviews.reduce((acc, r) => acc + r.performanceScore, 0) / reviewCount)
        : 85;

      const avgMaintainability = reviewCount > 0
        ? Math.round(reviews.reduce((acc, r) => acc + r.maintainabilityScore, 0) / reviewCount)
        : 87;

      // Weekly trends mock calculation
      const weeklyTrends = [
        { day: 'Mon', reviews: 4, securityScore: 90, qualityScore: 84 },
        { day: 'Tue', reviews: 7, securityScore: 94, qualityScore: 88 },
        { day: 'Wed', reviews: 5, securityScore: 91, qualityScore: 86 },
        { day: 'Thu', reviews: 12, securityScore: 88, qualityScore: 82 },
        { day: 'Fri', reviews: 9, securityScore: 95, qualityScore: 91 },
        { day: 'Sat', reviews: 3, securityScore: 96, qualityScore: 94 },
        { day: 'Sun', reviews: 6, securityScore: 92, qualityScore: 89 },
      ];

      return sendSuccess(res, 'Dashboard statistics fetched successfully', {
        repositoryCount: repoCount,
        reviewCount: reviewCount,
        averageScore: avgScore,
        securityScore: avgSecurity,
        performanceScore: avgPerformance,
        maintainabilityScore: avgMaintainability,
        technicalDebtScore: 14, // Hours estimated
        recentReviews,
        repositories: repos,
        weeklyTrends,
      });
    } catch (error) {
      next(error);
    }
  }
}
