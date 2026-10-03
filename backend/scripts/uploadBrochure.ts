import fs from 'fs';
import path from 'path';
import { uploadWhatsAppMedia } from '../src/controllers/whatsappWebhook.controller';
import dotenv from 'dotenv';

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
      console.log('Please add this ID to your backend/.env file:');
      console.log(`WHATSAPP_BROCHURE_MEDIA_ID=${mediaId}`);
    } else {
      console.error('Failed to get media ID.');
    }
  } catch (error) {
    console.error('Error uploading brochure:', error);
  }
};

uploadBrochure();
