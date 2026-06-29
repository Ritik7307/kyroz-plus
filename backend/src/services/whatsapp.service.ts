import twilio from 'twilio';
import axios from 'axios';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER || 'whatsapp:+917887009800';

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

export const sendManualStockRequest = async (dishName: string, currentPackets: number) => {
  const message = `Hello Admin, 

This is a polite request from the Kitchen Team. 
We are currently running low on *${dishName}*. 

Current stock: ${currentPackets} packets.
Could you please look into restocking this item when possible? 

Thank you!
_Kyyroz-Plus System_`;

  return sendWhatsAppMessage(message);
};

export const sendLowStockAlert = async (dishName: string, remainingPackets: number) => {
  const message = `⚠️ *KYYROZ-PLUS LOW STOCK ALERT*\n\nItem: ${dishName}\nRemaining Stock: ${remainingPackets} packets\n\nPlease restock soon!`;

  return sendWhatsAppMessage(message);
};

export const sendWhatsAppMessage = async (message: string) => {
  if (!client) {
    console.log('Twilio not configured. Message:', message);
    return;
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioNumber}`,
      to: adminNumber
    });
    console.log('WhatsApp message sent:', response.sid);
    return response;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    throw error;
  }
};

export const sendCustomerFeedbackWhatsApp = async (phone: string, customerName: string, shopName: string) => {
  if (!client) {
    console.log(`[Twilio Mock] Feedback message would be sent to ${phone}:`);
    console.log(`Hello ${customerName || 'there'}! Thank you for dining with us at ${shopName}. We'd love your feedback! Please click here: https://yourdomain.com/feedback`);
    return;
  }

  try {
    // Basic phone formatting to add + if missing (assuming India +91 as default if 10 digits)
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;
    if (!formattedPhone.startsWith('+')) formattedPhone = `+${formattedPhone}`;

    const message = `Hello ${customerName || 'there'}! 🍽️\n\nThank you for dining with us at ${shopName}.\nWe hope you enjoyed your meal!\n\nPlease take a minute to share your feedback with us: https://forms.gle/kyroz-feedback-form\n\nHope to see you again soon!`;

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioNumber}`,
      to: `whatsapp:${formattedPhone}`
    });
    console.log(`[WhatsApp] Feedback message sent to ${formattedPhone}. SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error(`[WhatsApp] Failed to send feedback message to ${phone}:`, error);
  }
};

/**
 * Sends a Marketing WhatsApp message using the Meta WhatsApp Cloud API.
 * Uses the user's specific credentials if provided, falling back to global .env.
 */
export const sendMarketingWhatsApp = async (
  phone: string, 
  messageText: string, 
  imageUrl?: string,
  credentials?: { phoneNumberId?: string; accessToken?: string }
) => {
  const phoneNumberId = (credentials?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '').replace(/"/g, '');
  const accessToken = (credentials?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '').replace(/"/g, '');

  if (!phoneNumberId || !accessToken) {
    console.warn('[WhatsApp] Meta Cloud API credentials not configured. Skipping message.');
    return { success: false, error: 'Credentials not configured' };
  }

  // Format phone number for Meta API (remove all non-digits, ensure country code, no leading +)
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`; // Assume India if 10 digits
  }

  try {
    let payload: any = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template'
    };

    if (imageUrl) {
      payload.template = {
        name: 'kyroz_marketing_blast_image',
        language: { code: 'en' },
        components: [
          {
            type: 'header',
            parameters: [{ type: 'image', image: { link: imageUrl } }]
          },
          {
            type: 'body',
            parameters: [{ type: 'text', text: messageText }]
          }
        ]
      };
    } else {
      payload.template = {
        name: 'kyroz_marketing_blast',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: messageText }]
          }
        ]
      };
    }

    console.log(`\n======================================================`);
    console.log(`[WhatsApp Debug] SENDING MARKETING MESSAGE`);
    console.log(`Target Phone: ${formattedPhone} (Original: ${phone})`);
    console.log(`Token Length: ${accessToken?.length || 0} chars`);
    console.log(`Phone ID: ${phoneNumberId}`);
    console.log(`Payload:`, JSON.stringify(payload, null, 2));
    console.log(`======================================================\n`);

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const data = response.data;

    console.log(`[WhatsApp Debug] SUCCESS! Meta Response:`, JSON.stringify(data));
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error: any) {
    const errorData = error.response?.data || error.message;
    console.error(`\n[WhatsApp Debug] EXCEPTION sending to ${phone}:`, JSON.stringify(errorData, null, 2));
    return { success: false, error: errorData?.error?.message || error.message };
  }
};

/**
 * Sends an automated Order Confirmation message.
 */
export const sendAutomatedOrderConfirmation = async (
  phone: string, 
  orderId: string, 
  shopName: string, 
  credentials?: { phoneNumberId?: string; accessToken?: string }
) => {
  const messageText = `Hello! 👋\n\nYour order *#${orderId}* has been confirmed.\n\nThank you for choosing ${shopName || 'our restaurant'}! We are preparing your order.`;
  return sendMarketingWhatsApp(phone, messageText, undefined, credentials);
};

/**
 * Sends an automated Order Ready message.
 */
export const sendAutomatedOrderReady = async (
  phone: string, 
  orderId: string, 
  shopName: string, 
  credentials?: { phoneNumberId?: string; accessToken?: string }
) => {
  const messageText = `Great news! 🍽️\n\nYour order *#${orderId}* is now Ready!\n\nThank you for dining with ${shopName || 'us'}!`;
  return sendMarketingWhatsApp(phone, messageText, undefined, credentials);
};
