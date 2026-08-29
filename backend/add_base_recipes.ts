import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RawMaterial from './src/models/RawMaterial';
import SemiFinishedGood from './src/models/SemiFinishedGood';
import Recipe from './src/models/Recipe';
import Dish from './src/models/Dish';

dotenv.config({ path: '.env' });

const baseRecipes: Record<string, { name: string, qty: number, unit: string, cost: number }[]> = {
  // South Indian
  'SFG_DOSA_BATTER_S301': [
    { name: 'Rice', qty: 3000, unit: 'gm', cost: 60 },
    { name: 'Urad Dal', qty: 1000, unit: 'gm', cost: 120 },
    { name: 'Water', qty: 2000, unit: 'ml', cost: 0 }
  ],
  'SFG_IDLI_BATTER_S305': [
    { name: 'Rice', qty: 2000, unit: 'gm', cost: 60 },
    { name: 'Urad Dal', qty: 1000, unit: 'gm', cost: 120 },
    { name: 'Water', qty: 1000, unit: 'ml', cost: 0 }
  ],
  'SFG_VADA_BATTER_S304': [
    { name: 'Urad Dal', qty: 1000, unit: 'gm', cost: 120 },
    { name: 'Water', qty: 500, unit: 'ml', cost: 0 }
  ],
  'SFG_SAMBHAR_S308': [
    { name: 'Toor Dal', qty: 1000, unit: 'gm', cost: 130 },
    { name: 'Tamarind', qty: 200, unit: 'gm', cost: 200 },
    { name: 'Sambar Powder', qty: 100, unit: 'gm', cost: 300 },
    { name: 'Water', qty: 3000, unit: 'ml', cost: 0 }
  ],
  'SFG_COCONUT_CHUTNEY_S307': [
    { name: 'Fresh Coconut', qty: 1000, unit: 'gm', cost: 100 },
    { name: 'Green Chilli', qty: 100, unit: 'gm', cost: 80 },
    { name: 'Curd', qty: 200, unit: 'gm', cost: 60 }
  ],
  'SFG_RED_CHUTNEY_S306': [
    { name: 'Tomato', qty: 1000, unit: 'gm', cost: 40 },
    { name: 'Onion', qty: 500, unit: 'gm', cost: 30 },
    { name: 'Dry Red Chilli', qty: 50, unit: 'gm', cost: 200 }
  ],
  'SFG_ALOO_MASALA_S302': [
    { name: 'Potato', qty: 1000, unit: 'gm', cost: 30 },
    { name: 'Onion', qty: 500, unit: 'gm', cost: 30 },
    { name: 'Green Chilli', qty: 50, unit: 'gm', cost: 80 },
    { name: 'Oil', qty: 100, unit: 'ml', cost: 150 }
  ],
  
  // Chinese
  'CHILLI_SFG001': [
    { name: 'Dry Red Chilli', qty: 500, unit: 'gm', cost: 200 },
    { name: 'Garlic', qty: 500, unit: 'gm', cost: 120 },
    { name: 'Refined Oil', qty: 500, unit: 'ml', cost: 120 }
  ],
  'MANCHURIAN_SFG001': [
    { name: 'Soy Sauce', qty: 500, unit: 'ml', cost: 80 },
    { name: 'Dark Soy Sauce', qty: 200, unit: 'ml', cost: 100 },
    { name: 'Garlic', qty: 500, unit: 'gm', cost: 120 },
    { name: 'Fresh Coriander', qty: 200, unit: 'gm', cost: 60 }
  ],
  'HOTSOUR_SFG001': [
    { name: 'Vinegar', qty: 500, unit: 'ml', cost: 50 },
    { name: 'Dark Soy Sauce', qty: 200, unit: 'ml', cost: 100 },
    { name: 'Garlic', qty: 500, unit: 'gm', cost: 120 },
    { name: 'Ginger', qty: 500, unit: 'gm', cost: 100 }
  ],
  'MOMOS_SFG001': [
    { name: 'Cabbage', qty: 1000, unit: 'gm', cost: 30 },
    { name: 'Carrot', qty: 500, unit: 'gm', cost: 40 },
    { name: 'Onion', qty: 500, unit: 'gm', cost: 30 },
    { name: 'Garlic', qty: 100, unit: 'gm', cost: 120 }
  ]
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const user = await (mongoose.connection.db as any).collection('users').findOne({ email: 'vijayshankarprajapati29@gmail.com' });
  const userId = user!._id;

  for (const [sfgCode, ingredients] of Object.entries(baseRecipes)) {
    const sfg = await SemiFinishedGood.findOne({ code: sfgCode, userId });
    if (!sfg) {
      console.log(`SFG ${sfgCode} not found`);
      continue;
    }

    const mappedIngredients = [];
    let totalCost = 0;

    for (const ing of ingredients) {
      let rm = await RawMaterial.findOne({ name: ing.name, userId });
      if (!rm) {
        rm = new RawMaterial({
          name: ing.name,
          category: 'Vegetable',
          purchaseUnit: 'kg',
          consumptionUnit: 'gm',
          conversionFactor: 1000,
          currentStock: 10000,
          costPerPurchaseUnit: ing.cost,
          userId,
          code: "RM_GEN_" + Math.floor(Math.random()*10000) + "_" + Date.now()
        });
        await rm.save();
      }

      mappedIngredients.push({
        itemModel: 'RawMaterial',
        itemId: rm._id,
        quantity: ing.qty
      });
      
      const costPerUnit = rm.costPerPurchaseUnit / rm.conversionFactor;
      totalCost += costPerUnit * ing.qty;
    }

    const recipe = await Recipe.findOneAndUpdate(
      { targetModel: 'SemiFinishedGood', targetId: sfg._id, userId },
      { $set: { ingredients: mappedIngredients } },
      { upsert: true, new: true }
    );
    
    // Update SFG costPerUnit
    sfg.costPerUnit = totalCost / (sfg.batchYield || 1000);
    await sfg.save();

    console.log(`Updated recipe for ${sfgCode} with ${mappedIngredients.length} ingredients. New Cost/Unit: ${sfg.costPerUnit}`);
  }

  // Check if Chinese dishes exist. If not, re-inject them.
  const chineseDishes = await Dish.find({ userId, category: 'Chinese' });
  if (chineseDishes.length === 0) {
      console.log("No Chinese dishes found! User must re-inject them from frontend.");
  }

  await mongoose.disconnect();
}
run().catch(console.error);
