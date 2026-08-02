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
            content: `You are a highly experienced Restaurant Growth Consultant for KYROZ+. 
Your job is to analyze the following restaurant assessment data and generate a highly detailed, professional, and actionable "Growth Assessment Report" in Hindi-English (Hinglish). 
Format the report with clean Markdown, emojis, bullet points, and clear professional sections.

Structure the report EXACTLY with these sections:
# KYROZ+ Restaurant Growth Assessment Report
**Confidential Business Assessment**

## Executive Summary
(Summarize their setup, current sales, major gaps like taste inconsistency, turnover, etc. State the final goal of using KYROZ+)

## Current Business Assessment
(Detail their sales/profit, kitchen processes, inventory, staff training, and visibility based on their answers)

## Key Operational Challenges
(List the top bottlenecks they are facing using bullet points)

## Business Risks
(Highlight the risks of not solving these challenges, like customer dissatisfaction, profit erosion, scale limitation)

## Recommended KYROZ+ Solutions
(Recommend specific KYROZ+ modules like Kitchen Standardization, Food Costing, Inventory Management, Kitchen Training System, POS & Dashboard. Explain the expected benefit of each)

## Priority Action Plan
(Provide an Immediate Priority, Next Priority, and Future Improvement plan)

## Expected Business Outcomes
(List the exact benefits they will get like Consistency, controlled Food Cost, reduced Wastage, better Profitability)

## Conclusion
(Write a strong closing paragraph addressing them by name if provided, summarizing the impact, and urging them to schedule a demo call by contacting 7307255940)`
          },
          {
            role: "user",
            content: `Here are the responses from the restaurant owner:\n${JSON.stringify(data.responses || data, null, 2)}`
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
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
