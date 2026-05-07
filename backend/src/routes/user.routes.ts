import { Router } from 'express';
import { getMyData, addStaff, getStaff, updateStaffRole, deleteStaff } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticateToken, getMyData);
router.post('/staff', authenticateToken, addStaff);
router.get('/staff', authenticateToken, getStaff);
router.put('/staff/:id/role', authenticateToken, updateStaffRole);
router.delete('/staff/:id', authenticateToken, deleteStaff);

export default router;
