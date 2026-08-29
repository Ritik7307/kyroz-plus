import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getDishCosting } from './src/controllers/costing.controller';

dotenv.config({ path: '.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db as any;
  const userId = new mongoose.Types.ObjectId('69f84eb97a1102e857341078');
  
  const chinese = await db.collection('dishes').findOne({ userId, category: 'Chinese' });
  console.log('Testing cost for:', chinese?.name);

  const req = {
    user: { userId: userId.toString() },
    params: { dishId: chinese?._id.toString() }
  } as any;

  const res = {
    json: (data: any) => console.log('Cost:', data.totalFoodCost),
    status: (code: any) => ({ json: (err: any) => console.log('Error', code, err) })
  } as any;

  await getDishCosting(req, res);
  
  await mongoose.disconnect();
}

run().catch(console.error);
