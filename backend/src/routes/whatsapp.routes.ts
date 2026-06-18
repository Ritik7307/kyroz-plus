import { Router, Response, NextFunction } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import MarketingSettings from '../models/MarketingSettings';
import User from '../models/User';
import { sendMarketingWhatsApp } from '../services/whatsapp.service';

const router = Router();

// Middleware to restrict access to Scale users or Admin
const isEliteOrAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'admin') {
      next();
      return;
    }
    if (req.user?.userId) {
      const dbUser = await User.findById(req.user.userId);
      const plan = dbUser?.subscriptionPlan || dbUser?.plan;
      if (plan === 'Scale' || plan === 'Elite') {
        next();
        return;
      }
    }
    res.status(403).json({ error: 'This feature is available for Scale plan users only.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error checking plan.' });
  }
};

// Apply auth and plan check middleware to all routes
router.use(authenticateToken);
router.use(isEliteOrAdmin);

// POST /api/whatsapp/connect - Global Connect
router.post('/connect', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    let settings = await MarketingSettings.findOne({ userId });
    
    if (!settings) {
      settings = await MarketingSettings.create({ userId });
    }

    const globalPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const globalAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!globalPhoneNumberId || !globalAccessToken) {
      res.status(400).json({ error: 'Meta Cloud API keys are not configured on the server. Please contact support or update your .env file.' });
      return;
    }

    settings.whatsappConnected = true;
    settings.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || 'connected_account';
    settings.phoneNumberId = globalPhoneNumberId;
    // We do not save the global token to the user document for security reasons, it's used from .env
    settings.accessToken = 'hidden_system_token'; 
    
    // Use actual user details if available
    const user = await User.findById(userId);
    settings.businessName = user?.shopName || user?.name || 'My Restaurant';
    settings.businessPhone = user?.phone || '+91 00000 00000';
    
    settings.lastSynced = new Date();
    
    await settings.save();
    
    res.status(200).json({ message: 'WhatsApp Business successfully connected!', settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect WhatsApp' });
  }
});

// POST /api/whatsapp/disconnect
router.post('/disconnect', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    await MarketingSettings.findOneAndUpdate(
      { userId },
      { 
        whatsappConnected: false, 
        businessAccountId: null, 
        phoneNumberId: null, 
        accessToken: null,
        businessName: null,
        businessPhone: null
      }
    );
    res.status(200).json({ message: 'WhatsApp disconnected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect WhatsApp' });
  }
});

// GET /api/whatsapp/status
router.get('/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    let settings = await MarketingSettings.findOne({ userId });
    if (!settings) {
      settings = await MarketingSettings.create({ userId });
    }
    
    // Mock analytics
    const analytics = {
      messagesSent: Math.floor(Math.random() * 5000),
      messagesDelivered: Math.floor(Math.random() * 4800),
      readRate: 85,
      responseRate: 12,
      campaignSuccessRate: 92,
      trendData: [
        { name: 'Mon', success: 80 },
        { name: 'Tue', success: 85 },
        { name: 'Wed', success: 90 },
        { name: 'Thu', success: 88 },
        { name: 'Fri', success: 95 },
        { name: 'Sat', success: 92 },
        { name: 'Sun', success: 96 }
      ]
    };

    res.status(200).json({ settings, analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// PUT /api/whatsapp/settings
router.put('/settings', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { automationSettings } = req.body;
    
    const settings = await MarketingSettings.findOneAndUpdate(
      { userId },
      { $set: { automationSettings } },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: 'Automation settings updated', settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// PUT /api/whatsapp/update-phone
router.put('/update-phone', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { businessPhone } = req.body;
    
    const settings = await MarketingSettings.findOneAndUpdate(
      { userId },
      { $set: { businessPhone } },
      { new: true }
    );
    
    res.status(200).json({ message: 'Phone number updated', settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update phone number' });
  }
});

// POST /api/whatsapp/send - Manual Send via marketing page
router.post('/send', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phones, message } = req.body;
    const userId = req.user?.userId;
    const settings = await MarketingSettings.findOne({ userId });

    if (!settings?.whatsappConnected) {
      res.status(400).json({ error: 'WhatsApp Provider settings are not configured. Please connect WhatsApp first.' });
      return;
    }

    if (!phones || !Array.isArray(phones) || phones.length === 0) {
      res.status(400).json({ error: 'No phone numbers provided.' });
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // Send messages sequentially to respect rate limits
    for (const phone of phones) {
      const result = await sendMarketingWhatsApp(phone, message);
      if (result?.success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    res.status(200).json({ 
      message: `Successfully sent ${successCount} messages. Failed: ${failCount}`,
      stats: { success: successCount, failed: failCount }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send WhatsApp messages' });
  }
});

export default router;
