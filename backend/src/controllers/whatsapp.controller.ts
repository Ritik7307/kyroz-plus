import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import MarketingSettings from '../models/MarketingSettings';
import User from '../models/User';

export const linkWhatsApp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { facebook_access_token } = req.body;
    const userId = req.user?.userId;

    if (!facebook_access_token) {
      res.status(400).json({ error: 'Missing facebook_access_token' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch businesses associated with the user
    const businessResponse = await fetch(`https://graph.facebook.com/v19.0/me/businesses?access_token=${facebook_access_token}`);
    const businessData = await businessResponse.json();

    if (!businessResponse.ok || !businessData.data || businessData.data.length === 0) {
      res.status(400).json({ error: 'Could not fetch Facebook Businesses.', details: businessData });
      return;
    }

    // Usually, we pick the first business, or you might need logic to let them select
    const businessId = businessData.data[0].id;

    // 2. Fetch WhatsApp Business Accounts (WABA)
    const wabaResponse = await fetch(`https://graph.facebook.com/v19.0/${businessId}/owned_whatsapp_business_accounts?access_token=${facebook_access_token}`);
    const wabaData = await wabaResponse.json();

    if (!wabaResponse.ok || !wabaData.data || wabaData.data.length === 0) {
      res.status(400).json({ error: 'Could not fetch WhatsApp Business Accounts.', details: wabaData });
      return;
    }

    const wabaId = wabaData.data[0].id;

    // 3. Fetch Phone Numbers attached to the WABA
    const phoneResponse = await fetch(`https://graph.facebook.com/v19.0/${wabaId}/phone_numbers?access_token=${facebook_access_token}`);
    const phoneData = await phoneResponse.json();

    if (!phoneResponse.ok || !phoneData.data || phoneData.data.length === 0) {
      res.status(400).json({ error: 'Could not fetch WhatsApp Phone Numbers.', details: phoneData });
      return;
    }

    const phoneNumberData = phoneData.data[0];
    const phoneNumberId = phoneNumberData.id;
    const displayName = phoneNumberData.display_phone_number || 'Connected WhatsApp';

    // 4. Save to MarketingSettings Model
    let settings = await MarketingSettings.findOne({ userId });
    if (!settings) {
      settings = await MarketingSettings.create({ userId });
    }

    settings.whatsappConnected = true;
    settings.businessAccountId = wabaId;
    settings.phoneNumberId = phoneNumberId;
    settings.accessToken = facebook_access_token;
    settings.businessPhone = displayName;
    settings.lastSynced = new Date();

    await settings.save();

    // Also update User model for basic reference
    await User.findByIdAndUpdate(userId, {
      whatsappConnected: true,
      whatsappCredentials: {
        wabaId,
        phoneNumberId,
        accessToken: facebook_access_token,
      },
    });

    res.status(200).json({
      message: 'WhatsApp connected successfully',
      wabaId,
      phoneNumberId,
      displayName
    });
  } catch (error: any) {
    console.error('Error linking WhatsApp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
