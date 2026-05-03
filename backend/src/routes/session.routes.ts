import { Router } from 'express';
import { getActiveSessions, deleteSession } from '../controllers/session.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all session routes

router.get('/', getActiveSessions);
router.delete('/:id', deleteSession);

export default router;
