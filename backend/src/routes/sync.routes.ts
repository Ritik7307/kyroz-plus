import express from 'express';
import { pushKots, pullKots, processSyncQueueTask } from '../controllers/sync.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// General offline sync endpoint
router.post('/', processSyncQueueTask);

// RxDB Replication endpoints
router.post('/pull', authenticateToken, pullKots);
router.post('/push', authenticateToken, pushKots);

export default router;
