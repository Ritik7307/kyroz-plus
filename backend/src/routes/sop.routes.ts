import { Router } from 'express';
import { createSop, getSops, updateSop, deleteSop } from '../controllers/sop.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all SOP routes

router.post('/', createSop);
router.get('/', getSops);
router.put('/:id', updateSop);
router.delete('/:id', deleteSop);

export default router;
