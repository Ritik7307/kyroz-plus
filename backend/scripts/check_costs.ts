import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import RawMaterial from '../src/models/RawMaterial';
import Recipe from '../src/models/Recipe';
import Dish from '../src/models/Dish';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        
        const rms = await RawMaterial.find({}).lean() as any[];
        let zeroCostRMs = rms.filter(r => !r.currentPrice || r.currentPrice === 0);
        console.log(`RMs with 0 cost: ${zeroCostRMs.length}`);

        // What if some dishes have empty recipes, despite my previous deletion?
        // Let's re-run the check over all dishes
        const allDishes = await Dish.find({}).lean() as any[];
        const allRecipes = await Recipe.find({ targetModel: 'Dish' }).lean();
        const recipeMap = new Map();
        allRecipes.forEach(r => recipeMap.set(r.targetId.toString(), r));
        
        let toDelete = [];
        for (const dish of allDishes) {
            const r = recipeMap.get(dish._id.toString());
            let isEmpty = false;
            if (!r) {
                isEmpty = true;
            } else if (!r.ingredients || r.ingredients.length === 0) {
                isEmpty = true;
            } else if (r.ingredients.some((i: any) => !i.itemId)) {
                isEmpty = true;
            }
            if (isEmpty) {
                toDelete.push(dish._id);
                console.log(`Will delete empty dish: ${dish.name} (category: ${dish.category})`);
            }
        }
        
        if (toDelete.length > 0) {
             await Dish.deleteMany({ _id: { $in: toDelete } });
             await Recipe.deleteMany({ targetModel: 'Dish', targetId: { $in: toDelete } });
             console.log(`Deleted ${toDelete.length} empty dishes.`);
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
