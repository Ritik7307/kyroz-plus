import { Router } from 'express';
import { getPrinters, printJob } from '../controllers/printer.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Discover available printers
router.get('/', protect, getPrinters);

// Send a print job
router.post('/', protect, printJob);

export default router;
