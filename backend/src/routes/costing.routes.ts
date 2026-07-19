import express from 'express';
import { getDishCosting, updateIngredientPrice, updateDishRecipe, updateBulkRecipes } from '../controllers/costing.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.put('/recipe/bulk', authenticateToken, updateBulkRecipes);
router.get('/dish/:dishId', authenticateToken, getDishCosting);
router.put('/dish/:dishId/recipe', authenticateToken, updateDishRecipe);
router.put('/ingredient', authenticateToken, updateIngredientPrice);

router.get('/debug', async (req, res) => {
  try {
    const Dish = require('../models/Dish').default;
    const Recipe = require('../models/Recipe').default;
    const { getRecipeDetailsRecursive } = require('../controllers/costing.controller');
    const user = await require('../models/User').default.findOne({ email: 'vijayshankarprajapati29@gmail.com' });
    const dish = await Dish.findOne({ name: 'Aloo Gobhi Matar (Semi-Gravy)', userId: user._id });
    if (!dish) return res.json({ error: 'Dish not found' });
    const recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dish._id });
    if (!recipe) return res.json({ error: 'Recipe not found' });
    
    let details: any[] = [];
    for (const ing of recipe.ingredients) {
      const resolved = await getRecipeDetailsRecursive(ing.itemModel, ing.itemId, ing.quantity, user._id);
      details = details.concat(resolved);
    }
    res.json({ details });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
