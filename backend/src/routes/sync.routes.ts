import express from 'express';
import { pushKots, pullKots } from '../controllers/sync.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

// RxDB Replication endpoints
router.post('/pull', authMiddleware, pullKots);
router.post('/push', authMiddleware, pushKots);

export default router;
