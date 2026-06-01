import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const adminNumber = 'whatsapp:+917307255940';

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
