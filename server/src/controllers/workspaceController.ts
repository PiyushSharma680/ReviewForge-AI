import { Response, NextFunction } from 'express';
import { Workspace } from '../models/Workspace.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiError } from '../utils/apiError.js';

export class WorkspaceController {
  static async getWorkspaces(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const workspaces = await Workspace.find({
        $or: [{ ownerId: userId }, { 'members.userId': userId }],
      }).populate('members.userId', 'name email avatar');

      return sendSuccess(res, 'Workspaces fetched successfully', workspaces);
    } catch (error) {
      next(error);
    }
  }

  static async createWorkspace(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { name } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

      const workspace = await Workspace.create({
        name,
        slug,
        ownerId: userId,
        members: [{ userId, role: 'owner', joinedAt: new Date() }],
      });

      return sendSuccess(res, 'Workspace created successfully', workspace, 201);
    } catch (error) {
      next(error);
    }
  }
}
