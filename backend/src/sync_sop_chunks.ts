import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import Sop from './models/Sop';
import SopChunk from './models/SopChunk';
import { processSopText } from './services/ai/ingestion.service';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function syncChunks() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';
  console.log("Connecting to:", MONGO_URI);
  await mongoose.connect(MONGO_URI);

  // Wipe all old chunks to prevent mixed language duplicates
  await SopChunk.deleteMany({});
  console.log("Wiped old SopChunks.");

  const sops = await Sop.find({}).lean();
  console.log(`Found ${sops.length} total SOPs to sync.`);

  let syncedCount = 0;
  for (const sop of sops) {
    if (!sop.userId || !sop.title) continue;

    console.log(`Syncing chunks for user ${sop.userId} - dish: ${sop.title}...`);
    try {
      if (sop.contentEn) {
        const contentEn = `SOP: ${sop.title}\n\n${sop.contentEn}`;
        await processSopText(sop.userId.toString(), contentEn, 'en');
      }
      if (sop.contentHi) {
        const contentHi = `SOP: ${sop.title}\n\n${sop.contentHi}`;
        await processSopText(sop.userId.toString(), contentHi, 'hi');
      }
      syncedCount++;
    } catch (e: any) {
      console.error(`Error syncing ${sop.title}:`, e.message);
    }
  }

  console.log(`Successfully synced chunks for ${syncedCount} SOPs.`);
  await mongoose.disconnect();
}

syncChunks().catch(console.error);
