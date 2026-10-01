import { Router, Request, Response } from 'express';
import WhatsappConversation from '../models/WhatsappConversation';
import WhatsappMessage from '../models/WhatsappMessage';
import { sendWhatsAppMessage } from '../controllers/whatsappWebhook.controller';
import User from '../models/User';
import Customer from '../models/Customer';

const router = Router();

// GET all active conversations
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ phone: { $exists: true, $nin: [null, ''] } }).lean();
    const customers = await Customer.find({ phone: { $exists: true, $nin: [null, ''] } }).lean();
    
    for (const u of [...users, ...customers]) {
      const phone = u.phone as string;
      const name = u.name || (u as any).shopName || 'Unknown User';
      
      await WhatsappConversation.findOneAndUpdate(
        { phone },
        { 
          $setOnInsert: { 
            name,
            lastMessageAt: new Date(0), 
            status: 'active'
          }
        },
        { upsert: true }
      );
    }

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

// POST send to all
router.post('/messages/send-all', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const conversations = await WhatsappConversation.find();
    
    for (const conv of conversations) {
      await sendWhatsAppMessage(conv.phone, text, true);
    }
    
    res.status(200).json({ message: 'Messages sent to all successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send messages to all' });
  }
});

export default router;
