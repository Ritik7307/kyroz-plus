import Groq from 'groq-sdk';
import { marked } from 'marked';
import { generatePdfFromHtml } from './src/services/pdfGenerator.service';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    console.log("Testing Groq...");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Say hi" }],
      model: "llama-3.1-8b-instant", 
      temperature: 0.5,
    });
    
    const reportContent = completion.choices[0]?.message?.content;
    console.log("Groq OK. Response length:", reportContent?.length);

    console.log("Testing marked...");
    const htmlReport = await marked.parse(reportContent || "");
    console.log("Marked OK. HTML length:", htmlReport.length);

    console.log("Testing PDF...");
    const pdfBuffer = await generatePdfFromHtml(`<h1>Test</h1>${htmlReport}`);
    console.log("PDF OK. Buffer length:", pdfBuffer.length);
    
  } catch (e) {
    console.error("FLOW CRASHED:", e);
  }
}

run();
