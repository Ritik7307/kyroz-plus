import { Router } from 'express';
import { getInventory, updateInventoryItem, deleteInventoryItem, notifyAdminAboutStock, uploadInventoryConfig, updateStock, addPurchaseEntry, addProductionEntry } from '../controllers/inventory.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import multer from 'multer';

const upload = multer();

const router = Router();

router.get('/', authenticateToken, getInventory);
router.post('/', authenticateToken, updateInventoryItem);
router.delete('/:id', authenticateToken, deleteInventoryItem);
router.post('/notify/:id', authenticateToken, notifyAdminAboutStock);
router.post('/upload', authenticateToken, upload.single('file'), uploadInventoryConfig);
router.post('/update-stock', authenticateToken, updateStock);
router.post('/purchase', authenticateToken, addPurchaseEntry);
router.post('/produce', authenticateToken, addProductionEntry);

export default router;
