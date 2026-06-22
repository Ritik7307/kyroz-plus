import { Router } from 'express';
import { verifyWebhook, handleIncomingMessage } from '../controllers/whatsappWebhook.controller';

const router = Router();

// Used by Meta to verify the webhook connection initially
router.get('/', verifyWebhook);

// Used by Meta to send incoming messages (push notifications)
router.post('/', handleIncomingMessage);

export default router;
