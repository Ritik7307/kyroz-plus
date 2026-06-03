import { Router, Response, NextFunction } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import MarketingSettings from '../models/MarketingSettings';
import User from '../models/User';

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

// POST /api/whatsapp/connect - Mock OAuth Connection
router.post('/connect', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    let settings = await MarketingSettings.findOne({ userId });
    
    if (!settings) {
      settings = await MarketingSettings.create({ userId });
    }

    // Mock successful connection with Meta Cloud API details
    settings.whatsappConnected = true;
    settings.businessAccountId = 'mock_biz_acc_' + Math.floor(Math.random() * 1000000);
    settings.phoneNumberId = 'mock_phone_id_' + Math.floor(Math.random() * 1000000);
    settings.accessToken = 'mock_access_token_EAAG...';
    
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

    // Mock send logic
    console.log(`Sending WhatsApp via Meta Cloud API to ${phones.length} users: ${message}`);
    
    res.status(200).json({ message: `Message successfully queued for ${phones.length} customers!` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send WhatsApp messages' });
  }
});

export default router;
