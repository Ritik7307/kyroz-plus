import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { consultAI } from '../controllers/aiConsultant.controller';

const router = express.Router();

router.use(authenticateToken);

router.post('/consult', consultAI);

export default router;
