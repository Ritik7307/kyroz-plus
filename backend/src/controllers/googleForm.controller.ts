import { Request, Response } from 'express';
import { sendWhatsAppMessage } from './whatsappWebhook.controller';

export const handleGoogleFormWebhook = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("🔥 [GOOGLE FORM WEBHOOK HIT] Received Data:", JSON.stringify(data, null, 2));

    // The Google Apps Script will send data in this format:
    // {
    //   whatsappNumber: "...",
    //   responses: {
    //     "Question 1": "Answer 1",
    //     "Question 2": "Answer 2"
    //   }
    // }

    const phone = data.whatsappNumber;
    
    if (!phone) {
      console.error("No WhatsApp number provided in the form submission.");
      return res.status(400).json({ error: "Missing WhatsApp Number" });
    }

    // TODO: Implement actual scoring/logic based on data.responses
    // For now, send a generic report
    const reportMessage = `*KYROZ+ Growth Report* 🚀\n\nDhanyawad aapka assessment complete karne ke liye!\n\nHumne aapke responses ka analysis kiya hai aur humari team jald hi aapse ek detailed plan ke sath sampark karegi.\n\nKisi bhi sahayata ke liye aap is number par message kar sakte hain.`;

    await sendWhatsAppMessage(phone, reportMessage);

    res.status(200).json({ success: true, message: "Report sent successfully" });
  } catch (error) {
    console.error('Error handling Google Form webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
