import express from 'express';
import { logWastage, getWastageHistory } from '../controllers/wastage.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, logWastage);
router.get('/', authenticateToken, getWastageHistory);

export default router;
