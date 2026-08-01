import { generatePdfFromHtml } from './src/services/pdfGenerator.service';
import { uploadWhatsAppMedia } from './src/controllers/whatsappWebhook.controller';

async function run() {
  try {
    console.log("Generating PDF...");
    const pdfBuffer = await generatePdfFromHtml("<h1>Test Report</h1><p>This is a test.</p>");
    console.log("PDF generated! Size:", pdfBuffer.length);
    
    console.log("Attempting upload...");
    const mediaId = await uploadWhatsAppMedia(pdfBuffer, 'application/pdf', 'test.pdf');
    console.log("Upload result:", mediaId);
  } catch (e) {
    console.error("TEST FAILED:", e);
  }
}

run();
