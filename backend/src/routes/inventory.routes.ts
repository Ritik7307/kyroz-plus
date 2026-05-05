import { Router } from 'express';
import { getInventory, updateInventoryItem, deleteInventoryItem, notifyAdminAboutStock } from '../controllers/inventory.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getInventory);
router.post('/', authenticateToken, updateInventoryItem);
router.delete('/:id', authenticateToken, deleteInventoryItem);
router.post('/notify/:id', authenticateToken, notifyAdminAboutStock);

export default router;
