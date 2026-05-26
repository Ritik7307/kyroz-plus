require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';
console.log('Connecting to MONGO_URI from env...');

async function checkDb() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', mongoose.connection.name);

  // Load models dynamically to avoid typescript compilation
  const Dish = mongoose.model('Dish', new mongoose.Schema({}, { strict: false }));
  const Recipe = mongoose.model('Recipe', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const RawMaterial = mongoose.model('RawMaterial', new mongoose.Schema({}, { strict: false }));
  const SemiFinishedGood = mongoose.model('SemiFinishedGood', new mongoose.Schema({}, { strict: false }));

  const users = await User.find({}, 'email username role');
  console.log('\n--- USERS IN DATABASE ---');
  console.log(users);

  const dishes = await Dish.find({});
  console.log(`\n--- DISHES IN DATABASE (Count: ${dishes.length}) ---`);
  for (const d of dishes) {
    const recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: d._id });
    console.log(`Dish: "${d.name}" | ID: ${d._id} | User: ${d.userId} | Category: ${d.category} | Has Recipe: ${!!recipe} (${recipe ? recipe.ingredients.length : 0} ingredients)`);
  }

  const sfgs = await SemiFinishedGood.find({});
  console.log(`\n--- SEMI-FINISHED GOODS IN DATABASE (Count: ${sfgs.length}) ---`);
  for (const sfg of sfgs) {
    const recipe = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: sfg._id });
    console.log(`SFG: "${sfg.name}" | ID: ${sfg._id} | Code: ${sfg.code} | User: ${sfg.userId} | Has Recipe: ${!!recipe} (${recipe ? recipe.ingredients.length : 0} ingredients)`);
  }

  const rms = await RawMaterial.find({});
  console.log(`\n--- RAW MATERIALS IN DATABASE (Count: ${rms.length}) ---`);
  for (const rm of rms.slice(0, 15)) {
    console.log(`RM: "${rm.name}" | Code: ${rm.code} | User: ${rm.userId} | Price: ${rm.costPerPurchaseUnit}`);
  }
  if (rms.length > 15) {
    console.log(`... and ${rms.length - 15} more raw materials`);
  }

  await mongoose.disconnect();
}

checkDb().catch(console.error);
