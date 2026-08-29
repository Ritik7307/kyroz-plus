import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getDishCosting } from './src/controllers/costing.controller';

dotenv.config({ path: '.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db as any;
  const userId = new mongoose.Types.ObjectId('69f84eb97a1102e857341078');
  const dish = await db.collection('dishes').findOne({ name: 'Veg Manchurian Dry', userId });
  if (!dish) return;
  const req = { user: { userId: userId.toString() }, params: { dishId: dish._id.toString() } } as any;
  const res = {
    json: (data: any) => console.log('Cost:', data.totalFoodCost, 'details:', JSON.stringify(data.ingredientsCostDetails, null, 2)),
    status: (code: any) => ({ json: (err: any) => console.log('Err:', code, err) })
  } as any;
  await getDishCosting(req, res);
  await mongoose.disconnect();
}
run().catch(console.error);
