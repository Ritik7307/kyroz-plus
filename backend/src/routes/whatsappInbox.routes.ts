import { Router, Request, Response } from 'express';
import WhatsappConversation from '../models/WhatsappConversation';
import WhatsappMessage from '../models/WhatsappMessage';
import { sendWhatsAppMessage } from '../controllers/whatsappWebhook.controller';

const router = Router();

// GET all active conversations
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await WhatsappConversation.find({ status: 'active' }).sort({ lastMessageAt: -1 }).lean();
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET messages for a conversation
router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messages = await WhatsappMessage.find({ conversationId: id }).sort({ timestamp: 1 }).lean();
    // Mark as read
    await WhatsappConversation.findByIdAndUpdate(id, { unreadCount: 0 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST send a manual message
router.post('/messages/send', async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId, text } = req.body;
    const conversation = await WhatsappConversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    
    // We pass true as a third argument to indicate this is an admin manual reply
    // so we can log it correctly as 'admin' in the db
    await sendWhatsAppMessage(conversation.phone, text, true);
    
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
