import { Router } from 'express';
import { processCheckout } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/checkout', authenticateToken, processCheckout);

export default router;
