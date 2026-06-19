import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Sop from './src/models/Sop';
import SopChunk from './src/models/SopChunk';
import { processSopText } from './src/services/ai/ingestion.service';

async function backfill() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kyroz-plus');
    const sops = await Sop.find({}).lean();
    let synced = 0;
    
    for (const sop of sops) {
      const existingChunks = await SopChunk.countDocuments({ userId: sop.userId, dish: sop.title.toLowerCase() });
      if (existingChunks === 0) {
        if (sop.contentEn) {
          await processSopText(sop.userId.toString(), `SOP: ${sop.title}\n\n${sop.contentEn}`, 'en').catch(() => {});
        }
        if (sop.contentHi) {
          await processSopText(sop.userId.toString(), `SOP: ${sop.title}\n\n${sop.contentHi}`, 'hi').catch(() => {});
        }
        if (sop.content && !sop.contentEn && !sop.contentHi) {
          await processSopText(sop.userId.toString(), `SOP: ${sop.title}\n\n${sop.content}`, 'en').catch(() => {});
        }
        synced++;
        console.log(`Synced missing SOP: ${sop.title}`);
      }
    }
    console.log(`Backfill complete. Synced ${synced} missing SOPs.`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
backfill();
