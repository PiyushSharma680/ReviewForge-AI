import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticateJWT, authorizeRoles('admin', 'owner'), AdminController.getSystemStats);
router.get('/users', authenticateJWT, authorizeRoles('admin', 'owner'), AdminController.getUsers);

export default router;
