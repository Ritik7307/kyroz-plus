import { Router } from 'express';
import { processCheckout, getDailyProfit, getOrderHistory, getSalesSummary } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/checkout', authenticateToken, processCheckout);
router.get('/daily-profit', authenticateToken, getDailyProfit);
router.get('/history', authenticateToken, getOrderHistory);
router.get('/summary', authenticateToken, getSalesSummary);

export default router;
