import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db;
  if (!db) return;
  const recipes = await db.collection('recipes').find({ 'ingredients.itemId': { $exists: false }, 'ingredients.0': { $exists: true } }).toArray();
  console.log(`Found ${recipes.length} recipes with missing itemId`);
  if (recipes.length > 0) {
    console.log(recipes[0].ingredients);
  }
  await mongoose.disconnect();
}
run().catch(console.error);
