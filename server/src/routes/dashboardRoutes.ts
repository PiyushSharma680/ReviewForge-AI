import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, DashboardController.getDashboardStats);

export default router;
