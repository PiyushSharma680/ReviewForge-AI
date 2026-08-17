import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

const githubCodeSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'GitHub authorization code is required'),
    state: z.string().min(1, 'GitHub OAuth state is required'),
  }),
});

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh', validateRequest(refreshSchema), AuthController.refresh);
router.post('/logout', authenticateJWT, AuthController.logout);
router.get('/github', AuthController.githubRedirect);
router.get('/github/callback', AuthController.githubCallback);
router.post('/github', validateRequest(githubCodeSchema), AuthController.githubLogin);
router.get('/me', authenticateJWT, AuthController.getMe);

export default router;
