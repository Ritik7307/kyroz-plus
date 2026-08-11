import express from 'express';
import { pushKots, pullKots } from '../controllers/sync.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// RxDB Replication endpoints
router.post('/pull', authenticateToken, pullKots);
router.post('/push', authenticateToken, pushKots);

export default router;
