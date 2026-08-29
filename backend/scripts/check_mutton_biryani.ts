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
        
        const dish = await Dish.findOne({ name: 'Mutton Biryani' }).lean() as any;
        console.log('Dish:', dish);
        if (dish) {
            const recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dish._id }).lean() as any;
            console.log('Recipe:', JSON.stringify(recipe, null, 2));
            if (recipe && recipe.ingredients) {
                 for (const ing of recipe.ingredients as any[]) {
                      console.log('Ingredient itemId:', ing.itemId);
                      const sfg = await SemiFinishedGood.findById(ing.itemId);
                      console.log('Found SFG?', sfg ? 'Yes ' + sfg.name : 'No');
                 }
            }
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
