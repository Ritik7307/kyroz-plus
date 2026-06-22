import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dish from './src/models/Dish';
import MenuItem from './src/models/MenuItem';
import SemiFinishedGood from './src/models/SemiFinishedGood';
import PreparationMaster from './src/models/PreparationMaster';
import Recipe from './src/models/Recipe';
import RawMaterial from './src/models/RawMaterial';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz');
  console.log('Connected to DB. Starting migration...');

  // Migrate SFG to PreparationMaster
  const sfgs = await SemiFinishedGood.find();
  for (const sfg of sfgs) {
    const existing = await PreparationMaster.findOne({ code: sfg.code, userId: sfg.userId });
    if (!existing) {
      await PreparationMaster.create({
        code: sfg.code,
        name: sfg.name,
        outputUnit: sfg.yieldUnit,
        currentStock: sfg.currentStock,
        costPerOutputUnit: sfg.costPerUnit,
        userId: sfg.userId
      });
      console.log(`Migrated SFG: ${sfg.name}`);
    }
  }

  // Migrate Dish to MenuItem
  const dishes = await Dish.find();
  for (const dish of dishes) {
    const existing = await MenuItem.findOne({ code: dish.code, userId: dish.userId });
    if (!existing) {
      const recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dish._id });
      let ingredients = [];
      if (recipe) {
        ingredients = recipe.ingredients.map((ing: any) => ({
          itemId: ing.itemId,
          itemModel: ing.itemModel === 'SemiFinishedGood' ? 'PreparationMaster' : ing.itemModel,
          defaultQuantity: ing.quantity,
          isEditable: true
        }));
      }

      await MenuItem.create({
        code: dish.code,
        name: dish.name,
        category: dish.category,
        sellingPrice: dish.price,
        ingredients: ingredients,
        userId: dish.userId
      });
      console.log(`Migrated Dish: ${dish.name}`);
    }
  }

  console.log('Migration completed.');
  process.exit(0);
}

migrate().catch(console.error);
