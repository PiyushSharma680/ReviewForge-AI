import { Router } from 'express';
import { ChatController } from '../controllers/chatController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateJWT, ChatController.sendMessage);
router.get('/', authenticateJWT, ChatController.getUserChats);

export default router;
