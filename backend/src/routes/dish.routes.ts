import { Router } from 'express';
import { getDishes, createDish, updateDish, deleteDish, getPublicDishes } from '../controllers/dish.controller';
import { authenticateToken, isManager } from '../middleware/auth.middleware';

const router = Router();

router.get('/public/:userId', getPublicDishes);
router.get('/', authenticateToken, getDishes);
router.post('/', authenticateToken, isManager, createDish);
router.put('/:id', authenticateToken, isManager, updateDish);
router.delete('/:id', authenticateToken, isManager, deleteDish);

export default router;
