import { Review, IReview } from '../models/Review.js';
import { AIService, AIReviewResult } from './aiService.js';
import { ApiError } from '../utils/apiError.js';

export interface CreateReviewDTO {
  userId: string;
  repoId?: string;
  prNumber?: number;
  commitHash?: string;
  title?: string;
  reviewType?: 'snippet' | 'file' | 'commit' | 'pr' | 'repository';
  language?: string;
  codeSnippet: string;
  customPrompt?: string;
}

export class ReviewService {
  static async createReview(dto: CreateReviewDTO): Promise<IReview> {
    const language = dto.language || 'typescript';
    const title = dto.title || `Review: ${dto.reviewType || 'snippet'} (${language})`;

    // Run AI Analysis
    const aiResult: AIReviewResult = await AIService.analyzeCode(
      dto.codeSnippet,
      language,
      dto.customPrompt
    );

    const review = await Review.create({
      userId: dto.userId,
      repoId: dto.repoId,
      prNumber: dto.prNumber,
      commitHash: dto.commitHash,
      title: aiResult.title || title,
      reviewType: dto.reviewType || 'snippet',
      language,
      codeSnippet: dto.codeSnippet,
      score: aiResult.score,
      securityScore: aiResult.securityScore,
      performanceScore: aiResult.performanceScore,
      readabilityScore: aiResult.readabilityScore,
      maintainabilityScore: aiResult.maintainabilityScore,
      complexityScore: aiResult.complexityScore,
      summary: aiResult.summary,
      positivePoints: aiResult.positivePoints,
      suggestions: aiResult.suggestions,
      securityIssues: aiResult.securityIssues,
      refactoringIdeas: aiResult.refactoringIdeas,
      status: 'completed',
      aiModelUsed: 'Gemini-1.5-Flash / OpenAI',
    });

    return review;
  }

  static async getUserReviews(userId: string, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('repoId', 'repoName fullName ownerName'),
      Review.countDocuments({ userId }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getReviewById(reviewId: string, userId: string): Promise<IReview> {
    const review = await Review.findOne({ _id: reviewId, userId }).populate('repoId');
    if (!review) {
      throw ApiError.notFound('Review not found or unauthorized');
    }
    return review;
  }

  static async deleteReview(reviewId: string, userId: string): Promise<void> {
    const result = await Review.deleteOne({ _id: reviewId, userId });
    if (result.deletedCount === 0) {
      throw ApiError.notFound('Review not found or unauthorized');
    }
  }
}
