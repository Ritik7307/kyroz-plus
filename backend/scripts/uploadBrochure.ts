import * as fs from 'fs';
import * as path from 'path';
import { uploadWhatsAppMedia } from '../src/controllers/whatsappWebhook.controller';
import * as dotenv from 'dotenv';

dotenv.config();

const uploadBrochure = async () => {
  // Make sure you place your PDF in the scripts folder and name it 'brochure.pdf'
  const pdfPath = path.join(__dirname, 'brochure.pdf');

  if (!fs.existsSync(pdfPath)) {
    console.error(`Please place your PDF file at: ${pdfPath}`);
    return;
  }

  try {
    const buffer = fs.readFileSync(pdfPath);
    console.log('Uploading brochure to WhatsApp...');
    const mediaId = await uploadWhatsAppMedia(buffer, 'application/pdf', 'Brochure.pdf');

    if (mediaId) {
      console.log('\n✅ Upload Successful!');
      console.log('----------------------------------------');
      console.log(`Your WHATSAPP_BROCHURE_MEDIA_ID is: ${mediaId}`);
      console.log('----------------------------------------');

      // Automatically update .env file
      const envPath = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf-8');
        if (envContent.includes('WHATSAPP_BROCHURE_MEDIA_ID=')) {
          envContent = envContent.replace(/WHATSAPP_BROCHURE_MEDIA_ID=.*/g, `WHATSAPP_BROCHURE_MEDIA_ID=${mediaId}`);
        } else {
          envContent += `\nWHATSAPP_BROCHURE_MEDIA_ID=${mediaId}\n`;
        }
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Successfully updated backend/.env file automatically!');
      } else {
        console.log('Please add this ID to your backend/.env file manually:');
        console.log(`WHATSAPP_BROCHURE_MEDIA_ID=${mediaId}`);
      }
      process.exit(0);
    } else {
      console.error('Failed to get media ID.');
    }
  } catch (error) {
    console.error('Error uploading brochure:', error);
  }
};

uploadBrochure().then(() => {
  setTimeout(() => process.exit(0), 1000); // safety fallback to ensure process exits
});
