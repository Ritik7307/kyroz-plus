import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all payment routes

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;
