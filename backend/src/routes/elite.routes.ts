import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getDashboardStats } from '../controllers/elite.controller';

const router = express.Router();

router.get('/dashboard', authenticateToken, getDashboardStats);

export default router;
