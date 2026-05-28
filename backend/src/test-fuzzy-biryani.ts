import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User';
import Sop from './models/Sop';
import SopChunk from './models/SopChunk';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';

async function test() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const user = await User.findOne({});
  if (!user) {
    console.error('No user found in DB!');
    await mongoose.disconnect();
    return;
  }
  const userId = user._id.toString();
  console.log('User ID:', userId);

  const chunks = await SopChunk.find({ userId, dish: /biryani/i }).lean();
  console.log(`Found ${chunks.length} chunks for Biryani:`);
  for (const c of chunks) {
    console.log(`- Dish: "${c.dish}" | Lang: "${c.lang}" | Content Length: ${c.content.length}`);
  }

  await mongoose.disconnect();
}

test().catch(console.error);
