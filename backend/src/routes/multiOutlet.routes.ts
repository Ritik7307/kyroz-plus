import express from 'express';
import { authenticateToken, requirePlan } from '../middleware/auth.middleware';
import { createOutlet, getOutletMenu, syncMenuToOutlet } from '../controllers/multiOutlet.controller';

const router = express.Router();

router.use(authenticateToken);
// Multi-Outlet features should be restricted to 'Scale' or 'Admin' plans
router.use(requirePlan('Scale'));

router.post('/create', createOutlet);
router.get('/:outletId/menu', getOutletMenu);
router.post('/:outletId/menu/sync', syncMenuToOutlet);

export default router;
