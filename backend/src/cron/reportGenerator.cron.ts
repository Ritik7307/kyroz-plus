import cron from 'node-cron';
import PendingReport from '../models/PendingReport';
import Groq from 'groq-sdk';
import { generatePdfFromHtml } from '../services/pdfGenerator.service';
import { marked } from 'marked';
import { sendWhatsAppMessage, uploadWhatsAppMedia, sendWhatsAppDocument } from '../controllers/whatsappWebhook.controller';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const processPendingReports = async () => {
  try {
    const now = new Date();
    // Find reports that are pending and their executeAt time has passed
    const pendingReports = await PendingReport.find({
      status: 'PENDING',
      executeAt: { $lte: now }
    });

    for (const report of pendingReports) {
      // Mark as processing to prevent duplicate processing
      report.status = 'PROCESSING';
      await report.save();

      const phone = report.phone;
      const data = report.data;

      console.log(`[CRON] Processing delayed AI report for ${phone}`);

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
(Write a compelling, urgent closing paragraph addressing them by name, summarizing the financial impact of taking action, and urging them to schedule a deep-dive consultation by contacting 8874581717.)`
            },
            {
              role: "user",
              content: `Here are the responses from the restaurant owner:\n${JSON.stringify(data.responses || data, null, 2)}`
            }
          ],
          model: "openai/gpt-oss-120b",
          temperature: 0.7,
        });

        const reportContent = completion.choices[0]?.message?.content;

        if (reportContent) {
          const htmlReport = await marked.parse(reportContent);
          const pdfBuffer = await generatePdfFromHtml(`
            <div class="header">
              <h1>KYROZ+</h1>
              <p>Restaurant Growth Assessment Report</p>
            </div>
            ${htmlReport}
            <div class="footer">Generated automatically by KYROZ+ AI</div>
          `);

          const mediaId = await uploadWhatsAppMedia(pdfBuffer, 'application/pdf', 'KYROZ_Growth_Report.pdf');

          if (mediaId) {
            await sendWhatsAppDocument(phone, mediaId, `Hi,\n\nAapki custom restaurant growth report taiyar ho gayi hai aur niche attach kar di gayi hai.\n\nIs report ko detail me samajhne aur aapke restaurant ke liye next steps discuss karne ke liye, KYROZ+ ki Expert Team aapse contact karegi.\n\nRegards,\nTeam KYROZ+`, 'Kyroz_Growth_Report.pdf');
            const ownerPhone = '918874581717';
            await sendWhatsAppDocument(ownerPhone, mediaId, `*New Form Submission (Lead)* 🚨\n\n*Phone:* ${phone}\n\n*Generated Report attached.*`, 'Lead_Report.pdf');
          } else {
            const ownerPhone = '918874581717';
            await sendWhatsAppMessage(ownerPhone, `*New Form Submission (Lead)* 🚨\n\n*Phone:* ${phone}\n\n*Generated Report:* 👇\n\n${reportContent}`);
          }
        } else {
          const ownerPhone = '918874581717';
          await sendWhatsAppMessage(ownerPhone, `*New Form Submission (Lead)* 🚨\n\n*Phone:* ${phone}\n\n*Note:* The AI failed to generate a report for this user.`);
        }

        report.status = 'COMPLETED';
        await report.save();

      } catch (aiError: any) {
        console.error(`[CRON ERROR] AI Generation Error for ${phone}:`, aiError);
        const ownerPhone = '918874581717';
        await sendWhatsAppMessage(ownerPhone, `*New Form Submission (Lead)* 🚨\n\n*Phone:* ${phone}\n\n*Note:* The AI failed with error: ${aiError.message}`);
        
        report.status = 'FAILED';
        await report.save();
      }
    }
  } catch (error) {
    console.error('[CRON ERROR] Failed to process pending reports:', error);
  }
};

const startReportGeneratorCron = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    processPendingReports();
  });
  console.log('Report generator cron initialized.');
};

export default startReportGeneratorCron;
