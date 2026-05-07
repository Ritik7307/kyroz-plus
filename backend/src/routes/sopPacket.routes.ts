import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';
import { 
  createSopPacket, 
  getSopPackets, 
  updateSopPacket, 
  deleteSopPacket 
} from '../controllers/sopPacket.controller';

const router = Router();

router.get('/', authenticateToken, getSopPackets);
router.post('/', authenticateToken, isAdmin, createSopPacket);
router.put('/:id', authenticateToken, isAdmin, updateSopPacket);
router.delete('/:id', authenticateToken, isAdmin, deleteSopPacket);

export default router;
