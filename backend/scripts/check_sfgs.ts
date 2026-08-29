import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Dish from '../src/models/Dish';
import Recipe from '../src/models/Recipe';
import SemiFinishedGood from '../src/models/SemiFinishedGood';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        
        const allRecipes = await Recipe.find({}).lean();
        
        let emptySfgs = [];
        for (const recipe of allRecipes) {
            if (recipe.targetModel === 'SemiFinishedGood') {
                if (!recipe.ingredients || recipe.ingredients.length === 0) {
                    emptySfgs.push(recipe.targetId);
                } else if (recipe.ingredients.some((i: any) => !i.itemId)) {
                    emptySfgs.push(recipe.targetId);
                }
            }
        }
        
        console.log(`Found ${emptySfgs.length} SFGs with empty/invalid recipes.`);
        
        for (const id of emptySfgs) {
            const sfg = await SemiFinishedGood.findById(id).lean() as any;
            if (sfg) {
                console.log(`SFG with empty recipe: ${sfg.name} (${sfg.code})`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
