import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixCasing() {
  await mongoose.connect(process.env.MONGO_URI!);
  const db = mongoose.connection.db!;
  const dishes = db.collection('dishes');
  const rmM = db.collection('rawmaterials');
  
  const dRes = await dishes.updateMany({ category: 'INDIAN VEG' }, { $set: { category: 'Indian Veg' } });
  const rRes = await rmM.updateMany({ category: 'INDIAN VEG' }, { $set: { category: 'Indian Veg' } });
  
  console.log('Dishes updated:', dRes.modifiedCount);
  console.log('RMs updated:', rRes.modifiedCount);
  process.exit(0);
}

fixCasing();
