import { Router } from 'express';
import { processCheckout, getDailyProfit, getOrderHistory, getSalesSummary, getEliteAnalytics } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/checkout', authenticateToken, processCheckout);
router.get('/daily-profit', authenticateToken, getDailyProfit);
router.get('/history', authenticateToken, getOrderHistory);
router.get('/summary', authenticateToken, getSalesSummary);
router.get('/elite-analytics', authenticateToken, getEliteAnalytics);

export default router;
