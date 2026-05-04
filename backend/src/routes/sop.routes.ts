import { Router } from 'express';
import { createSop, getSops, updateSop, deleteSop, syncSops } from '../controllers/sop.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all SOP routes

router.post('/', createSop);
router.get('/', getSops);
router.put('/:id', updateSop);
router.delete('/:id', deleteSop);
router.post('/sync', syncSops);

export default router;
