import { Request, Response } from 'express';
import axios from 'axios';

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

const sendWhatsAppMessage = async (toPhone: string, text: string) => {
  const token = getAccessToken();
  const phoneId = getPhoneNumberId();
  if (!token || !phoneId) {
    console.error('WhatsApp token or phone ID missing. Cannot send message.');
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: toPhone,
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
    console.log(`Sent message to ${toPhone}`);
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
  }
};

export const handleIncomingMessage = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log("🔥 [WEBHOOK POST HIT] Received Payload:", JSON.stringify(body, null, 2));

    // Check if it's a WhatsApp status update or message
    if (body.object === 'whatsapp_business_account') {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; // sender phone number
        const msg_body = body.entry[0].changes[0].value.messages[0].text?.body; // text message content

        if (msg_body) {
          const text = msg_body.trim().toLowerCase();
          
          if (text === '1' || text === '1️⃣') {
            const reply = `Bahut badhiya.\n\nRestaurant Assessment complete karne me lagbhag 3-5 minute lagenge.\n\n🔗 Assessment Link:\n${GOOGLE_FORM_LINK}\n\nForm submit karne ke baad aapko KYROZ+ Growth Report di jayegi.\n\n---\n*Anya options:*\n2️⃣ KYROZ+ Kya Hai?\n3️⃣ Demo Request`;
            await sendWhatsAppMessage(from, reply);
          } else if (text === '2' || text === '2️⃣') {
            const reply = `KYROZ+ kya hai?\n\nKYROZ+ ek Restaurant Systemization Platform hai jo growing restaurants ko kitchen aur operations ko system par lane me help karta hai.\n\nAgar aapko lagta hai ki:\n✔ Taste har baar same nahi rehta\n✔ Chef ke bina restaurant chalana mushkil hai\n✔ Naye staff ko training dene me bahut samay lagta hai\n✔ Food cost aur wastage control nahi ho pata\n✔ Owner ko har chhoti-badi cheez dekhni padti hai\n\nTo KYROZ+ aapke liye useful ho sakta hai.\nKYROZ+ ka uddeshya restaurant ko logon par nahi, systems par chalana hai.\n\nAgar aap dekhna chahte hain ki KYROZ+ aapke restaurant me kitna useful ho sakta hai, to niche diye gaye option ka chunav karein:\n\n1️⃣ Start Assessment\n3️⃣ Demo Request`;
            await sendWhatsAppMessage(from, reply);
          } else if (text === '3' || text === '3️⃣') {
            const reply = `Bahut badhiya. 👍\n\nDemo discussion schedule karne se pehle, kripya niche diye gaye link par click karke 3–5 minute ka Restaurant Growth Assessment complete karein.\n\n🔗 ${GOOGLE_FORM_LINK}\n\nIs assessment ke madhyam se hum aapke restaurant ke operational challenges, growth opportunities aur kitchen-related bottlenecks ko samajh paate hain.\nIsse hume demo discussion ko aapke restaurant ki zarurat ke anusar tayyar karne me madad milti hai.\n\n✅ Assessment complete hote hi KYROZ+ Team aapse sampark karke demo discussion schedule karegi.`;
            await sendWhatsAppMessage(from, reply);
          } else {
            // First Contact Message or fallback
            const reply = `Hello 👋\nWelcome to KYROZ+\n\nKYROZ restaurant owners ko chef dependency, taste inconsistency, staff training aur food cost control jaise operational challenges ko solve karne me help karta hai.\n\nApne restaurant ko behtar banane ke liye niche diye gaye option me se ek number (1, 2, ya 3) reply karein:\n\n1️⃣ Kya aap apna complimentary KYROZ Assessment shuru karna chahte hain? (Reply 1)\n\n2️⃣ Kya aap janna chahte hain ki KYROZ+ kya hai aur ye kaise madad karta hai? (Reply 2)\n\n3️⃣ Kya aap hamari team ke saath Demo Request schedule karna chahte hain? (Reply 3)`;
            await sendWhatsAppMessage(from, reply);
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
};
