import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Recipe from './src/models/Recipe';
import Dish from './src/models/Dish';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const recentRecipes = await Recipe.find({ targetModel: 'Dish' })
      .sort({ updatedAt: -1 })
      .limit(20)
      .populate('targetId');
    console.log(JSON.stringify(recentRecipes, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
run();
