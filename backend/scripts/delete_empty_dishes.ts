import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import Dish from '../src/models/Dish';
import Recipe from '../src/models/Recipe';
import Sop from '../src/models/Sop';

async function main() {
    try {
        const mongoUri = process.env.MONGO_URI || '';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Find all dishes
        const allDishes = await Dish.find({}).select('_id name');
        console.log(`Found ${allDishes.length} dishes in total.`);

        // Find recipes that are NOT empty
        const validRecipes = await Recipe.find({ targetModel: 'Dish', 'ingredients.0': { $exists: true } }).select('targetId');
        const validDishIds = new Set(validRecipes.map(r => r.targetId.toString()));
        console.log(`Found ${validDishIds.size} valid dishes with recipes.`);

        const dishesToDelete = allDishes.filter(d => !validDishIds.has(d._id.toString()));
        console.log(`Will delete ${dishesToDelete.length} empty dishes.`);

        if (dishesToDelete.length > 0) {
            const idsToDelete = dishesToDelete.map(d => d._id);
            const dishDeleteRes = await Dish.deleteMany({ _id: { $in: idsToDelete } });
            const sopDeleteRes = await Sop.deleteMany({ dishId: { $in: idsToDelete } });
            const recipeDeleteRes = await Recipe.deleteMany({ targetModel: 'Dish', targetId: { $in: idsToDelete } });
            console.log(`Successfully deleted ${dishDeleteRes.deletedCount} empty dishes.`);
            console.log(`Successfully deleted ${sopDeleteRes.deletedCount} orphaned SOPs.`);
            console.log(`Successfully deleted ${recipeDeleteRes.deletedCount} empty recipes.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

main();
