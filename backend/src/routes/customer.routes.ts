import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getCustomers } from '../controllers/customer.controller';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getCustomers);

export default router;
