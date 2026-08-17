import { Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, 'User registered successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshTokens(refreshToken);
      return sendSuccess(res, 'Token refreshed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.user!.userId);
      return sendSuccess(res, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user?.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return sendSuccess(res, 'Current user profile', {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        githubUsername: user.githubUsername,
      });
    } catch (error) {
      next(error);
    }
  }

  static async githubRedirect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const returnTo = req.query.returnTo as string;
      return res.redirect(302, AuthService.createGitHubAuthorizationUrl(returnTo));
    } catch (error) {
      next(error);
    }
  }

  static async githubCallback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const code = req.query.code as string;
      const state = req.query.state as string;
      if (!code || !state) {
        throw new Error('GitHub did not return an authorization code');
      }
      const oauthState = AuthService.verifyGitHubState(state);
      const returnUrl = new URL(oauthState.returnTo);
      returnUrl.searchParams.set('code', code);
      returnUrl.searchParams.set('state', state);
      return res.redirect(302, returnUrl.toString());
    } catch (error) {
      next(error);
    }
  }

  static async githubLogin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.body;
      AuthService.verifyGitHubState(state);
      const result = await AuthService.authenticateWithGitHubCode(code);
      return sendSuccess(res, 'GitHub Authentication successful', result);
    } catch (error) {
      next(error);
    }
  }
}
