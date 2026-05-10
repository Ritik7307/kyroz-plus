import { Router } from 'express';
import { getMyData, addStaff, getStaff, updateStaff, deleteStaff } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticateToken, getMyData);
router.post('/staff', authenticateToken, addStaff);
router.get('/staff', authenticateToken, getStaff);
router.put('/staff/:id', authenticateToken, updateStaff);
router.delete('/staff/:id', authenticateToken, deleteStaff);

export default router;
