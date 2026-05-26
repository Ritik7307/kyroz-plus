import express from 'express';
import { getDishCosting, updateIngredientPrice } from '../controllers/costing.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/dish/:dishId', authenticateToken, getDishCosting);
router.put('/ingredient', authenticateToken, updateIngredientPrice);

export default router;
