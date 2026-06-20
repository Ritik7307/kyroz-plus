import { Router, Response, NextFunction } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import Order from '../models/Order';
import MarketingSettings from '../models/MarketingSettings';
import User from '../models/User';
import mongoose from 'mongoose';
import { sendMarketingWhatsApp } from '../services/whatsapp.service';

const router = Router();

// Middleware to restrict access to Scale users or Admin
const isEliteOrAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'admin') {
      next();
      return;
    }
    
    // Check DB for latest plan just in case token is stale
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

// GET /api/marketing/settings - Retrieve marketing settings
router.get('/settings', authenticateToken, isEliteOrAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    let settings = await MarketingSettings.findOne({ userId });
    
    if (!settings) {
      settings = await MarketingSettings.create({ userId });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching marketing settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/marketing/settings - Update marketing settings
router.put('/settings', authenticateToken, isEliteOrAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { vipThreshold, highSpendingThreshold, waProvider, waApiKey, waInstanceId, waAccessToken } = req.body;
    
    const settings = await MarketingSettings.findOneAndUpdate(
      { userId },
      { 
        vipThreshold, 
        highSpendingThreshold, 
        waProvider, 
        waApiKey, 
        waInstanceId, 
        waAccessToken 
      },
      { new: true, upsert: true }
    );
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating marketing settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// GET /api/marketing/crm - Retrieve CRM Data (Customer Segments)
router.get('/crm', authenticateToken, isEliteOrAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    // Fetch user settings for thresholds
    let settings = await MarketingSettings.findOne({ userId });
    if (!settings) {
      settings = { vipThreshold: 5000, highSpendingThreshold: 1000 } as any;
    }

    // Aggregate Orders by customerPhone (only where customerPhone exists)
    const customersAgg = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), customerPhone: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$customerPhone",
          name: { $last: "$customerName" }, // Keep the most recent name
          totalVisits: { $sum: 1 },
          totalSpend: { $sum: "$totalRevenue" },
          firstVisitDate: { $min: "$createdAt" },
          lastVisitDate: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          _id: 0,
          phone: "$_id",
          name: 1,
          totalVisits: 1,
          totalSpend: 1,
          firstVisitDate: 1,
          lastVisitDate: 1,
          avgBillValue: { $divide: ["$totalSpend", "$totalVisits"] }
        }
      }
    ]);

    // Calculate segments in memory
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const crmData = customersAgg.map(c => {
      const isVIP = c.totalSpend > (settings?.vipThreshold || 5000);
      const isFrequent = c.totalVisits >= 5;
      const isLost = new Date(c.lastVisitDate) < thirtyDaysAgo;
      const isNew = new Date(c.firstVisitDate) >= thirtyDaysAgo;
      const isHighSpending = c.avgBillValue > (settings?.highSpendingThreshold || 1000);

      const segments = [];
      if (isVIP) segments.push('VIP');
      if (isFrequent) segments.push('Frequent');
      if (isLost) segments.push('Lost');
      if (isNew) segments.push('New');
      if (isHighSpending) segments.push('High Spending');

      return {
        ...c,
        segments
      };
    });

    res.json(crmData);
  } catch (error) {
    console.error('Error fetching CRM data:', error);
    res.status(500).json({ error: 'Failed to fetch CRM data' });
  }
});

// POST /api/marketing/send-whatsapp - Send bulk WhatsApp messages
router.post('/send-whatsapp', authenticateToken, isEliteOrAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { phones, message, imageUrl } = req.body;

    if (!phones || !Array.isArray(phones) || phones.length === 0) {
      return res.status(400).json({ error: 'No phone numbers provided.' });
    }
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const settings = await MarketingSettings.findOne({ userId });
    if (!settings || (!settings.whatsappConnected && !settings.waProvider)) {
      return res.status(400).json({ error: 'WhatsApp is not connected. Please connect it in the Engine Settings.' });
    }

    let successCount = 0;
    let failedCount = 0;
    let lastError = '';

    const credentials = {
      phoneNumberId: settings.phoneNumberId,
      accessToken: settings.accessToken
    };

    for (const phone of phones) {
      const result = await sendMarketingWhatsApp(phone, message, imageUrl, credentials);
      if (result?.success) {
        successCount++;
      } else {
        failedCount++;
        if (result?.error) lastError = result.error;
      }
    }

    const errorMessageAppend = lastError ? ` (Reason: ${lastError})` : '';
    res.json({ success: true, message: `Successfully queued ${successCount} messages. Failed: ${failedCount}${errorMessageAppend}` });
  } catch (error) {
    console.error('Error sending WhatsApp messages:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp messages' });
  }
});

export default router;
