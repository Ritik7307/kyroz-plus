import { Router } from 'express';
import { createKot, getActiveKots, getKotHistory, updateKotStatus } from '../controllers/kot.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, createKot);
router.get('/', authenticateToken, getActiveKots);
router.get('/history', authenticateToken, getKotHistory);
router.put('/:id/status', authenticateToken, updateKotStatus);

export default router;
