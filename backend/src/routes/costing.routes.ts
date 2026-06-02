import express from 'express';
import { getDishCosting, updateIngredientPrice, updateDishRecipe } from '../controllers/costing.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/dish/:dishId', authenticateToken, getDishCosting);
router.put('/dish/:dishId/recipe', authenticateToken, updateDishRecipe);
router.put('/ingredient', authenticateToken, updateIngredientPrice);

export default router;
