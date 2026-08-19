import { Router } from 'express';
import { chatWithBusinessAi } from '../controllers/businessAi.controller';
import { authenticateToken, requirePlan } from '../middleware/auth.middleware';

const router = Router();

router.post('/chat', authenticateToken, requirePlan('Growth', 'Scale'), chatWithBusinessAi);

export default router;
