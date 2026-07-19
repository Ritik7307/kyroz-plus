import { Router } from 'express';
import { getDishes, createDish, updateDish, deleteDish, deleteAllDishes, getPublicDishes, forceSeedDb, createDishAdvancedSetup } from '../controllers/dish.controller';
import { authenticateToken, isManager } from '../middleware/auth.middleware';

const router = Router();

router.get('/public/:userId', getPublicDishes);
import Dish from '../models/Dish';
router.get('/public-force-seed/:userId', forceSeedDb);
router.get('/nuke', async (req, res) => {
  try {
    const RawMaterial = require('../models/RawMaterial').default;
    const PreparationMaster = require('../models/PreparationMaster').default;
    const SemiFinishedGood = require('../models/SemiFinishedGood').default;
    const PortionMaster = require('../models/PortionMaster').default;
    const Packaging = require('../models/Packaging').default;
    const Dish = require('../models/Dish').default;
    const Recipe = require('../models/Recipe').default;
    const Inventory = require('../models/Inventory').default;
    
    await RawMaterial.deleteMany({});
    await PreparationMaster.deleteMany({});
    await SemiFinishedGood.deleteMany({});
    await PortionMaster.deleteMany({});
    await Packaging.deleteMany({});
    await Dish.deleteMany({});
    await Recipe.deleteMany({});
    await Inventory.deleteMany({});
    
    res.send('Database wiped! Please go back to your dashboard and refresh to automatically rebuild the architecture.');
  } catch(e: any) {
    res.status(500).send(e.message);
  }
});
router.get('/', authenticateToken, getDishes);
router.post('/advanced-setup', authenticateToken, isManager, createDishAdvancedSetup);
router.post('/', authenticateToken, isManager, createDish);
router.put('/:id', authenticateToken, isManager, updateDish);
router.delete('/all', authenticateToken, isManager, deleteAllDishes);
router.delete('/:id', authenticateToken, isManager, deleteDish);

export default router;
