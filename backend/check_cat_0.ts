import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db;
  if (!db) return;
  const dishes = await db.collection('dishes').find({ ingredientPrice: 0, category: { $in: ['Chinese', 'South Indian'] } }).toArray();
  console.log('Chinese/South Indian with 0:', dishes.length);
  if (dishes.length > 0) console.log(dishes.slice(0, 5).map(d => d.name));
  await mongoose.disconnect();
}
run().catch(console.error);
