import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Sop from './src/models/Sop';
import SopChunk from './src/models/SopChunk';

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kyroz-plus');
  const sops = await Sop.find({}).lean();
  console.log("SOPs:", sops.map(s => ({ title: s.title, userId: s.userId })));
  
  const chunks = await SopChunk.find({}).lean();
  console.log("Chunks:", chunks.map(c => ({ dish: c.dish, userId: c.userId, lang: c.lang })));
  
  mongoose.disconnect();
}
check();
