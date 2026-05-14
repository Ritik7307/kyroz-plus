import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Sop from '../src/models/Sop';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../.env') });

const AI_CORE_URL = 'http://127.0.0.1:8000';

async function syncSops() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected!');

    const sops = await Sop.find({});
    console.log(`Found ${sops.length} SOPs.`);

    if (sops.length === 0) {
      console.log('No SOPs to sync.');
      return;
    }

    let combinedContent = 'KYROZ RESTAURANT SOPS\n\n';
    for (const sop of sops) {
      combinedContent += `TITLE: ${sop.title}\n`;
      combinedContent += `CATEGORY: ${sop.category}\n`;
      if (sop.contentEn) combinedContent += `CONTENT (EN): ${sop.contentEn}\n`;
      if (sop.contentHi) combinedContent += `CONTENT (HI): ${sop.contentHi}\n`;
      if (sop.content) combinedContent += `CONTENT: ${sop.content}\n`;
      combinedContent += '\n-------------------\n\n';
    }

    const tempFilePath = path.join(__dirname, 'temp_sops.txt');
    fs.writeFileSync(tempFilePath, combinedContent);

    console.log('Uploading to AI Core...');
    
    // Using form-data via a manual fetch-compatible way or just using a simple request
    // Since we are on Node 20, we can use the native FormData
    const formData = new FormData();
    const blob = new Blob([combinedContent], { type: 'text/plain' });
    formData.append('file', blob, 'uploaded_library.txt');

    const response = await fetch(`${AI_CORE_URL}/upload-docs`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('AI Core response:', result);

    fs.unlinkSync(tempFilePath);
    console.log('Sync complete!');

  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

syncSops();
