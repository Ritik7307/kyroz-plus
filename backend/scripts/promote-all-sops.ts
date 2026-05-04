import mongoose from 'mongoose';
import Sop from '../src/models/Sop';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

async function promote() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const allSops = await Sop.find();
    console.log(`Found ${allSops.length} existing member SOPs.`);

    for (const sop of allSops) {
      // Check if already exists in Master
      const exists = await MasterSop.findOne({ title: sop.title });
      if (!exists) {
        const master = new MasterSop({
          title: sop.title,
          category: sop.category || 'Dish',
          contentEn: sop.contentEn || sop.content || '',
          contentHi: sop.contentHi || sop.content || '',
          content: sop.content || ''
        });
        await master.save();
        console.log(`Promoted: ${sop.title}`);
      }
    }

    console.log('Promotion complete.');
    process.exit(0);
  } catch (err) {
    console.error('Promotion failed:', err);
    process.exit(1);
  }
}

promote();
