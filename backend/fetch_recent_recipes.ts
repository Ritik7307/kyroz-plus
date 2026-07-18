import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
import Recipe from './src/models/Recipe';
import Dish from './src/models/Dish';
import SemiFinishedGood from './src/models/SemiFinishedGood';

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log('Connecting to Live Database to fetch your recently updated recipes...');
    await mongoose.connect(mongoUri as string);
    
    // Get recipes updated in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRecipes = await Recipe.find({ updatedAt: { $gte: sevenDaysAgo } }).populate('targetId');
    const recentSFGs = await SemiFinishedGood.find({ updatedAt: { $gte: sevenDaysAgo } });
    const recentDishes = await Dish.find({ updatedAt: { $gte: sevenDaysAgo } });

    const exportData = {
      exportedAt: new Date().toISOString(),
      updatedRecipes: recentRecipes,
      updatedSFGs: recentSFGs,
      updatedDishes: recentDishes
    };

    const filePath = path.join(__dirname, 'recent_updates.json');
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    
    console.log(`\nSUCCESS! Saved your recent system updates to: ${filePath}`);
    console.log(`Please open the file 'backend/recent_updates.json', copy its contents (or a portion of it), and paste it into our chat so I can update the codebase's seeder!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to fetch recipes from database:', error);
    process.exit(1);
  }
};

run();
