import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import Sop from '../src/models/Sop';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

async function removeDeprecated() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const deprecatedCategories = ['Dish', 'Gravy', 'Costing', 'Wastage'];

    const masterResult = await MasterSop.deleteMany({ category: { $in: deprecatedCategories } });
    console.log(`Deleted ${masterResult.deletedCount} deprecated Master SOPs.`);

    const userResult = await Sop.deleteMany({ category: { $in: deprecatedCategories } });
    console.log(`Deleted ${userResult.deletedCount} deprecated User SOPs.`);

    process.exit(0);
  } catch (err) {
    console.error('Deletion failed:', err);
    process.exit(1);
  }
}

removeDeprecated();
