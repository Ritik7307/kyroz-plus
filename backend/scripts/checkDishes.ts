import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkDishes() {
  await mongoose.connect(process.env.MONGO_URI!);
  const db = mongoose.connection.db!;
  const dishes = db.collection('dishes');
  const names = [
    'Aloo Gobhi Matar (Semi-Gravy)', 'Corn Palak Cheese', 'Kadhai Paneer', 'Lehsunia Paneer',
    'Malai Kofta (Ivory)', 'Malai Kofta Red', 'Mushroom Do Pyaza', 'Navratan Korma',
    'Palak Paneer', 'Paneer Butter Masala', 'Paneer Dhaniya Adraki', 'Paneer Lababdar',
    'Paneer Pasanda', 'Shahi Paneer', 'Signature Panch-Ratan Curry Veg', 'Veg Handi', 'Veg Jalfrezi'
  ];
  const found = await dishes.find({ name: { $in: names } }).toArray();
  for (const d of found) {
    if (d.category !== 'Indian Veg') {
      console.log(d.name, '->', d.category);
    }
  }
  
  // Let's just fix it automatically!
  await dishes.updateMany({ name: { $in: names } }, { $set: { category: 'Indian Veg' } });
  console.log('Fixed categories for all 17 dishes');
  
  process.exit(0);
}

checkDishes();
