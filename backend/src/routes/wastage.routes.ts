import express from 'express';
import { logWastage, getWastageHistory } from '../controllers/wastage.controller';
import { authenticateToken, requirePlan } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, requirePlan('Growth', 'Scale'), logWastage);
router.get('/', authenticateToken, requirePlan('Growth', 'Scale'), getWastageHistory);

export default router;
