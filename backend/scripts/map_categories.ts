import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DishSchema = new mongoose.Schema({ name: String, category: String }, { strict: false });
const SopSchema = new mongoose.Schema({ name: String, category: String }, { strict: false });

const cleanCategories = ['Cafe', 'South Indian', 'Chinese', 'Tandoor', 'Biryani', 'Mandi', 'Indian Curry'];

async function mapCategories() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';
  console.log('Connecting to:', uri);
  await mongoose.connect(uri);
  console.log('Connected to DB');

  const Dish = mongoose.models.Dish || mongoose.model('Dish', DishSchema);
  const Sop = mongoose.models.Sop || mongoose.model('Sop', SopSchema);

  try {
    // 1. Rename any "South India" to "South Indian"
    await Dish.updateMany({ category: 'South India' }, { $set: { category: 'South Indian' } });
    await Sop.updateMany({ category: 'South India' }, { $set: { category: 'South Indian' } });

    // 2. Map "Tandoor Starter" and "Veg Starter" to "Tandoor"
    await Dish.updateMany({ category: { $in: ['Tandoor Starter', 'Veg Starter'] } }, { $set: { category: 'Tandoor' } });
    await Sop.updateMany({ category: { $in: ['Tandoor Starter', 'Veg Starter'] } }, { $set: { category: 'Tandoor' } });

    // 3. For "Main Course" category:
    // If the name has "Biryani" -> Map to "Biryani"
    // If the name has "Mandi" -> Map to "Mandi"
    // Otherwise -> Map to "Indian Curry"
    
    // We can do this in bulk via query mappings
    await Dish.updateMany({ category: 'Main Course', name: /biryani/i }, { $set: { category: 'Biryani' } });
    await Sop.updateMany({ category: 'Main Course', name: /biryani/i }, { $set: { category: 'Biryani' } });

    await Dish.updateMany({ category: 'Main Course', name: /mandi/i }, { $set: { category: 'Mandi' } });
    await Sop.updateMany({ category: 'Main Course', name: /mandi/i }, { $set: { category: 'Mandi' } });

    await Dish.updateMany({ category: 'Main Course' }, { $set: { category: 'Indian Curry' } });
    await Sop.updateMany({ category: 'Main Course' }, { $set: { category: 'Indian Curry' } });

    // 4. Any other category not in cleanCategories -> Map to "Indian Curry"
    await Dish.updateMany({ category: { $nin: cleanCategories } }, { $set: { category: 'Indian Curry' } });
    await Sop.updateMany({ category: { $nin: cleanCategories } }, { $set: { category: 'Indian Curry' } });

    console.log('Category mapping completed successfully!');

    // Verify final categories
    const finalCats = await Dish.distinct('category');
    console.log('Final Dish Categories in DB:', finalCats);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

mapCategories();
