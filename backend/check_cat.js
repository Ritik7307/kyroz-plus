const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DishSchema = new mongoose.Schema({
  name: String,
  category: String,
  userId: String
}, { strict: false });

const Dish = mongoose.models.Dish || mongoose.model('Dish', DishSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const dishes = await Dish.find();
  console.log("Total dishes:", dishes.length);
  const categories = [...new Set(dishes.map(d => d.category))];
  console.log("Categories found:", categories);
  process.exit(0);
}
check();
