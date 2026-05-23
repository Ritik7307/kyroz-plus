const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';

// Load models
const RawMaterial = require('./dist/models/RawMaterial').default || require('./dist/models/RawMaterial');
const SemiFinishedGood = require('./dist/models/SemiFinishedGood').default || require('./dist/models/SemiFinishedGood');
const Premix = require('./dist/models/Premix').default || require('./dist/models/Premix');
const Packaging = require('./dist/models/Packaging').default || require('./dist/models/Packaging');
const Recipe = require('./dist/models/Recipe').default || require('./dist/models/Recipe');
const Dish = require('./dist/models/Dish').default || require('./dist/models/Dish');
const Inventory = require('./dist/models/Inventory').default || require('./dist/models/Inventory');

async function dump() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const dishes = await mongoose.model('Dish').find();
  console.log('--- DISHES ---');
  dishes.forEach(d => console.log(d.name, d._id));

  const recipes = await mongoose.model('Recipe').find();
  console.log('--- RECIPES ---');
  for (const r of recipes) {
    console.log(`Target: ${r.targetModel} (${r.targetId})`);
    for (const ing of r.ingredients) {
      console.log(`  - ${ing.itemModel} ${ing.itemId} Qty: ${ing.quantity}`);
    }
  }

  const rms = await mongoose.model('RawMaterial').find();
  console.log('--- RAW MATERIALS ---');
  rms.forEach(r => console.log(r.name, r._id, 'Stock:', r.currentStock));

  const sfgs = await mongoose.model('SemiFinishedGood').find();
  console.log('--- SFGs ---');
  sfgs.forEach(s => console.log(s.name, s._id, 'Stock:', s.currentStock));

  process.exit(0);
}

dump().catch(console.error);
