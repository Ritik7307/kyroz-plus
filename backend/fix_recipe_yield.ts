import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './src/models/Recipe';
import SemiFinishedGood from './src/models/SemiFinishedGood';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB');

    const sfgRecipes = await Recipe.find({ targetModel: 'SemiFinishedGood' });
    let updatedCount = 0;
    
    for (const recipe of sfgRecipes) {
      if (recipe.operationalYield === 1 || recipe.targetYield === 1) {
        const sfg = await SemiFinishedGood.findById(recipe.targetId);
        if (sfg && sfg.batchYield && sfg.batchYield > 1) {
          recipe.operationalYield = sfg.batchYield;
          recipe.targetYield = sfg.batchYield;
          await recipe.save();
          updatedCount++;
          console.log(`Updated Recipe for SFG ${sfg.name} to yield ${sfg.batchYield}`);
        }
      }
    }
    
    console.log(`Successfully updated ${updatedCount} recipes.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
