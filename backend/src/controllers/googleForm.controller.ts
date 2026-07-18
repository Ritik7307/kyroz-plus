import { Request, Response } from 'express';
import { sendWhatsAppMessage } from './whatsappWebhook.controller';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const handleGoogleFormWebhook = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("[GOOGLE FORM WEBHOOK HIT] Received Data:", JSON.stringify(data, null, 2));

    const phone = data.whatsappNumber;
    
    if (!phone) {
      console.error("No WhatsApp number provided in the form submission.");
      return res.status(400).json({ error: "Missing WhatsApp Number" });
    }

    // 1. Send Immediate ETA Acknowledgment
    const etaMessage = `Thank you for completing the KYROZ+ Restaurant Growth Assessment! 🚀\n\nOur AI is currently analyzing your responses. Your customized Restaurant Growth Report is being generated and will be sent to you right here in approximately 1 to 2 minutes.\n\nPlease wait...`;
    
    // We send this asynchronously and don't await it strictly for the response, 
    // but doing so ensures it fires off immediately.
    await sendWhatsAppMessage(phone, etaMessage);

    // 2. Return 200 OK to the webhook immediately so Google Apps Script doesn't timeout
    res.status(200).json({ success: true, message: "Processing started" });

    // 3. Process AI Report in the background
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a highly experienced Restaurant Growth Consultant. 
Your job is to analyze the following restaurant assessment data and generate a customized, professional, and actionable "Growth Assessment Report" in Hindi-English (Hinglish). 
Format the report with clean Markdown, emojis, bullet points, and clear sections.
Structure:
1. Current Bottlenecks (Kya challenges hain)
2. Revenue Leakage Areas (Kahan paisa waste ho raha hai)
3. Actionable Solutions (Kaise fix karein using Systems like KYROZ+)
4. Next Steps (Demo call scheduling hook)`
          },
          {
            role: "user",
            content: `Here are the responses from the restaurant owner:\n${JSON.stringify(data.responses || data, null, 2)}`
          }
        ],
        model: "llama3-8b-8192", // Using fast Groq model
        temperature: 0.5,
      });

      const reportContent = completion.choices[0]?.message?.content;

      if (reportContent) {
        // 4. Send the final report via WhatsApp
        await sendWhatsAppMessage(phone, `*KYROZ+ Growth Assessment Report* 📊\n\n${reportContent}\n\n---\n_Reply with "3" to schedule a personalized Demo with our team!_`);
      } else {
        await sendWhatsAppMessage(phone, `We successfully analyzed your profile! However, there was a slight issue generating the text report. Please reply with "3" to schedule a demo and our team will present your report on the call!`);
      }

    } catch (aiError) {
      console.error("AI Generation Error:", aiError);
      await sendWhatsAppMessage(phone, `We successfully analyzed your profile! However, there was a slight issue generating the text report. Please reply with "3" to schedule a demo and our team will present your report on the call!`);
    }

  } catch (error) {
    console.error('Error handling Google Form webhook:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
