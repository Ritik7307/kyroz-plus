import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getDishCosting } from './src/controllers/costing.controller';

dotenv.config({ path: '.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db;
  if (!db) return;
  const user = await (mongoose.connection.db as any).collection('users').findOne({ email: 'vijayshankarprajapati29@gmail.com' }); const userId = user!._id;
  const dishes = await db.collection('dishes').find({ userId }).toArray();
  let updatedCount = 0;

  for (const d of dishes) {
    let cost = 0;
    const req = { user: { userId: userId.toString() }, params: { dishId: d._id.toString() } } as any;
    const res = {
      json: (data: any) => { cost = data.totalFoodCost || 0; },
      status: (code: any) => ({ json: (data: any) => { cost = data.totalFoodCost || 0; } })
    } as any;
    
    await getDishCosting(req, res);
    
    if (cost > 0 && d.ingredientPrice !== cost) {
      await db.collection('dishes').updateOne({ _id: d._id }, { $set: { ingredientPrice: cost } });
      updatedCount++;
      console.log(`Updated ${d.name}: ${d.ingredientPrice} -> ${cost}`);
    } else if (cost === 0 && d.ingredientPrice !== 0) {
      console.log(`Warning: Cost calculated as 0 for ${d.name} (was ${d.ingredientPrice})`);
    }
  }
  
  console.log(`Successfully synced ${updatedCount} dishes!`);
  await mongoose.disconnect();
}
run().catch(console.error);
