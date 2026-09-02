import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dish from './src/models/Dish';
import Recipe from './src/models/Recipe';
import Inventory from './src/models/Inventory';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB');

    const allDishes = await Dish.find({}).lean();
    console.log(`Total dishes found: ${allDishes.length}`);

    // Group dishes by userId and normalized name
    const groupedDishes = new Map<string, any[]>();
    for (const dish of allDishes) {
      if (!dish.name || !dish.userId) continue;
      const key = `${dish.userId.toString()}_${dish.name.trim().toLowerCase()}`;
      if (!groupedDishes.has(key)) {
        groupedDishes.set(key, []);
      }
      groupedDishes.get(key)!.push(dish);
    }

    let deletedDishCount = 0;
    let deletedRecipeCount = 0;
    let deletedInventoryCount = 0;

    for (const [key, group] of groupedDishes.entries()) {
      if (group.length > 1) {
        // Sort by creation time (using _id)
        group.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));
        
        // Keep the first one, delete the rest
        const toKeep = group[0];
        const toDelete = group.slice(1);
        
        console.log(`Found ${toDelete.length} duplicates for dish: "${toKeep.name}". Keeping original ID: ${toKeep._id}`);
        
        for (const dish of toDelete) {
          await Dish.findByIdAndDelete(dish._id);
          deletedDishCount++;
          
          // Delete associated recipe
          const recRes = await Recipe.deleteMany({ targetModel: 'Dish', targetId: dish._id });
          deletedRecipeCount += recRes.deletedCount || 0;
          
          // Delete associated inventory
          const invRes = await Inventory.deleteMany({ dishId: dish._id });
          deletedInventoryCount += invRes.deletedCount || 0;
        }
      }
    }

    console.log(`\nCleanup Complete!`);
    console.log(`Removed ${deletedDishCount} duplicate dishes.`);
    console.log(`Removed ${deletedRecipeCount} orphaned recipes.`);
    console.log(`Removed ${deletedInventoryCount} orphaned inventory records.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
