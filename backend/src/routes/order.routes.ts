import { Router } from 'express';
import { processCheckout, getDailyProfit, getOrderHistory } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/checkout', authenticateToken, processCheckout);
router.get('/daily-profit', authenticateToken, getDailyProfit);
router.get('/history', authenticateToken, getOrderHistory);

export default router;
