import { Router, Response } from 'express';
import WhatsappConversation from '../models/WhatsappConversation';
import WhatsappMessage from '../models/WhatsappMessage';
import WhatsappTemplate from '../models/WhatsappTemplate';
import { sendWhatsAppMessage, uploadWhatsAppMedia, sendWhatsAppDocument, sendWhatsAppTemplateMessage } from '../controllers/whatsappWebhook.controller';
import axios from 'axios';
import User from '../models/User';
import Customer from '../models/Customer';
import { authenticateToken, isAdmin, AuthRequest } from '../middleware/auth.middleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

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
    
    // Send message via Meta
    const result = await sendWhatsAppMessage(conversation.phone, text, true);
    if (!result.success) {
      res.status(400).json({ error: result.error || 'Failed to send message' });
      return;
    }
    
    res.status(200).json({ message: 'Message sent successfully', messageId: result.messageId });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
});

// POST send a media message
router.post('/messages/send-media', upload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, text } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'File is required' });
      return;
    }

    const conversation = await WhatsappConversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    // Upload to Meta
    const mediaId = await uploadWhatsAppMedia(file.buffer, file.mimetype, file.originalname);
    if (!mediaId) {
      res.status(500).json({ error: 'Failed to upload media to WhatsApp' });
      return;
    }

    // Send the document
    const sendResult = await sendWhatsAppDocument(conversation.phone, mediaId, text || '', file.originalname);
    if (!sendResult.success) {
      res.status(400).json({ error: sendResult.error || 'Failed to send media via WhatsApp' });
      return;
    }

    // Note: Log the message to the DB only when Meta accepts it
    let msgText = text ? `[Media: ${file.originalname}]\n${text}` : `[Media: ${file.originalname}]`;
    const msg = await WhatsappMessage.create({
      conversationId: conversation._id,
      messageId: sendResult.messageId || ('outbound_media_' + Date.now()),
      sender: 'admin',
      direction: 'outbound',
      type: 'document',
      text: msgText,
      status: 'sent',
      timestamp: new Date()
    });

    // Update conversation snippet
    await WhatsappConversation.findByIdAndUpdate(conversation._id, {
      $set: { 
        lastMessageAt: new Date(), 
        lastMessagePreview: msgText.substring(0, 50) + (msgText.length > 50 ? '...' : '') 
      }
    });

    res.status(200).json({ message: 'Media sent successfully', data: msg });
  } catch (error: any) {
    console.error('Send media error:', error);
    res.status(500).json({ error: error.message || 'Failed to send media' });
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

// GET live approved message templates from Meta Graph API
router.get('/meta-templates', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wabaId = (process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '').replace(/"/g, '').trim();
    const token = (process.env.WHATSAPP_ACCESS_TOKEN || '').replace(/"/g, '').trim();

    if (!wabaId || !token) {
      res.status(400).json({ 
        error: 'Meta WhatsApp credentials (WHATSAPP_BUSINESS_ACCOUNT_ID or WHATSAPP_ACCESS_TOKEN) are not configured in environment.' 
      });
      return;
    }

    const response = await axios.get(
      `https://graph.facebook.com/v20.0/${wabaId}/message_templates`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 100
        }
      }
    );

    const rawTemplates = response.data?.data || [];
    
    // Strictly filter for APPROVED Meta templates
    const approvedTemplates = rawTemplates.filter((t: any) => t.status === 'APPROVED');
    
    // Parse and structure templates
    const templates = approvedTemplates.map((t: any) => {
      const components = Array.isArray(t.components) ? t.components : [];
      const bodyComp = components.find((c: any) => c.type === 'BODY');
      const headerComp = components.find((c: any) => c.type === 'HEADER');
      const footerComp = components.find((c: any) => c.type === 'FOOTER');
      const buttonsComp = components.find((c: any) => c.type === 'BUTTONS');

      const bodyText = bodyComp?.text || '';
      
      // Extract variables in body, e.g. {{1}}, {{2}}
      const varMatches = bodyText.match(/\{\{(\d+)\}\}/g) || [];
      const uniqueVars = Array.from(new Set(varMatches.map((m: string) => m.replace(/[{}]/g, ''))))
        .sort((a, b) => Number(a) - Number(b));

      return {
        id: t.id,
        name: t.name,
        status: t.status, // APPROVED
        category: t.category, // MARKETING, UTILITY, etc.
        language: t.language, // en, en_US, hi, etc.
        body: bodyText,
        header: headerComp?.text || (headerComp?.format ? `[${headerComp.format}]` : ''),
        footer: footerComp?.text || '',
        buttons: buttonsComp?.buttons || [],
        variables: uniqueVars,
        components
      };
    });

    templates.sort((a: any, b: any) => a.name.localeCompare(b.name));

    res.status(200).json(templates);
  } catch (error: any) {
    const errData = error.response?.data || error.message;
    console.error('Failed to fetch Meta message templates:', errData);
    res.status(500).json({ 
      error: 'Failed to fetch templates from Meta Graph API',
      details: errData 
    });
  }
});

// POST send a Meta template message to a single conversation
router.post('/messages/send-template', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, phone, templateName, languageCode = 'en', bodyParameters = [], renderedText } = req.body;

    let targetPhone = phone;
    let conv;
    if (conversationId) {
      conv = await WhatsappConversation.findById(conversationId);
      if (!conv) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }
      targetPhone = conv.phone;
    }

    if (!targetPhone) {
      res.status(400).json({ error: 'Phone number or conversationId is required' });
      return;
    }

    if (!templateName) {
      res.status(400).json({ error: 'Template name is required' });
      return;
    }

    const result = await sendWhatsAppTemplateMessage({
      toPhone: targetPhone,
      templateName,
      languageCode,
      bodyParameters,
      renderedText,
      isAdminManualReply: true
    });

    if (!result.success) {
      res.status(400).json({ error: result.error || 'Failed to send template message' });
      return;
    }

    res.status(200).json({ 
      message: 'Template message sent successfully', 
      messageId: result.messageId 
    });
  } catch (error: any) {
    console.error('Send template error:', error);
    res.status(500).json({ error: 'Failed to send template message' });
  }
});

// POST broadcast a Meta template message
router.post('/broadcast-template', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      templateName, 
      languageCode = 'en', 
      templateBody = '', 
      variableMapping = {}, 
      contacts, 
      conversationIds 
    } = req.body;

    if (!templateName) {
      res.status(400).json({ error: 'Template name is required' });
      return;
    }

    let targetContacts: Array<{ phone: string; [key: string]: any }> = [];

    if (Array.isArray(contacts) && contacts.length > 0) {
      targetContacts = contacts.filter((c: any) => c && c.phone);
    } else {
      const query = Array.isArray(conversationIds) && conversationIds.length > 0
        ? { _id: { $in: conversationIds } }
        : {};
      const convs = await WhatsappConversation.find(query).lean();
      targetContacts = convs.map((c) => ({
        phone: c.phone,
        name: c.name,
        restaurantName: c.name
      }));
    }

    if (targetContacts.length === 0) {
      res.status(400).json({ error: 'No recipients found to broadcast to' });
      return;
    }

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // Extract sorted variable numbers, e.g. ["1", "2"]
    const varNumbers = Object.keys(variableMapping).sort((a, b) => Number(a) - Number(b));

    for (const contact of targetContacts) {
      const cleanPhone = String(contact.phone || '').replace(/[^0-9]/g, '');
      if (!cleanPhone) continue;

      // Map parameters for this contact
      const bodyParams: string[] = [];
      let renderedText = templateBody;

      for (const varNum of varNumbers) {
        const fieldKey = variableMapping[varNum];
        let val = '';
        if (fieldKey && contact[fieldKey] !== undefined) {
          val = String(contact[fieldKey] || '');
        } else if (fieldKey) {
          val = String(fieldKey); // static fallback value
        }
        bodyParams.push(val);
        renderedText = renderedText.replace(new RegExp(`\\{\\{${varNum}\\}\\}`, 'g'), val);
      }

      const sendRes = await sendWhatsAppTemplateMessage({
        toPhone: cleanPhone,
        templateName,
        languageCode,
        bodyParameters: bodyParams,
        renderedText,
        isAdminManualReply: true
      });

      if (sendRes.success) {
        successCount++;
      } else {
        failCount++;
        if (errors.length < 5 && sendRes.error) {
          errors.push(`${cleanPhone}: ${sendRes.error}`);
        }
      }

      // Small delay to prevent Meta rate spike
      if (targetContacts.length > 1) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    res.status(200).json({
      message: `Template broadcast completed: ${successCount} sent, ${failCount} failed`,
      sent: successCount,
      failed: failCount,
      errors: errors.slice(0, 5)
    });
  } catch (error: any) {
    console.error('Broadcast template error:', error);
    res.status(500).json({ error: 'Failed to broadcast template' });
  }
});

export default router;
