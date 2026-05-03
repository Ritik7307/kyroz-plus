import { Router } from 'express';
import { getMyData } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticateToken, getMyData);

export default router;
