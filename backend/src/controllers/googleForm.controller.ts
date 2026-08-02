import { Request, Response } from 'express';
import { sendWhatsAppMessage, uploadWhatsAppMedia, sendWhatsAppDocument } from './whatsappWebhook.controller';
import Groq from 'groq-sdk';
import { generatePdfFromHtml } from '../services/pdfGenerator.service';
import { marked } from 'marked';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory cache to prevent processing duplicate triggers from Google Apps Script
const processedPhonesCache = new Set<string>();

export const handleGoogleFormWebhook = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("[GOOGLE FORM WEBHOOK HIT] Received Data:", JSON.stringify(data, null, 2));

    const phone = data.whatsappNumber;

    if (!phone) {
      console.error("No WhatsApp number provided in the form submission.");
      return res.status(400).json({ error: "Missing WhatsApp Number" });
    }

    // --- Prevent duplicate webhook triggers (e.g. Google Apps Script retries) ---
    // If the phone number was processed recently, ignore this trigger.
    if (processedPhonesCache.has(phone)) {
      console.log(`[DUPLICATE WEBHOOK] Ignoring duplicate trigger for phone: ${phone}`);
      return res.status(200).json({ success: true, message: "Already processing" });
    }

    // Add to cache and automatically remove after 1 hour (3600000 ms)
    processedPhonesCache.add(phone);
    setTimeout(() => {
      processedPhonesCache.delete(phone);
    }, 60 * 60 * 1000);

    // 1. Return 200 OK to the webhook immediately so Google Apps Script doesn't timeout
    res.status(200).json({ success: true, message: "Processing started" });

    // 2. Send Immediate ETA Acknowledgment (in Hinglish)
    const name = data.responses?.Name || data.responses?.name || data.Name || data.name || "Restaurant Owner";
    const etaMessage = `Hi ${name},\n\nHumein aapka restaurant assessment form mil gaya hai, thank you! 📝\n\nHamari team aapke inputs ke hisab se ek custom Growth & Kitchen Automation Report taiyar kar rahi hai. Kuch hi minton me aapki report isi WhatsApp number par bhej di jayegi.\n\nRegards,\nTeam KYROZ+`;

    // Await this so we don't accidentally start the AI generation before the ETA message is sent,
    // but doing so ensures it fires off immediately.
    await sendWhatsAppMessage(phone, etaMessage);

    // 3. Process AI Report IMMEDIATELY
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a top-tier, highly analytical Restaurant Business Consultant (like McKinsey or Bain) working for KYROZ+. 
Your job is to deeply analyze the following restaurant assessment data and generate an extremely detailed, analytical, and descriptive "Growth Assessment Report" in Hindi-English (Hinglish). 

CRITICAL INSTRUCTIONS:
- Do not give short answers. Provide deep, analytical insights. Write at least 3-4 detailed sentences for every point.
- Identify hidden gaps, root causes of their problems, and secondary consequences (e.g., how high staff turnover destroys taste consistency and customer retention).
- Be highly descriptive. Use professional consulting tone, numbers, and logical deductions based on their inputs.
- Format the report with clean Markdown, emojis, bullet points, and clear professional sections.

Structure the report EXACTLY with these sections:
# KYROZ+ Restaurant Growth Assessment Report
**Confidential Business Assessment**

## 1. Executive Summary
(Provide a dense, 2-3 paragraph summary of their current business state, the critical roadblocks holding them back, and the strategic objective of using KYROZ+ to scale.)

## 2. Deep-Dive Business Assessment
(Thoroughly analyze their sales/profit metrics, kitchen workflows, inventory habits, staff training, and data visibility. Explain what their specific answers reveal about their operational maturity.)

## 3. Critical Operational Bottlenecks
(List the top 4-5 bottlenecks. For each bottleneck, provide a deep explanation of WHY it is happening and HOW it is silently draining their revenue.)

## 4. Cascading Business Risks
(Highlight the severe long-term risks of not solving these challenges. Discuss customer churn, profit margin erosion, operational chaos, and the inability to scale to multiple outlets.)

## 5. Strategic KYROZ+ Solutions & ROI
(Recommend specific KYROZ+ modules like Recipe Standardization, Food Costing, Inventory Management, POS Analytics. For each solution, explain the exact operational mechanics of how it solves their bottleneck and the expected ROI/profit impact.)

## 6. Priority Implementation Roadmap
(Provide a highly structured, step-by-step action plan: Immediate 1-2 weeks, Short-term 1-2 months, and Long-term 3-6 months. Detail exactly what needs to be deployed.)

## 7. Expected Business Transformation
(List the exact quantifiable and qualitative benefits they will achieve: exact COGS control, wastage reduction percentages, staff accountability, and scaling readiness.)

## 8. Conclusion & Next Steps
(Write a compelling, urgent closing paragraph addressing them by name, summarizing the financial impact of taking action, and urging them to schedule a deep-dive consultation by contacting 7307255940.)`
          },
          {
            role: "user",
            content: `Here are the responses from the restaurant owner:\n${JSON.stringify(data.responses || data, null, 2)}`
          }
        ],
        model: "llama-3.3-70b-versatile", // Switched to a much smarter, larger model for highly descriptive analytics
        temperature: 0.7,
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
          await sendWhatsAppDocument(phone, mediaId, `Hi,\n\nAapki custom restaurant growth report taiyar ho gayi hai aur niche attach kar di gayi hai.\n\nIs report ko detail me samajhne aur aapke restaurant ke liye next steps discuss karne ke liye, KYROZ+ ki Expert Team aapse contact karegi.\n\nRegards,\nTeam KYROZ+`, 'Kyroz_Growth_Report.pdf');

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

  } catch (error) {
    console.error('Error handling Google Form webhook:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
