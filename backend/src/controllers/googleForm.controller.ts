import { Request, Response } from 'express';
import { sendWhatsAppMessage, uploadWhatsAppMedia, sendWhatsAppDocument } from './whatsappWebhook.controller';
import Groq from 'groq-sdk';
import { generatePdfFromHtml } from '../services/pdfGenerator.service';
import { marked } from 'marked';

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
    const etaMessage = `Thank you for completing the KYROZ+ Restaurant Growth Assessment! 🚀\n\nOur expert is currently analyzing your responses. Your customized Restaurant Growth Report is being generated and will be sent to you as a PDF document right here in approximately 10 to 15 minutes.\n\nPlease wait...`;

    // We send this asynchronously and don't await it strictly for the response, 
    // but doing so ensures it fires off immediately.
    await sendWhatsAppMessage(phone, etaMessage);

    // 2. Return 200 OK to the webhook immediately so Google Apps Script doesn't timeout
    res.status(200).json({ success: true, message: "Processing started" });

    // 3. Process AI Report in the background
    setTimeout(async () => {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are a highly experienced Restaurant Growth Consultant. 
Your job is to analyze the following restaurant assessment data and generate a customized, professional, and actionable "Growth Assessment Report" in Hindi-English (Hinglish). 
Format the report with clean Markdown, emojis, bullet points, and clear sections.
Structure:
# KYROZ+ Growth Assessment Report
## 1. Current Bottlenecks (Kya challenges hain)
## 2. Revenue Leakage Areas (Kahan paisa waste ho raha hai)
## 3. Actionable Solutions (Kaise fix karein using Systems like KYROZ+)
## 4. Next Steps (Demo call scheduling hook)`
            },
            {
              role: "user",
              content: `Here are the responses from the restaurant owner:\n${JSON.stringify(data.responses || data, null, 2)}`
            }
          ],
          model: "llama-3.1-8b-instant", // Using fast Groq model
          temperature: 0.5,
        });

        const reportContent = completion.choices[0]?.message?.content;

        if (reportContent) {
          // Convert Markdown to HTML
          const htmlReport = await marked.parse(reportContent);

          // Generate PDF
          const pdfBuffer = await generatePdfFromHtml(`
            <div class="header">
              <h1>KYROZ+</h1>
              <p>Restaurant Growth Assessment Report</p>
            </div>
            ${htmlReport}
            <div class="footer">Generated automatically by KYROZ+ AI</div>
          `);

          // Upload PDF to WhatsApp
          const mediaId = await uploadWhatsAppMedia(pdfBuffer, 'application/pdf', 'KYROZ_Growth_Report.pdf');

          if (mediaId) {
            // Send the final report via WhatsApp as a document
            await sendWhatsAppDocument(phone, mediaId, `*KYROZ+ Growth Assessment Report* 📊\n\nHere is your customized analysis report in PDF format!\n\n---\n_Reply with "3" to schedule a personalized Demo with our team, or contact us directly at +91 7887009800!_`, 'KYROZ_Growth_Report.pdf');

            // Send a copy to the owner
            const ownerPhone = '917307255940';
            await sendWhatsAppDocument(ownerPhone, mediaId, `*New Form Submission (Lead)* 🚨\n\n*Phone:* ${phone}\n\n*Generated Report attached.*`, 'Lead_Report.pdf');
          } else {
            // Fallback to text message if PDF upload fails
            await sendWhatsAppMessage(phone, `*KYROZ+ Growth Assessment Report* 📊\n\n${reportContent}\n\n---\n_Reply with "3" to schedule a personalized Demo with our team, or contact us directly at +91 7887009800!_`);
            const ownerPhone = '917307255940';
            await sendWhatsAppMessage(ownerPhone, `*New Form Submission (Lead)* 🚨\n\n*Phone:* ${phone}\n\n*Generated Report:* 👇\n\n${reportContent}`);
          }
        } else {
          await sendWhatsAppMessage(phone, `We successfully analyzed your profile! However, there was a slight issue generating the report. Please reply with "3" to schedule a demo, or call us at +91 7887009800!`);

          const ownerPhone = '917307255940';
          await sendWhatsAppMessage(ownerPhone, `*New Form Submission (Lead)* 🚨\n\n*Phone:* ${phone}\n\n*Note:* The AI failed to generate a report for this user.`);
        }

      } catch (aiError: any) {
        console.error("AI Generation Error:", aiError);
        await sendWhatsAppMessage(phone, `We successfully analyzed your profile! However, there was a slight issue generating the text report. Error: ${aiError.message}. Please reply with "3" to schedule a demo and our team will present your report on the call!`);
      }
    }, 10 * 60 * 1000); // 10 minutes delay

  } catch (error) {
    console.error('Error handling Google Form webhook:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
