import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DishSchema = new mongoose.Schema({ category: String }, { strict: false });
const SopSchema = new mongoose.Schema({ category: String }, { strict: false });

const categoryMap: Record<string, string> = {
  'Pizza': 'Cafe',
  'Burger': 'Cafe',
  'Wrap': 'Cafe',
  'Snacks': 'Cafe',
  'Pasta': 'Cafe',
  'Beverages': 'Cafe',
  'South Indian': 'South India',
  'Tandoor Starter': 'Indian Curry',
  'Veg Starter': 'Indian Curry',
  'Indian Veg': 'Indian Curry',
  'Chinese': 'Chinese',
  'Main Course': 'Indian Curry',
  'Mandi/Biryani': 'Biryani',
  'Non-Veg': 'Indian Curry',
  'Veg': 'Indian Curry'
};

async function mapCategories() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';
  console.log('Connecting to:', uri);
  await mongoose.connect(uri);
  console.log('Connected to DB');

  const Dish = mongoose.models.Dish || mongoose.model('Dish', DishSchema);
  const Sop = mongoose.models.Sop || mongoose.model('Sop', SopSchema);

  try {
    for (const [oldCat, newCat] of Object.entries(categoryMap)) {
      const dishRes = await Dish.updateMany({ category: oldCat }, { $set: { category: newCat } });
      console.log(`Mapped Dish: ${oldCat} -> ${newCat} (${dishRes.modifiedCount} updated)`);
      
      const sopRes = await Sop.updateMany({ category: oldCat }, { $set: { category: newCat } });
      console.log(`Mapped SOP: ${oldCat} -> ${newCat} (${sopRes.modifiedCount} updated)`);
    }
    
    const allowed = ['Cafe', 'Chinese', 'Biryani', 'Mandi', 'South India', 'Indian Curry', 'Discipline', 'Preparation'];
    
    const dishUnmapped = await Dish.updateMany(
      { category: { $nin: allowed } },
      { $set: { category: 'Cafe' } } 
    );
    console.log(`Mapped unmapped dishes to Cafe (${dishUnmapped.modifiedCount} updated)`);

  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

mapCategories();
