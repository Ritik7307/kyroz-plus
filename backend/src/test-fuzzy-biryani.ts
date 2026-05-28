import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import mongoose from 'mongoose';
import { generateRagResponse } from './services/ai/ragPipeline.service';
import User from './models/User';
import Sop from './models/Sop';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';

async function test() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const user = await User.findOne({});
  if (!user) {
    console.error('No user found in DB! Please register or seed.');
    await mongoose.disconnect();
    return;
  }
  const userId = user._id.toString();
  console.log('Testing with User:', user.email, 'ID:', userId);

  // Sync MasterSops to UserSops and SopChunks
  const sops = await Sop.find({ userId });
  console.log('User SOPs:', sops.map(s => s.title));

  const testQueries = [
    'luckonowi biryani',
    'shahi lucknowi biryani',
    'लक्नदी बिर्यानी',
    'लखनवी बिर्यानी कैसे बनाएँ?',
    'how to make lucknowi biryani'
  ];

  for (const q of testQueries) {
    console.log('\n----------------------------------------');
    console.log(`Query: "${q}"`);
    const res = await generateRagResponse(userId, q, 'auto');
    console.log('Language Detected:', res.detectedLang);
    console.log('Reply Snippet:', res.reply.substring(0, 300));
    console.log('Suggestions:', res.suggestions);
  }

  await mongoose.disconnect();
}

test().catch(console.error);
