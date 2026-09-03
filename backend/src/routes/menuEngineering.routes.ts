import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getClassification, getSimulation } from '../controllers/menuEngineering.controller';

const router = express.Router();

router.use(authenticateToken);

router.get('/classification', getClassification);
router.post('/simulation', getSimulation);

export default router;
