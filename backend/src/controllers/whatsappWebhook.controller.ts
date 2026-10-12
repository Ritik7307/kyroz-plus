import { Request, Response } from 'express';
import axios from 'axios';
import WhatsAppOptOut from '../models/WhatsAppOptOut';
import PurchaseReminder from '../models/PurchaseReminder';
import OnboardingReminder from '../models/OnboardingReminder';
import WhatsappConversation from '../models/WhatsappConversation';
import WhatsappMessage from '../models/WhatsappMessage';
import { getIo } from '../socket';
import mongoose from 'mongoose';

// Get these from env variables (we will add them to .env)
// For now, we fall back to placeholders so the code runs.
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'KYROZ_WA_WEBHOOK_SECRET_123';

// To send messages we need the Access Token and Phone Number ID
// The user has them, we will expect them in env or config
const getAccessToken = () => (process.env.WHATSAPP_ACCESS_TOKEN || '').replace(/"/g, '');
const getPhoneNumberId = () => (process.env.WHATSAPP_PHONE_NUMBER_ID || '').replace(/"/g, '');

const GOOGLE_FORM_LINK = process.env.WHATSAPP_ASSESSMENT_LINK || 'https://docs.google.com/forms/d/e/1FAIpQLSdPdwRKKAgO8LxN1X7YftteBmrdhmbXK0TTUJnk4WIm7wtNxw/viewform?usp=publish-editor';

export const verifyWebhook = (req: Request, res: Response) => {
  console.log("WhatsApp webhook verification request received");
  console.log("Query params:", req.query);

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WhatsApp Webhook verified successfully.');
      res.status(200).send(challenge);
    } else {
      console.log('WhatsApp Webhook verification failed. Token mismatch.');
      res.sendStatus(403);
    }
  } else {
    // If no mode/token, it's a bad request
    res.sendStatus(400);
  }
};

export const formatWhatsAppPhone = (phone: string): string => {
  if (!phone) return '';
  let cleaned = String(phone).trim().replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = `91${cleaned.substring(1)}`;
  }
  return cleaned;
};

export const sendWhatsAppMessage = async (
  toPhone: string,
  text: string,
  isAdminManualReply = false
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const token = getAccessToken();
  const phoneId = getPhoneNumberId();
  if (!token || !phoneId) {
    console.error('WhatsApp token or phone ID missing. Cannot send message.');
    return { success: false, error: 'WhatsApp credentials missing' };
  }

  const formattedPhone = formatWhatsAppPhone(toPhone);

  // Opt-out Check
  try {
    const optOutRecord = await WhatsAppOptOut.findOne({ phone: { $in: [toPhone, formattedPhone] } });
    if (optOutRecord && optOutRecord.optedOut) {
      console.log(`[OPT-OUT] User ${toPhone} has opted out. Skipping message.`);
      return { success: false, error: 'User opted out' };
    }
  } catch (err) {
    console.error('Error checking opt-out status:', err);
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`Sent message to ${formattedPhone}`);
    
    // Log outbound message
    try {
      let conv = await WhatsappConversation.findOneAndUpdate(
        { phone: { $in: [toPhone, formattedPhone] } },
        { 
          $set: { 
            phone: formattedPhone,
            lastMessageAt: new Date(), 
            lastMessagePreview: text.substring(0, 50) + (text.length > 50 ? '...' : '') 
          },
          $setOnInsert: { name: 'Unknown User' }
        },
        { upsert: true, new: true }
      );
      
      const msg = await WhatsappMessage.create({
        conversationId: conv._id,
        messageId: response.data?.messages?.[0]?.id || 'outbound_' + Date.now(),
        sender: isAdminManualReply ? 'admin' : 'system',
        direction: 'outbound',
        type: 'text',
        text,
        status: 'sent',
        timestamp: new Date()
      });
      
      try {
        const io = getIo();
        io.emit('new_whatsapp_message', { conversation: conv, message: msg });
      } catch (e) {}
    } catch(dbErr) {
      console.error('Failed to log outbound message', dbErr);
    }

    return { success: true, messageId: response.data?.messages?.[0]?.id };
  } catch (error: any) {
    const errData = error.response?.data?.error;
    console.error('Error sending WhatsApp message:', errData || error.message);
    if (errData?.code === 131047) {
      return {
        success: false,
        error: 'Customer care window expired (24+ hours since customer messaged). Meta requires an approved template.'
      };
    }
    return {
      success: false,
      error: errData?.message || error.message || 'Failed to send WhatsApp message'
    };
  }
};

export const sendWhatsAppTemplateMessage = async ({
  toPhone,
  templateName,
  languageCode = 'en',
  headerFormat,
  headerMediaId,
  headerMediaUrl,
  headerFilename = 'KYROZ_Brochure.pdf',
  bodyParameters = [],
  renderedText = '',
  isAdminManualReply = false
}: {
  toPhone: string;
  templateName: string;
  languageCode?: string;
  headerFormat?: string;
  headerMediaId?: string;
  headerMediaUrl?: string;
  headerFilename?: string;
  bodyParameters?: string[];
  renderedText?: string;
  isAdminManualReply?: boolean;
}): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const token = getAccessToken();
  const phoneId = getPhoneNumberId();
  if (!token || !phoneId) {
    console.error('WhatsApp token or phone ID missing. Cannot send template message.');
    return { success: false, error: 'WhatsApp credentials missing' };
  }

  let formattedPhone = toPhone.replace(/\D/g, '');
  if (formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`;
  }

  // Opt-out Check
  try {
    const optOutRecord = await WhatsAppOptOut.findOne({ phone: toPhone });
    if (optOutRecord && optOutRecord.optedOut) {
      console.log(`[OPT-OUT] User ${toPhone} has opted out. Skipping template message.`);
      return { success: false, error: 'User opted out' };
    }
  } catch (err) {
    console.error('Error checking opt-out status:', err);
  }

  try {
    const components: any[] = [];

    // Header component handling
    const brochureId = (process.env.WHATSAPP_BROCHURE_MEDIA_ID || '').replace(/"/g, '').trim();
    const effectiveHeaderFormat = (headerFormat || '').toUpperCase();

    // If template requires a DOCUMENT header or is the intro template
    if (effectiveHeaderFormat === 'DOCUMENT' || templateName === 'kyroz_plus_intro') {
      const docId = headerMediaId || brochureId;
      if (docId) {
        components.push({
          type: 'header',
          parameters: [
            {
              type: 'document',
              document: {
                id: docId,
                filename: headerFilename || 'KYROZ_Brochure.pdf'
              }
            }
          ]
        });
      } else if (headerMediaUrl) {
        components.push({
          type: 'header',
          parameters: [
            {
              type: 'document',
              document: {
                link: headerMediaUrl,
                filename: headerFilename || 'KYROZ_Brochure.pdf'
              }
            }
          ]
        });
      }
    } else if (effectiveHeaderFormat === 'IMAGE') {
      if (headerMediaId) {
        components.push({
          type: 'header',
          parameters: [{ type: 'image', image: { id: headerMediaId } }]
        });
      } else if (headerMediaUrl) {
        components.push({
          type: 'header',
          parameters: [{ type: 'image', image: { link: headerMediaUrl } }]
        });
      }
    } else if (effectiveHeaderFormat === 'VIDEO') {
      if (headerMediaId) {
        components.push({
          type: 'header',
          parameters: [{ type: 'video', video: { id: headerMediaId } }]
        });
      } else if (headerMediaUrl) {
        components.push({
          type: 'header',
          parameters: [{ type: 'video', video: { link: headerMediaUrl } }]
        });
      }
    }

    // Body parameters
    if (bodyParameters && bodyParameters.length > 0) {
      components.push({
        type: 'body',
        parameters: bodyParameters.map((val) => ({
          type: 'text',
          text: String(val !== undefined && val !== null ? val : '')
        }))
      });
    }

    const payload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode || 'en' },
        ...(components.length > 0 ? { components } : {})
      }
    };

    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const messageId = response.data?.messages?.[0]?.id || 'outbound_tpl_' + Date.now();
    const displayText = renderedText || `[Template: ${templateName}]`;

    // Log outbound message to DB
    try {
      let conv = await WhatsappConversation.findOneAndUpdate(
        { phone: formattedPhone },
        { 
          $set: { 
            lastMessageAt: new Date(), 
            lastMessagePreview: displayText.substring(0, 50) + (displayText.length > 50 ? '...' : '') 
          },
          $setOnInsert: { name: 'Unknown User' }
        },
        { upsert: true, new: true }
      );
      
      const msg = await WhatsappMessage.create({
        conversationId: conv._id,
        messageId,
        sender: isAdminManualReply ? 'admin' : 'system',
        direction: 'outbound',
        type: 'template',
        text: displayText,
        status: 'sent',
        timestamp: new Date()
      });
      
      try {
        const io = getIo();
        io.emit('new_whatsapp_message', { conversation: conv, message: msg });
      } catch (e) {}
    } catch(dbErr) {
      console.error('Failed to log outbound template message', dbErr);
    }

    return { success: true, messageId };
  } catch (error: any) {
    const metaErr = error.response?.data?.error;
    const friendlyMessage = metaErr?.error_data?.details || metaErr?.message || error.message || 'Failed to send WhatsApp template message';
    console.error('Error sending WhatsApp template message:', metaErr || error.message);
    return { success: false, error: friendlyMessage };
  }
};


export const uploadWhatsAppMedia = async (buffer: Buffer, mimetype: string, filename: string): Promise<string | null> => {
  const token = getAccessToken();
  const phoneId = getPhoneNumberId();
  if (!token || !phoneId) {
    console.error('WhatsApp token or phone ID missing. Cannot upload media.');
    return null;
  }

  try {
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', buffer, { filename, contentType: mimetype });

    const response = await axios.post(`https://graph.facebook.com/v17.0/${phoneId}/media`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    if (response.data && response.data.id) {
      console.log(`Successfully uploaded media. ID: ${response.data.id}`);
      return response.data.id;
    } else {
      console.error('Failed to upload media:', response.data);
      return null;
    }
  } catch (error: any) {
    console.error('Error uploading WhatsApp media:', error.response?.data || error.message);
    return null;
  }
};

export const sendWhatsAppDocument = async (
  toPhone: string,
  mediaId: string,
  caption: string,
  filename: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const token = getAccessToken();
  const phoneId = getPhoneNumberId();
  if (!token || !phoneId) {
    console.error('WhatsApp token or phone ID missing. Cannot send document.');
    return { success: false, error: 'WhatsApp credentials missing' };
  }

  const formattedPhone = formatWhatsAppPhone(toPhone);

  // Opt-out Check
  try {
    const optOutRecord = await WhatsAppOptOut.findOne({ phone: { $in: [toPhone, formattedPhone] } });
    if (optOutRecord && optOutRecord.optedOut) {
      console.log(`[OPT-OUT] User ${toPhone} has opted out. Skipping document.`);
      return { success: false, error: 'User opted out' };
    }
  } catch (err) {
    console.error('Error checking opt-out status:', err);
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'document',
        document: {
          id: mediaId,
          caption: caption,
          filename: filename
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`Sent document to ${formattedPhone}`);
    return { success: true, messageId: response.data?.messages?.[0]?.id };
  } catch (error: any) {
    const errData = error.response?.data?.error;
    console.error('Error sending WhatsApp document:', errData || error.message);
    if (errData?.code === 131047) {
      return {
        success: false,
        error: 'Customer service window expired (24+ hrs). Media cannot be sent. Please use an approved Meta Template.'
      };
    }
    return {
      success: false,
      error: errData?.message || error.message || 'Failed to send document via WhatsApp'
    };
  }
};

// In-memory cache to prevent processing duplicate messages from Meta webhooks
const processedMessageIds = new Set<string>();

// Exported function so googleForm.controller.ts can cancel the reminder when the form is submitted
export const clearFormReminder = async (phone: string) => {
  try {
    const result = await OnboardingReminder.updateMany(
      { phone, status: 'PENDING' },
      { $set: { status: 'CANCELLED' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[REMINDER CANCELLED] User ${phone} submitted the form. Cancelled ${result.modifiedCount} reminders.`);
    }
  } catch (err) {
    console.error(`Error cancelling form reminder for ${phone}:`, err);
  }
};

const setReminder = async (phone: string, text: string, senderName?: string) => {
  try {
    // Clear any existing pending reminder for this phone number
    await OnboardingReminder.updateMany(
      { phone, status: 'PENDING' },
      { $set: { status: 'CANCELLED' } }
    );
    
    // Set a new reminder for 1 hour
    const reminderTime = new Date(Date.now() + 60 * 60 * 1000);
    
    await (OnboardingReminder as any).create({
      phone,
      userName: senderName,
      reminderTime,
      messageText: text,
      status: 'PENDING'
    });
    
    console.log(`[REMINDER SET] Onboarding reminder set for ${phone} at ${reminderTime}`);
  } catch (err) {
    console.error(`Error setting reminder for ${phone}:`, err);
  }
};

export const handleIncomingMessage = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log("🔥 [WEBHOOK POST HIT] Received Payload:", JSON.stringify(body, null, 2));

    // 1. Immediately acknowledge the webhook to prevent Meta from retrying
    if (!res.headersSent) {
      res.status(200).send("EVENT_RECEIVED");
    }

    // 2. Process asynchronously
    (async () => {
      try {
        // Check if it's a WhatsApp status update or message
        if (body.object === 'whatsapp_business_account') {
          if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0] &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
          ) {
            const messageObj = body.entry[0].changes[0].value.messages[0];
            const messageId = messageObj.id;
            
            if (messageId) {
              if (processedMessageIds.has(messageId)) {
                console.log(`[DUPLICATE MESSAGE] Ignoring already processed message ID: ${messageId}`);
                return;
              }
              // Add to cache and remove after 1 hour to free memory
              processedMessageIds.add(messageId);
              setTimeout(() => processedMessageIds.delete(messageId), 60 * 60 * 1000);
            }

            const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            const from = messageObj.from; // sender phone number
            const msg_body = messageObj.text?.body; // text message content
            
            // Extract profile name if available
            let senderName = 'Unknown User';
            if (body.entry[0].changes[0].value.contacts && body.entry[0].changes[0].value.contacts[0]) {
              senderName = body.entry[0].changes[0].value.contacts[0].profile?.name || 'Unknown User';
            }
            console.log(`[WHATSAPP MESSAGE] From: ${senderName} (${from})`);

            if (msg_body) {
              // Log inbound message
              try {
                let conv = await WhatsappConversation.findOneAndUpdate(
                  { phone: from },
                  { 
                    $set: { 
                      lastMessageAt: new Date(), 
                      lastMessagePreview: msg_body.substring(0, 50) + (msg_body.length > 50 ? '...' : '') 
                    },
                    $inc: { unreadCount: 1 },
                    $setOnInsert: { name: senderName }
                  },
                  { upsert: true, new: true }
                );
                
                const inboundMsg = await WhatsappMessage.create({
                  conversationId: conv._id,
                  messageId: messageId || 'inbound_' + Date.now(),
                  sender: 'user',
                  direction: 'inbound',
                  type: 'text',
                  text: msg_body,
                  status: 'received',
                  timestamp: new Date()
                });
                
                try {
                  const io = getIo();
                  io.emit('new_whatsapp_message', { conversation: conv, message: inboundMsg });
                } catch (e) {}
              } catch(dbErr) {
                console.error('Failed to log inbound message', dbErr);
              }

              const text = msg_body.trim().toLowerCase();

              // Handle Opt-Out
              if (text === 'stop' || text === 'unsubscribe') {
                await WhatsAppOptOut.findOneAndUpdate(
                  { phone: from },
                  { phone: from, optedOut: true, updatedAt: new Date() },
                  { upsert: true, new: true }
                );
                
                // Cancel any pending reminders
                await PurchaseReminder.updateMany(
                  { phone: from, status: 'PENDING' },
                  { $set: { status: 'SENT' } }
                );
                
                // Directly bypass the opt-out check to send the confirmation message
                const token = getAccessToken();
                const phoneId = getPhoneNumberId();
                if (token && phoneId) {
                  try {
                    await axios.post(
                      `https://graph.facebook.com/v17.0/${phoneId}/messages`,
                      {
                        messaging_product: 'whatsapp',
                        to: from,
                        type: 'text',
                        text: { body: `Aapka number humari notification list se remove kar diya gaya hai. Ab aapko aage se koi message nahi ayega.\n\nAgar aap wapas notifications chahte hain ya assessment form submit karte hain, toh messages dobara shuru ho jayenge. 🙏` }
                      },
                      {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      }
                    );
                  } catch (e) {
                    console.error("Failed to send stop confirmation:", e);
                  }
                }
                console.log(`[OPT-OUT] User ${from} opted out successfully.`);
                return; // Stop processing further for this message
              } else {
                // Re-opt in if they send any other message
                try {
                  await WhatsAppOptOut.findOneAndUpdate(
                    { phone: from },
                    { phone: from, optedOut: false, updatedAt: new Date() },
                    { upsert: true }
                  );
                } catch (optErr) {
                  console.error("Error resetting opt-out status on message:", optErr);
                }
              }

              // Set up the 3-day purchase reminder if they interacted on WhatsApp and haven't purchased
              try {
                const existingReminder = await (PurchaseReminder as any).findOne({ phone: from });
                if (!existingReminder) {
                  await (PurchaseReminder as any).create({
                    phone: from,
                    userName: senderName,
                    reminderTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    status: 'PENDING',
                    sendCount: 0
                  });
                  console.log(`[REMINDER SET] Initial 24h purchase reminder set for ${from} after interaction.`);
                } else if (existingReminder.status === 'SENT' && existingReminder.sendCount < 3) {
                   // If they interacted again and we had stopped, maybe resume? Or just leave it.
                }
              } catch (remErr) {
                console.error("Error setting purchase reminder on interaction:", remErr);
              }

              if (text === '1' || text === '1️⃣') {
                const reply = `Bahut badhiya.\n\nRestaurant Assessment complete karne me lagbhag 3-5 minute lagenge.\n\n🔗 Assessment Link:\n${GOOGLE_FORM_LINK}\n\nForm submit karne ke baad aapko KYROZ+ Growth Report di jayegi.\n\n---\n*Anya options:*\n2️⃣ KYROZ+ Kya Hai?\n3️⃣ Demo Request`;
                await sendWhatsAppMessage(from, reply);
                
                // Set a reminder specifically for not filling the form after clicking 1
                await setReminder(from, `Hi! ⏳\n\nLagta hai aapne apna Restaurant Assessment abhi tak complete nahi kiya hai. Sirf 3 minute lagte hain aur ye aapke restaurant ke growth me bahut madad karega.\n\n🔗 Link: ${GOOGLE_FORM_LINK}`, senderName);
                
              } else if (text === '2' || text === '2️⃣') {
                const reply = `KYROZ+ kya hai?\n\nKYROZ+ ek Restaurant Systemization Platform hai jo growing restaurants ke kitchen aur operations ko system par lane me help karta hai.\n\nAgar aapko lagta hai ki:\n✔ Taste har baar same nahi rehta\n✔ Chef ke bina restaurant chalana mushkil hai\n✔ Naye staff ko training dene me prompt lagta hai\n✔ Food cost aur wastage control nahi ho pata\n✔ Owner ko har chhoti-badi cheez dekhni padti hai\n\nTo KYROZ+ aapke liye useful ho sakta hai.\nKYROZ+ ka uddeshya restaurant ko logon par nahi, systems par chalana hai.\n\nAgar aap dekhna chahte hain ki KYROZ+ aapke restaurant me kitna useful ho sakta hai, to niche diye gaye option ka chunav karein:\n\n1️⃣ Start Assessment\n3️⃣ Demo Request`;
                await sendWhatsAppMessage(from, reply);
              } else if (text === '3' || text === '3️⃣') {
                const reply = `Bahut badhiya. 👍\n\nDemo discussion schedule karne se pehle, kripya niche diye gaye link par click karke 3-5 minute ka Restaurant Growth Assessment complete karein.\n\n🔗 ${GOOGLE_FORM_LINK}\n\nIs assessment ke madhyam se hum aapke restaurant ke operational challenges, growth opportunities aur kitchen-related bottlenecks ko samajh paate hain.\nIsse hume demo discussion ko aapke restaurant ki zarurat ke anusar tayyar karne me madad milti hai.\n\n✅ Assessment complete hote hi KYROZ+ Team aapse sampark karke demo discussion schedule karegi.`;
                await sendWhatsAppMessage(from, reply);
                
                // Set a reminder for the demo request form
                await setReminder(from, `Hi! ⏳\n\nAapne Demo Request kiya tha, par assessment abhi tak pending hai. Demo schedule karne ke liye is form ko bharna zaroori hai.\n\n🔗 Link: ${GOOGLE_FORM_LINK}`, senderName);
                
              } else if (text.includes('purchase the following sop packets') || text.includes('order details:')) {
                const reply = `Thank you for your order! 🙏\n\nWe have received your request for the SOP Packets. Our team will review the details and contact you shortly to process the payment and deliver your files.\n\nIf you have any urgent queries, please wait for our admin to reply.`;
                await sendWhatsAppMessage(from, reply);
              } else {
                // First Contact Message or fallback
                const reply = `Hello 👋\nWelcome to KYROZ+\n\nKYROZ restaurant owners ko chef dependency, taste inconsistency, staff training aur food cost control jaise operational challenges ko solve karne me help karta hai.\n\nApne restaurant ko behtar banane ke liye niche diye gaye option me se ek number (1, 2, ya 3) reply karein:\n\n1️⃣ Kya aap apna complimentary KYROZ Assessment shuru karna chahte hain? (Reply 1)\n\n2️⃣ Kya aap janna chahte hain ki KYROZ+ kya hai aur ye kaise madad karta hai? (Reply 2)\n\n3️⃣ Kya aap hamari team ke saath Demo Request schedule karna chahte hain? (Reply 3)\n\n*(Type 'STOP' to unsubscribe from messages)*`;
                await sendWhatsAppMessage(from, reply);
                
                await setReminder(from, `Hi! 👋\n\nHumne aapko kuch options bheje the par aapka koi reply nahi aaya. Agar aap KYROZ+ ke baare me aur janna chahte hain, toh niche diye gaye links check karein:\n\n🌐 Website: https://kyrozplus.com\n\n💬 Chat with us: https://wa.me/917887009800?text=Hi%20KYROZ%2B%20team!%20I%20saw%20your%20website%20and%20I'm%20interested%20in%20knowing%20more%20about%20how%20KYROZ%2B%20can%20help%20my%20restaurant.%20Can%20we%20talk%3F`, senderName);
              }
            }
          }
        }
      } catch (innerError) {
        console.error('Error in async webhook processing:', innerError);
      }
    })();
  } catch (error) {
    console.error('Error handling webhook:', error);
    if (!res.headersSent) {
      res.sendStatus(500);
    }
  }
};
