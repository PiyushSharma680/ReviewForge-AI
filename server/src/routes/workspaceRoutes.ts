import { Router } from 'express';
import { WorkspaceController } from '../controllers/workspaceController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, WorkspaceController.getWorkspaces);
router.post('/', authenticateJWT, WorkspaceController.createWorkspace);

export default router;
