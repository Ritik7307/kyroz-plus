import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

import Dish from '../src/models/Dish';
import Recipe from '../src/models/Recipe';
import Sop from '../src/models/Sop';

async function main() {
    try {
        const mongoUri = process.env.MONGO_URI || '';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Find all recipes
        const recipes = await Recipe.find({});
        console.log(`Found ${recipes.length} recipes in total.`);

        // Get targetIds from recipes
        const dishIdsWithRecipes = new Set(recipes.map(r => r.targetId.toString()));
        console.log(`Found ${dishIdsWithRecipes.size} unique dish/sfg IDs with recipes.`);

        // Find all dishes
        const allDishes = await Dish.find({});
        console.log(`Found ${allDishes.length} dishes in total.`);

        let deletedCount = 0;
        let deletedSopCount = 0;

        for (const dish of allDishes) {
            if (!dishIdsWithRecipes.has(dish._id.toString())) {
                console.log(`Deleting dish: ${dish.name}`);
                await Dish.deleteOne({ _id: dish._id });
                deletedCount++;
                
                // Delete corresponding SOP if it exists
                const sopDeleteResult = await Sop.deleteMany({ dishId: dish._id });
                deletedSopCount += sopDeleteResult.deletedCount;
            }
        }

        console.log(`Successfully deleted ${deletedCount} empty dishes.`);
        console.log(`Successfully deleted ${deletedSopCount} orphaned SOPs.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

main();
