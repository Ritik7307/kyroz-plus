import { Router } from 'express';
import { getInventory, updateInventoryItem, deleteInventoryItem, notifyAdminAboutStock, uploadInventoryConfig, updateStock, addPurchaseEntry, addProductionEntry } from '../controllers/inventory.controller';
import { injectSops } from '../controllers/sopInject.controller';
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
import User from '../models/User';
import Dish from '../models/Dish';

import { injectBiryani } from '../controllers/biryaniInject.controller';

router.post('/produce', authenticateToken, addProductionEntry);
router.post('/inject-sops', authenticateToken, injectSops);
router.post('/inject-biryani', authenticateToken, injectBiryani);
router.get('/debug', async (req, res) => {
  const allUsers = await User.find({}, 'email _id');
  const debugInfo: any = {};
  for (const u of allUsers) {
    debugInfo[u.email] = await Dish.countDocuments({ userId: u._id });
  }
  res.json(debugInfo);
});

export default router;
