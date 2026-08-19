import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import MasterSop from '../src/models/MasterSop';
import SopChunk from '../src/models/SopChunk';
import { processSopText } from '../src/services/ai/ingestion.service';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const users = await User.find({});
    console.log(`Found ${users.length} users. Commencing AI training...`);

    const masterSops = await MasterSop.find({}).lean();
    console.log(`Found ${masterSops.length} Master SOPs.`);

    for (const user of users) {
      console.log(`\n--- Training AI for user: ${user._id} ---`);
      
      // Wipe all existing chunks to start fresh with new chunking logic
      await SopChunk.deleteMany({ userId: user._id });
      console.log('Cleared old embeddings.');

      let totalChunks = 0;
      for (const sop of masterSops) {
        try {
          if (sop.contentEn) {
            const contentEn = `SOP: ${sop.title}\n\n${sop.contentEn}`;
            const resEn = await processSopText(user._id.toString(), contentEn, 'en');
            totalChunks += resEn.chunksStored;
          }
          if (sop.contentHi) {
            const contentHi = `SOP: ${sop.title}\n\n${sop.contentHi}`;
            const resHi = await processSopText(user._id.toString(), contentHi, 'hi');
            totalChunks += resHi.chunksStored;
          }
        } catch (e: any) {
          console.error(`Failed to train on SOP ${sop.title}:`, e.message);
        }
      }
      console.log(`Successfully generated ${totalChunks} new chunks for user ${user._id}`);
    }

    // Do the same for test_user_id just in case
    console.log(`\n--- Training AI for test_user_id ---`);
    await SopChunk.deleteMany({ userId: 'test_user_id' as any }).catch(() => {});
    let testChunks = 0;
    for (const sop of masterSops) {
      try {
        if (sop.contentEn) {
            const contentEn = `SOP: ${sop.title}\n\n${sop.contentEn}`;
            const resEn = await processSopText('test_user_id' as any, contentEn, 'en');
            testChunks += resEn.chunksStored;
        }
      } catch (e) {}
    }
    console.log(`Successfully generated ${testChunks} new chunks for test_user_id`);

    console.log('\nAI Training Complete!');
    process.exit(0);
  } catch (err) {
    console.error('Training Error:', err);
    process.exit(1);
  }
};

run();
