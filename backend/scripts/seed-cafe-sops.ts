import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

async function seedSops() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const jsonPath = path.join(__dirname, 'cafe_sops.json');
    const sops = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    let updatedCount = 0;
    let newCount = 0;

    for (const sop of sops) {
      const existingSop = await MasterSop.findOne({ title: sop.title });
      if (existingSop) {
        existingSop.contentEn = sop.contentEn;
        existingSop.contentHi = sop.contentHi;
        existingSop.category = sop.category;
        await existingSop.save();
        console.log('Updated: ' + sop.title);
        updatedCount++;
      } else {
        const newSop = new MasterSop(sop);
        await newSop.save();
        console.log('Inserted: ' + sop.title);
        newCount++;
      }
    }

    console.log('\\nDone! Updated: ' + updatedCount + ', Inserted: ' + newCount);
  } catch (error) {
    console.error('Error seeding SOPs:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedSops();
