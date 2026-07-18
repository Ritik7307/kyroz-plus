const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Mongoose Models Setup
const RawMaterialSchema = new mongoose.Schema({
  name: String, costPerPurchaseUnit: Number, conversionFactor: Number
});
const RawMaterial = mongoose.models.RawMaterial || mongoose.model('RawMaterial', RawMaterialSchema);

const PrepMasterSchema = new mongoose.Schema({
  name: String, costPerOutputUnit: Number
});
const PreparationMaster = mongoose.models.PreparationMaster || mongoose.model('PreparationMaster', PrepMasterSchema);

const RecipeSchema = new mongoose.Schema({
  targetModel: String, targetId: mongoose.Schema.Types.ObjectId,
  operationalYield: Number,
  ingredients: [{ itemModel: String, itemId: mongoose.Schema.Types.ObjectId, quantity: Number }]
});
const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

const PortionSchema = new mongoose.Schema({
  name: String,
  ingredients: [{ sfgId: mongoose.Schema.Types.ObjectId, quantity: Number, unit: String }]
});
const PortionMaster = mongoose.models.PortionMaster || mongoose.model('PortionMaster', PortionSchema);

const DishSchema = new mongoose.Schema({
  name: String, ingredientPrice: Number
});
const Dish = mongoose.models.Dish || mongoose.model('Dish', DishSchema);


async function runTest() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // 1. Raw Materials
  const rmChicken = await RawMaterial.create({ name: 'Chicken', costPerPurchaseUnit: 250, conversionFactor: 1 });
  const rmRice = await RawMaterial.create({ name: 'Basmati Rice', costPerPurchaseUnit: 120, conversionFactor: 1 });
  const rmPremix = await RawMaterial.create({ name: 'B-401 Premix', costPerPurchaseUnit: 150, conversionFactor: 1 });

  // 2. SFG / Prep Master
  const sfgChicken = await PreparationMaster.create({ name: '80% Cooked Yakhni Chicken', costPerOutputUnit: 0 });
  const sfgRice = await PreparationMaster.create({ name: '70% Boiled Rice', costPerOutputUnit: 0 });

  // 2.1 Recipe for SFG Chicken (1kg yield)
  // Let's assume 1kg raw chicken + 0.1kg premix yields 0.8kg Yakhni Chicken
  await Recipe.create({
    targetModel: 'PreparationMaster',
    targetId: sfgChicken._id,
    operationalYield: 0.8,
    ingredients: [
      { itemModel: 'RawMaterial', itemId: rmChicken._id, quantity: 1 },
      { itemModel: 'RawMaterial', itemId: rmPremix._id, quantity: 0.1 }
    ]
  });

  // 2.2 Recipe for SFG Rice
  // 1kg raw rice yields 2.2kg boiled rice
  await Recipe.create({
    targetModel: 'PreparationMaster',
    targetId: sfgRice._id,
    operationalYield: 2.2,
    ingredients: [
      { itemModel: 'RawMaterial', itemId: rmRice._id, quantity: 1 }
    ]
  });

  // 3. Portion Master
  // PT002 Chicken Pieces (80gm) -> uses 0.08 kg of sfgChicken
  const ptChicken = await PortionMaster.create({
    name: 'Chicken Pieces 80gm',
    ingredients: [{ sfgId: sfgChicken._id, quantity: 0.08, unit: 'kg' }]
  });
  // PT003 Rice (270gm) -> uses 0.27 kg of sfgRice
  const ptRice = await PortionMaster.create({
    name: 'Rice 270gm',
    ingredients: [{ sfgId: sfgRice._id, quantity: 0.27, unit: 'kg' }]
  });

  // 4. Dish / Billing Deduction
  const biryaniDish = await Dish.create({ name: 'SHAHI LUCKNOWI BIRYANI', ingredientPrice: 0 });
  await Recipe.create({
    targetModel: 'Dish',
    targetId: biryaniDish._id,
    operationalYield: 1,
    ingredients: [
      { itemModel: 'PortionMaster', itemId: ptChicken._id, quantity: 1 },
      { itemModel: 'PortionMaster', itemId: ptRice._id, quantity: 1 }
    ]
  });

  console.log('Architecture setup complete.');
  
  // Clean up
  await RawMaterial.deleteMany({});
  await PreparationMaster.deleteMany({});
  await Recipe.deleteMany({});
  await PortionMaster.deleteMany({});
  await Dish.deleteMany({});
  
  await mongoose.disconnect();
  console.log('Test completed and cleaned up.');
}

runTest().catch(console.error);
