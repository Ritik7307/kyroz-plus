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
