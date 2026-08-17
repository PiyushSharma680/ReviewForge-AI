import { Response, NextFunction } from 'express';
import { ReviewService } from '../services/reviewService.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class ReviewController {
  static async createCodeReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const review = await ReviewService.createReview({
        ...req.body,
        userId,
      });
      return sendSuccess(res, 'Code review generated successfully', review, 201);
    } catch (error) {
      next(error);
    }
  }

  static async createPRReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { repoId, prNumber, diffContent, language } = req.body;
      
      const review = await ReviewService.createReview({
        userId,
        repoId,
        prNumber,
        reviewType: 'pr',
        title: `Pull Request #${prNumber || 1} Review`,
        language: language || 'typescript',
        codeSnippet: diffContent || '// Sample PR diff code snippet\nfunction processOrder(order) {\n  var total = order.price * order.qty;\n  return total;\n}',
      });

      return sendSuccess(res, 'PR review generated successfully', review, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getUserReviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const result = await ReviewService.getUserReviews(userId, limit, page);
      return sendSuccess(res, 'Reviews fetched successfully', result.reviews, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getReviewById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const reviewId = req.params.id as string;
      const review = await ReviewService.getReviewById(reviewId, userId);
      return sendSuccess(res, 'Review fetched successfully', review);
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const reviewId = req.params.id as string;
      await ReviewService.deleteReview(reviewId, userId);
      return sendSuccess(res, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
