import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import RawMaterial from '../src/models/RawMaterial';
import SemiFinishedGood from '../src/models/SemiFinishedGood';
import Packaging from '../src/models/Packaging';
import Dish from '../src/models/Dish';
import Recipe from '../src/models/Recipe';
import Inventory from '../src/models/Inventory';
import User from '../src/models/User';

const CHINESE_CATEGORY = 'Chinese';

const rawMaterialsData = [
  // American Chopsuey
  { code: 'RM001_AC', name: 'Z-105 TANGY COAT Premix', unit: 'kg' },
  { code: 'RM002_AC', name: 'Master Sweet & Sour Gravy (Liquid)', unit: 'L' },
  { code: 'RM003_AC', name: 'Crispy Fried Noodle Nest', unit: 'pcs' },
  { code: 'RM004_AC', name: 'Mixed Vegetables', unit: 'kg' },
  { code: 'RM005_AC', name: 'Tomato Ketchup', unit: 'L' },
  { code: 'RM006_AC', name: 'Cornflour Slurry', unit: 'L' },
  { code: 'RM007_AC', name: 'Pineapple Pieces', unit: 'kg' },
  { code: 'RM008_AC', name: 'Egg Bullseye / Boiled Egg', unit: 'pcs' },
  { code: 'RM009_AC', name: 'Refined Oil', unit: 'L' },
  
  // Chilli System
  { code: 'RM001_CH', name: 'Z-102 CRYSTAL GLAZE Premix', unit: 'kg' },
  { code: 'RM002_CH', name: 'Master Chilli Liquid Base', unit: 'L' },
  { code: 'RM003_CH', name: 'Fried Paneer / Chicken / Soya', unit: 'kg' },
  { code: 'RM004_CH', name: 'Capsicum Cubes', unit: 'kg' },
  { code: 'RM005_CH', name: 'Onion Cubes', unit: 'kg' },
  { code: 'RM008_CH', name: 'Slit Green Chilli', unit: 'kg' },
  { code: 'RM009_CH', name: 'Spring Onion', unit: 'kg' },

  // Manchurian
  { code: 'RM001_MN', name: 'Z-101 DARK MASTER Premix', unit: 'kg' },
  { code: 'RM002_MN', name: 'Master Manchurian Liquid Base', unit: 'L' },
  { code: 'RM003_MN', name: 'Fried Manchurian Balls', unit: 'kg' },

  // Honey Chilli Potato
  { code: 'RM002_HCP', name: 'Double Fried Potato Fingers', unit: 'kg' },
  { code: 'RM004_HCP', name: 'Honey', unit: 'kg' },
  { code: 'RM007_HCP', name: 'Chopped Garlic', unit: 'kg' },
  { code: 'RM008_HCP', name: 'White Sesame', unit: 'kg' },
  { code: 'RM010_HCP', name: 'Water', unit: 'L' },

  // Soups
  { code: 'RM002_HS', name: 'Mixed Soup Vegetables', unit: 'kg' },
  { code: 'RM005_HS', name: 'Vinegar', unit: 'L' },
  { code: 'RM006_HS', name: 'Red Chilli Paste', unit: 'kg' },
  { code: 'RM005_MS', name: 'Fresh Garlic', unit: 'kg' },
  { code: 'RM006_MS', name: 'Fresh Ginger', unit: 'kg' },
  { code: 'RM007_MS', name: 'Coriander Stems', unit: 'kg' },
  { code: 'RM008_MS', name: 'Black Pepper', unit: 'kg' },
  { code: 'RM010_MS', name: 'Fried Noodles', unit: 'kg' },

  // Schezwan
  { code: 'RM001_SZ', name: 'Z-103 RED FIRE BATCH Powder', unit: 'kg' },
  { code: 'RM006_SZ', name: 'Boiled Rice / Noodles', unit: 'kg' },
  
  // Wok Dust
  { code: 'RM001_WK', name: 'Z-104 VOK DUST Powder', unit: 'kg' },
  { code: 'RM003_WK', name: 'Mixed Julienne Vegetables', unit: 'kg' },
  { code: 'RM008_WK', name: 'Butter', unit: 'kg' },
  { code: 'RM009_WK', name: 'Fried Chicken / Scrambled Egg', unit: 'kg' },
  
  // Crispy Fry (Z-106)
  { code: 'RM001_FRY', name: 'Z-106 ARMOUR BASE Powder', unit: 'kg' },
  { code: 'RM002_FRY', name: 'Egg', unit: 'pcs' },
  { code: 'RM004_FRY', name: 'Salt', unit: 'kg' },
  { code: 'RM005_FRY', name: 'Ginger Garlic Paste', unit: 'kg' },
  { code: 'RM006_FRY', name: 'White Pepper', unit: 'kg' },
  
  // Momos & Chutney (Z-107)
  { code: 'RM001_MO', name: 'Frozen Veg/Chicken Momos', unit: 'pcs' },
  { code: 'RM003_MO', name: 'Z-107 RUBY CONCENTRATE', unit: 'L' },
  { code: 'RM004_MO', name: 'Mayonnaise', unit: 'L' },
  { code: 'RM005_MO', name: 'Cornflakes', unit: 'kg' },
  
  // Oils
  { code: 'RM002_CO', name: 'Teja Chilli Flakes', unit: 'kg' },
  { code: 'RM003_CO', name: 'Kashmiri Chilli Powder', unit: 'kg' },
  { code: 'RM004_CO', name: 'Star Anise', unit: 'kg' },
  { code: 'RM005_CO', name: 'Cinnamon', unit: 'kg' },
];

const sfgData = [
  { code: 'SFG001_AC', name: 'Master Sweet & Sour Gravy', batchYield: 5, yieldUnit: 'L' },
  { code: 'SFG002_AC', name: 'Crispy Noodle Nest', batchYield: 50, yieldUnit: 'pcs' },
  { code: 'SFG001_CH', name: 'Master Chilli Liquid Base', batchYield: 5, yieldUnit: 'L' },
  { code: 'SFG002_CH', name: 'Fried Protein (Paneer/Chicken/Soya)', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG001_MN', name: 'Master Manchurian Liquid Base', batchYield: 5, yieldUnit: 'L' },
  { code: 'SFG002_MN', name: 'Fried Manchurian Balls', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG001_HCP', name: 'Double Fried Potato', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG002_HCP', name: 'Honey Chilli Glaze Base', batchYield: 5, yieldUnit: 'L' },
  { code: 'SFG001_HS', name: 'Z-102 Soup Base', batchYield: 5, yieldUnit: 'L' },
  { code: 'SFG002_HS', name: 'Mixed Soup Vegetables', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG001_MS', name: 'Z-101 Soup Base', batchYield: 5, yieldUnit: 'L' },
  { code: 'SFG003_MS', name: 'Fried Soup Noodles', batchYield: 2, yieldUnit: 'kg' },
  { code: 'SFG001_CO', name: 'F-301 Master Chilli Oil', batchYield: 1, yieldUnit: 'L' },
  { code: 'SFG001_GO', name: 'F-302 Master Garlic Oil', batchYield: 0.5, yieldUnit: 'L' },
  { code: 'SFG001_MO', name: 'Prepared Ruby Sauce', batchYield: 1, yieldUnit: 'L' },
  { code: 'SFG002_MO', name: 'Prepared Z-106 Batter', batchYield: 1, yieldUnit: 'kg' },
  { code: 'SFG001_SZ', name: 'Master Schezwan Paste', batchYield: 1, yieldUnit: 'L' },
  { code: 'SFG002_SZ', name: 'Boiled Rice / Noodles (80%)', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG002_FRY', name: 'Pre-marinated Protein', batchYield: 5, yieldUnit: 'kg' },
];

const packagingData = [
  { code: 'PKG001_CH', name: 'Chinese Bowl/Container', unit: 'pc' },
  { code: 'PKG002_CH', name: 'Lid', unit: 'pc' },
  { code: 'PKG003_CH', name: 'Carry Bag', unit: 'pc' },
  { code: 'PKG001_SP', name: 'Soup Bowl', unit: 'pc' },
  { code: 'PKG002_SP', name: 'Soup Lid', unit: 'pc' },
  { code: 'PKG001_BX', name: 'Starter Box/Bowl', unit: 'pc' },
];

const dishesData = [
  {
    name: 'American Chopsuey',
    price: 250,
    recipe: [
      { name: 'Master Sweet & Sour Gravy', type: 'SFG', qty: 350, unit: 'ml' },
      { name: 'Mixed Vegetables', type: 'RM', qty: 120, unit: 'gm' },
      { name: 'Crispy Noodle Nest', type: 'SFG', qty: 1, unit: 'pcs' },
      { name: 'Tomato Ketchup', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Cornflour Slurry', type: 'RM', qty: 45, unit: 'ml' },
      { name: 'Pineapple Pieces', type: 'RM', qty: 20, unit: 'gm' },
      { name: 'Egg Bullseye / Boiled Egg', type: 'RM', qty: 1, unit: 'pcs' },
      { name: 'Refined Oil', type: 'RM', qty: 20, unit: 'ml' },
    ]
  },
  {
    name: 'Chilli Paneer (Dry)',
    price: 220,
    recipe: [
      { name: 'Master Chilli Liquid Base', type: 'SFG', qty: 100, unit: 'ml' },
      { name: 'Fried Protein (Paneer/Chicken/Soya)', type: 'SFG', qty: 180, unit: 'gm' },
      { name: 'Capsicum Cubes', type: 'RM', qty: 50, unit: 'gm' },
      { name: 'Onion Cubes', type: 'RM', qty: 50, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Slit Green Chilli', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
    ]
  },
  {
    name: 'Chilli Paneer (Gravy)',
    price: 240,
    recipe: [
      { name: 'Master Chilli Liquid Base', type: 'SFG', qty: 300, unit: 'ml' },
      { name: 'Cornflour Slurry', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Fried Protein (Paneer/Chicken/Soya)', type: 'SFG', qty: 180, unit: 'gm' },
      { name: 'Capsicum Cubes', type: 'RM', qty: 50, unit: 'gm' },
      { name: 'Onion Cubes', type: 'RM', qty: 50, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Slit Green Chilli', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
    ]
  },
  {
    name: 'Veg Manchurian (Dry)',
    price: 200,
    recipe: [
      { name: 'Master Manchurian Liquid Base', type: 'SFG', qty: 100, unit: 'ml' },
      { name: 'Cornflour Slurry', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Fried Manchurian Balls', type: 'SFG', qty: 180, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
    ]
  },
  {
    name: 'Veg Manchurian (Gravy)',
    price: 220,
    recipe: [
      { name: 'Master Manchurian Liquid Base', type: 'SFG', qty: 275, unit: 'ml' },
      { name: 'Cornflour Slurry', type: 'RM', qty: 45, unit: 'ml' },
      { name: 'Fried Manchurian Balls', type: 'SFG', qty: 180, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
    ]
  },
  {
    name: 'Honey Chilli Potato',
    price: 190,
    recipe: [
      { name: 'Double Fried Potato', type: 'SFG', qty: 180, unit: 'gm' },
      { name: 'Honey Chilli Glaze Base', type: 'SFG', qty: 120, unit: 'ml' },
      { name: 'Tomato Ketchup', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Honey', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Cornflour Slurry', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Chopped Garlic', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'White Sesame', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
    ]
  },
  {
    name: 'Hot & Sour Soup',
    price: 150,
    recipe: [
      { name: 'Z-102 Soup Base', type: 'SFG', qty: 120, unit: 'ml' },
      { name: 'Water', type: 'RM', qty: 180, unit: 'ml' },
      { name: 'Mixed Soup Vegetables', type: 'SFG', qty: 40, unit: 'gm' },
      { name: 'Cornflour Slurry', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Vinegar', type: 'RM', qty: 2.5, unit: 'ml' },
      { name: 'Red Chilli Paste', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 5, unit: 'ml' },
    ]
  },
  {
    name: 'Veg Manchow Soup',
    price: 160,
    recipe: [
      { name: 'Z-101 Soup Base', type: 'SFG', qty: 100, unit: 'ml' },
      { name: 'Water', type: 'RM', qty: 200, unit: 'ml' },
      { name: 'Mixed Soup Vegetables', type: 'SFG', qty: 40, unit: 'gm' },
      { name: 'Cornflour Slurry', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Fresh Garlic', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Fresh Ginger', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Coriander Stems', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Black Pepper', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Vinegar', type: 'RM', qty: 1, unit: 'ml' },
      { name: 'Fried Soup Noodles', type: 'SFG', qty: 10, unit: 'gm' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 5, unit: 'ml' },
    ]
  },
  {
    name: 'Veg Hakka Noodles',
    price: 180,
    recipe: [
      { name: 'Boiled Rice / Noodles (80%)', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Mixed Julienne Vegetables', type: 'RM', qty: 60, unit: 'gm' },
      { name: 'Fresh Garlic', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Z-104 VOK DUST Powder', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Vinegar', type: 'RM', qty: 5, unit: 'ml' },
      { name: 'Refined Oil', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Butter', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Spring Onion', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'F-302 Master Garlic Oil', type: 'SFG', qty: 15, unit: 'ml' },
    ]
  },
  {
    name: 'Veg Schezwan Fried Rice',
    price: 200,
    recipe: [
      { name: 'Boiled Rice / Noodles (80%)', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Master Schezwan Paste', type: 'SFG', qty: 15, unit: 'ml' },
      { name: 'Mixed Vegetables', type: 'RM', qty: 60, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'F-301 Master Chilli Oil', type: 'SFG', qty: 5, unit: 'ml' },
    ]
  },
  {
    name: 'Veg Steamed Momos',
    price: 120,
    recipe: [
      { name: 'Frozen Veg/Chicken Momos', type: 'RM', qty: 6, unit: 'pcs' },
      { name: 'Prepared Ruby Sauce', type: 'SFG', qty: 30, unit: 'ml' },
      { name: 'F-302 Master Garlic Oil', type: 'SFG', qty: 2.5, unit: 'ml' },
    ]
  },
  {
    name: 'Veg Fried Momos',
    price: 140,
    recipe: [
      { name: 'Frozen Veg/Chicken Momos', type: 'RM', qty: 6, unit: 'pcs' },
      { name: 'Prepared Ruby Sauce', type: 'SFG', qty: 30, unit: 'ml' },
      { name: 'Mayonnaise', type: 'RM', qty: 20, unit: 'ml' },
    ]
  },
  {
    name: 'Veg Kurkure Momos',
    price: 160,
    recipe: [
      { name: 'Frozen Veg/Chicken Momos', type: 'RM', qty: 6, unit: 'pcs' },
      { name: 'Prepared Z-106 Batter', type: 'SFG', qty: 25, unit: 'gm' },
      { name: 'Cornflakes', type: 'RM', qty: 20, unit: 'gm' },
      { name: 'Prepared Ruby Sauce', type: 'SFG', qty: 30, unit: 'ml' },
    ]
  }
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    if (users.length === 0) {
      throw new Error('No user found in the database to link inventory to.');
    }
    
    for (const user of users) {
      const userId = user._id;
      console.log(`\n--- Seeding for User ID: ${userId} (${user.email}) ---`);

      const rmMap = new Map();
      const sfgMap = new Map();
      const pkgMap = new Map();

      // 1. Raw Materials
      for (const rm of rawMaterialsData) {
        let existing = await RawMaterial.findOne({ name: rm.name, userId });
        if (!existing) {
          existing = await RawMaterial.create({
            code: rm.code,
            name: rm.name,
            purchaseUnit: rm.unit,
            consumptionUnit: rm.unit,
            category: CHINESE_CATEGORY,
            currentStock: 100,
            costPerPurchaseUnit: 0,
            userId
          });
        }
        rmMap.set(rm.name, existing);
      }
      console.log(`Seeded ${rmMap.size} Raw Materials for ${user.email}`);

      // 2. SFGs
      for (const sfg of sfgData) {
        let existing = await SemiFinishedGood.findOne({ name: sfg.name, userId });
        if (!existing) {
          existing = await SemiFinishedGood.create({
            code: sfg.code,
            name: sfg.name,
            batchYield: sfg.batchYield,
            yieldUnit: sfg.yieldUnit,
            currentStock: 50,
            costPerUnit: 0,
            userId
          });
        }
        sfgMap.set(sfg.name, existing);
      }
      console.log(`Seeded ${sfgMap.size} SFGs for ${user.email}`);

      // 3. Packaging
      for (const pkg of packagingData) {
        let existing = await Packaging.findOne({ name: pkg.name, userId });
        if (!existing) {
          existing = await Packaging.create({
            code: pkg.code,
            name: pkg.name,
            unit: pkg.unit,
            currentStock: 500,
            costPerUnit: 0,
            userId
          });
        }
        pkgMap.set(pkg.name, existing);
      }
      console.log(`Seeded ${pkgMap.size} Packaging items for ${user.email}`);

      // 4. Dishes & Recipes
      const defaultPkgs = [pkgMap.get('Chinese Bowl/Container')?._id].filter(Boolean);

      for (const d of dishesData) {
        let dish = await Dish.findOne({ name: d.name, userId });
        if (!dish) {
          dish = await Dish.create({
            name: d.name,
            price: d.price,
            category: CHINESE_CATEGORY,
            ingredientPrice: 0,
            packagingLogic: {
              dineIn: [],
              takeaway: defaultPkgs,
              delivery: defaultPkgs
            },
            userId
          });

          // Create Inventory tracker
          await Inventory.create({
            dishId: dish._id,
            platesPerPacket: 10,
            totalPlates: 100,
            userId
          });
        }

        // Create Recipe
        let recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dish._id, userId });
        if (recipe) {
          await Recipe.deleteOne({ _id: recipe._id });
        }

        const ingredients = d.recipe.map(r => {
          let itemId;
          let itemModel;
          
          if (r.type === 'RM') {
            itemId = rmMap.get(r.name)?._id;
            itemModel = 'RawMaterial';
          } else if (r.type === 'SFG') {
            itemId = sfgMap.get(r.name)?._id;
            itemModel = 'SemiFinishedGood';
          }

          let qty = r.qty;
          if (r.unit === 'ml' || r.unit === 'gm') {
            const rmInfo = rmMap.get(r.name);
            const sfgInfo = sfgMap.get(r.name);
            
            if (rmInfo && rmInfo.consumptionUnit === 'L' && r.unit === 'ml') qty = qty / 1000;
            if (rmInfo && rmInfo.consumptionUnit === 'kg' && r.unit === 'gm') qty = qty / 1000;
            
            if (sfgInfo && sfgInfo.yieldUnit === 'L' && r.unit === 'ml') qty = qty / 1000;
            if (sfgInfo && sfgInfo.yieldUnit === 'kg' && r.unit === 'gm') qty = qty / 1000;
          }

          return {
            itemModel,
            itemId,
            quantity: qty
          };
        }).filter(i => i.itemId);

        const packagingItems = defaultPkgs.map(id => ({
          itemModel: 'Packaging',
          itemId: id,
          quantity: 1
        }));

        await Recipe.create({
          targetModel: 'Dish',
          targetId: dish._id,
          targetYield: 1,
          operationalYield: 1,
          ingredients: [...ingredients, ...packagingItems],
          userId
        });
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
