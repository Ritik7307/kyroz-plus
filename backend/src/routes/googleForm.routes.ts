import { Router } from 'express';
import { handleGoogleFormWebhook } from '../controllers/googleForm.controller';

const router = Router();

router.post('/webhook', handleGoogleFormWebhook);

export default router;
