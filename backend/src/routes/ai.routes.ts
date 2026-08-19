import { Router } from 'express';
import multer from 'multer';
import { 
  chatWithKosa, 
  uploadSopFile, 
  getKosaStarters, 
  transcribeVoice, 
  speakWithKosa 
} from '../controllers/ai.controller';
import { authenticateToken, requirePlan } from '../middleware/auth.middleware';

const router = Router();

// Configure multer to store files in memory so we can pass the buffer to pdf-parse/mammoth directly
const upload = multer({ storage: multer.memoryStorage() });

router.post('/chat', authenticateToken, requirePlan('Growth', 'Scale'), chatWithKosa);
router.post('/upload-sop', authenticateToken, requirePlan('Growth', 'Scale'), upload.single('file'), uploadSopFile);
router.post('/transcribe', authenticateToken, requirePlan('Growth', 'Scale'), upload.single('audio'), transcribeVoice);
router.post('/speak', authenticateToken, requirePlan('Growth', 'Scale'), speakWithKosa);
router.get('/starters', authenticateToken, requirePlan('Growth', 'Scale'), getKosaStarters);

export default router;
