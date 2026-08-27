import { Router } from 'express';
import { getPrinters, printJob } from '../controllers/printer.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Discover available printers
router.get('/', authenticateToken, getPrinters);

// Send a print job
router.post('/', authenticateToken, printJob);

export default router;
