import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const codeReviewSchema = z.object({
  body: z.object({
    codeSnippet: z.string().min(5, 'Code snippet must be at least 5 characters'),
    language: z.string().optional(),
    title: z.string().optional(),
    customPrompt: z.string().optional(),
  }),
});

router.post('/code', authenticateJWT, validateRequest(codeReviewSchema), ReviewController.createCodeReview);
router.post('/pr', authenticateJWT, ReviewController.createPRReview);
router.get('/', authenticateJWT, ReviewController.getUserReviews);
router.get('/:id', authenticateJWT, ReviewController.getReviewById);
router.delete('/:id', authenticateJWT, ReviewController.deleteReview);

export default router;
