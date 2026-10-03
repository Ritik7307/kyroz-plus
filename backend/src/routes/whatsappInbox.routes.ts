import { Router, Response } from 'express';
import WhatsappConversation from '../models/WhatsappConversation';
import WhatsappMessage from '../models/WhatsappMessage';
import WhatsappTemplate from '../models/WhatsappTemplate';
import { sendWhatsAppMessage } from '../controllers/whatsappWebhook.controller';
import User from '../models/User';
import Customer from '../models/Customer';
import { authenticateToken, isAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken, isAdmin);

const DEFAULT_TEMPLATES = [
  {
    name: 'Welcome',
    category: 'onboarding',
    language: 'en',
    body: 'Namaste {{name}}! Welcome to KYROZ-PLUS. Your kitchen ops assistant is ready. Reply HELP anytime if you need support.'
  },
  {
    name: 'Support Follow-up',
    category: 'support',
    language: 'en',
    body: 'Hi {{name}}, we received your message. Our team is reviewing it and will get back shortly.'
  },
  {
    name: 'Broadcast Offer',
    category: 'marketing',
    language: 'en',
    body: 'Hello {{name}}! New KYROZ-PLUS update is live. Check your dashboard for the latest kitchen tools.'
  },
  {
    name: 'Hindi Greeting',
    category: 'utility',
    language: 'hi',
    body: 'नमस्ते {{name}}! KYROZ-PLUS में आपका स्वागत है। मदद के लिए HELP लिखें।'
  },
  {
    name: 'Meta Approved Partnership',
    category: 'utility',
    language: 'en',
    body: 'Hello! We are excited to partner with {{restaurantName}}. Your KYROZ-PLUS platform access is ready.'
  }
];

// GET all active conversations
router.get('/conversations', async (req: AuthRequest, res: Response) => {
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
router.get('/conversations/:id/messages', async (req: AuthRequest, res: Response) => {
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
router.post('/messages/send', async (req: AuthRequest, res: Response): Promise<void> => {
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
router.post('/messages/send-all', async (req: AuthRequest, res: Response): Promise<void> => {
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

// POST import contacts from CSV
router.post('/broadcast', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, conversationIds } = req.body;
    if (!text || !String(text).trim()) {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const query = Array.isArray(conversationIds) && conversationIds.length > 0
      ? { _id: { $in: conversationIds } }
      : {};
    const conversations = await WhatsappConversation.find(query);

    let sent = 0;
    for (const conv of conversations) {
      await sendWhatsAppMessage(conv.phone, text, true);
      sent += 1;
    }

    res.status(200).json({ message: `Broadcast sent to ${sent} contacts`, count: sent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send broadcast' });
  }
});

// POST send broadcast from CSV with variables
router.post('/broadcast-csv', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { templateText, contacts } = req.body;
    
    if (!templateText || !Array.isArray(contacts) || contacts.length === 0) {
      res.status(400).json({ error: 'Template text and contacts array are required' });
      return;
    }

    let sent = 0;
    for (const contact of contacts) {
      if (!contact.phone) continue;
      
      const cleanPhone = contact.phone.toString().replace(/[^0-9]/g, '');
      if (!cleanPhone) continue;

      // Replace variables in template
      let message = templateText;
      for (const [key, value] of Object.entries(contact)) {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value || ''));
      }

      await sendWhatsAppMessage(cleanPhone, message, true);
      
      // Upsert conversation to keep history
      await WhatsappConversation.findOneAndUpdate(
        { phone: cleanPhone },
        { 
          $setOnInsert: { 
            name: contact.restaurantName || 'CSV Contact',
            lastMessageAt: new Date(), 
            status: 'active'
          }
        },
        { upsert: true }
      );
      
      sent += 1;
    }

    res.status(200).json({ message: `CSV Broadcast sent to ${sent} contacts`, count: sent });
  } catch (error) {
    console.error('CSV Broadcast error:', error);
    res.status(500).json({ error: 'Failed to send CSV broadcast' });
  }
});

router.get('/templates', async (_req: AuthRequest, res: Response) => {
  try {
    let templates = await WhatsappTemplate.find().sort({ updatedAt: -1 }).lean();
    if (templates.length === 0) {
      await WhatsappTemplate.insertMany(DEFAULT_TEMPLATES);
      templates = await WhatsappTemplate.find().sort({ updatedAt: -1 }).lean();
    }
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.post('/templates', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, body, category = 'utility', language = 'en' } = req.body;
    if (!name || !body) {
      res.status(400).json({ error: 'Name and body are required' });
      return;
    }
    const template = await WhatsappTemplate.create({ name, body, category, language });
    res.status(201).json(template);
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(409).json({ error: 'A template with this name already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.put('/templates/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, body, category, language } = req.body;
    const template = await WhatsappTemplate.findByIdAndUpdate(
      req.params.id,
      { name, body, category, language },
      { new: true, runValidators: true }
    );
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
});

router.delete('/templates/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const template = await WhatsappTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.status(200).json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

router.post('/import-contacts', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { contacts } = req.body;
    if (!contacts || !Array.isArray(contacts)) {
      res.status(400).json({ error: 'Invalid contacts format' });
      return;
    }

    let importedCount = 0;
    for (const contact of contacts) {
      if (contact.phone) {
        // Clean phone
        const cleanPhone = contact.phone.toString().replace(/[^0-9]/g, '');
        if (cleanPhone) {
          await WhatsappConversation.findOneAndUpdate(
            { phone: cleanPhone },
            { 
              $setOnInsert: { 
                name: contact.name || 'Imported User',
                lastMessageAt: new Date(), 
                status: 'active'
              }
            },
            { upsert: true }
          );
          importedCount++;
        }
      }
    }
    
    res.status(200).json({ message: `Successfully imported ${importedCount} contacts`, count: importedCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import contacts' });
  }
});

export default router;
