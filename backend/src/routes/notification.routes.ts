import { Router } from 'express';
import { getNotifications, markAsRead, clearAllNotifications } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken as any, getNotifications as any);
router.put('/clear-all', authenticateToken as any, clearAllNotifications as any);
router.put('/:id/read', authenticateToken as any, markAsRead as any);

export default router;
