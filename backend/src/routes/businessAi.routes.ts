import { Router } from 'express';
import { chatWithBusinessAi } from '../controllers/businessAi.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/chat', authenticateToken, chatWithBusinessAi);

export default router;
