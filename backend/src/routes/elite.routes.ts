import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getDashboardStats } from '../controllers/elite.controller';

const router = express.Router();

router.get('/dashboard', authenticate, getDashboardStats);

export default router;
