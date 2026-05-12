import { Router } from 'express';
import multer from 'multer';
import { 
  chatWithKosa, 
  uploadSopFile, 
  getKosaStarters, 
  transcribeVoice, 
  speakWithKosa 
} from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Configure multer to store files in memory so we can pass the buffer to pdf-parse/mammoth directly
const upload = multer({ storage: multer.memoryStorage() });

router.post('/chat', authenticateToken, chatWithKosa);
router.post('/upload-sop', authenticateToken, upload.single('file'), uploadSopFile);
router.post('/transcribe', authenticateToken, upload.single('audio'), transcribeVoice);
router.post('/speak', authenticateToken, speakWithKosa);
router.get('/starters', authenticateToken, getKosaStarters);

export default router;
