import { Router } from 'express';
import multer from 'multer';
import { chatWithBusinessAi } from '../controllers/businessAi.controller';
import { transcribeVoice, speakWithKosa, uploadSopFile } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/chat', authenticateToken, chatWithBusinessAi);
router.post('/transcribe', authenticateToken, upload.single('audio'), transcribeVoice);
router.post('/speak', authenticateToken, speakWithKosa);
router.post('/upload-sop', authenticateToken, upload.single('file'), uploadSopFile);

export default router;
