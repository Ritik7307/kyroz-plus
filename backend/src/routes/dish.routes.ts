import { Router } from 'express';
import { getDishes, createDish, updateDish, deleteDish, deleteAllDishes, getPublicDishes, createDishAdvancedSetup } from '../controllers/dish.controller';
import { authenticateToken, isManager } from '../middleware/auth.middleware';

const router = Router();

router.get('/public/:userId', getPublicDishes);
router.get('/', authenticateToken, getDishes);
router.post('/advanced-setup', authenticateToken, isManager, createDishAdvancedSetup);
router.post('/', authenticateToken, isManager, createDish);
router.put('/:id', authenticateToken, isManager, updateDish);
router.delete('/all', authenticateToken, isManager, deleteAllDishes);
router.delete('/:id', authenticateToken, isManager, deleteDish);

export default router;
