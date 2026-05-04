import { Router } from 'express';
import { 
  createMasterSop, 
  getMasterSops, 
  updateMasterSop, 
  deleteMasterSop 
} from '../controllers/masterSop.controller';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getMasterSops);
router.post('/', isAdmin, createMasterSop);
router.put('/:id', isAdmin, updateMasterSop);
router.delete('/:id', isAdmin, deleteMasterSop);

export default router;
