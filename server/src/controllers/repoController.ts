import { Response, NextFunction } from 'express';
import { RepoService } from '../services/repoService.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class RepoController {
  static async getRepositories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const repos = await RepoService.getUserRepositories(userId);
      return sendSuccess(res, 'Repositories retrieved successfully', repos);
    } catch (error) {
      next(error);
    }
  }

  static async getGitHubRemoteRepos(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const repos = await RepoService.fetchGitHubUserRepos(userId);
      return sendSuccess(res, 'Remote GitHub repositories fetched successfully', repos);
    } catch (error) {
      next(error);
    }
  }

  static async importRepository(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const repo = await RepoService.importRepository(userId, req.body);
      return sendSuccess(res, 'Repository imported successfully', repo, 201);
    } catch (error) {
      next(error);
    }
  }
}
