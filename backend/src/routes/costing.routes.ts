import express from 'express';
import { getDishCosting, updateIngredientPrice, updateDishRecipe, updateBulkRecipes } from '../controllers/costing.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.put('/recipe/bulk', authenticateToken, updateBulkRecipes);
router.get('/dish/:dishId', authenticateToken, getDishCosting);
router.put('/dish/:dishId/recipe', authenticateToken, updateDishRecipe);
router.get('/fix-yields', async (req, res) => {
  try {
    const Recipe = require('../models/Recipe').default;
    const SemiFinishedGood = require('../models/SemiFinishedGood').default;
    const sfgRecipes = await Recipe.find({ targetModel: 'SemiFinishedGood' });
    let updatedCount = 0;
    
    for (const recipe of sfgRecipes) {
      if (recipe.operationalYield === 1 || recipe.targetYield === 1) {
        const sfg = await SemiFinishedGood.findById(recipe.targetId);
        if (sfg && sfg.batchYield && sfg.batchYield > 1) {
          recipe.operationalYield = sfg.batchYield;
          recipe.targetYield = sfg.batchYield;
          await recipe.save();
          updatedCount++;
        }
      }
    }
    res.json({ success: true, updatedCount });
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/inject-biryani-debug', async (req, res) => {
  try {
    const { injectBiryani } = require('../controllers/biryaniInject.controller');
    await injectBiryani(req, res);
  } catch(e: any) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
});

router.get('/inject-fastfood-debug', async (req, res) => {
  try {
    const { injectFastFood } = require('../controllers/fastFoodInject.controller');
    await injectFastFood(req, res);
  } catch(e: any) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
});

router.get('/dump', async (req, res) => {
  try {
    const user = await require('../models/User').default.findOne({ email: 'vijayshankarprajapati29@gmail.com' });
    const PortionMaster = require('../models/PortionMaster').default;
    const pt = await PortionMaster.findOne({ name: 'Aloo Gobhi Matar Portion', userId: user._id });
    if (!pt) return res.json({ error: 'Portion not found' });
    
    res.json({ pt });
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
});

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
