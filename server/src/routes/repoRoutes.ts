import { Router } from 'express';
import { RepoController } from '../controllers/repoController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, RepoController.getRepositories);
router.get('/github/remote', authenticateJWT, RepoController.getGitHubRemoteRepos);
router.post('/import', authenticateJWT, RepoController.importRepository);

export default router;
