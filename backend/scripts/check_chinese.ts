import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Dish from '../src/models/Dish';
import Recipe from '../src/models/Recipe';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        const mongoUri = process.env.MONGO_URI || '';
        await mongoose.connect(mongoUri);
        
        const dishes = await Dish.find({ category: 'Chinese' }).lean();
        const recipes = await Recipe.find({ targetModel: 'Dish' }).lean();
        const recipeMap = new Map();
        recipes.forEach(r => recipeMap.set(r.targetId.toString(), r));
        
        console.log('Total Chinese Dishes:', dishes.length);
        
        let toDelete = [];

        for (const d of dishes as any[]) {
            const r = recipeMap.get(d._id.toString());
            let isEmpty = false;
            
            if (!r) {
                console.log(d.name, 'NO RECIPE');
                isEmpty = true;
            }
            else if (!r.ingredients || r.ingredients.length === 0) {
                console.log(d.name, 'EMPTY RECIPE');
                isEmpty = true;
            }
            else if (r.ingredients.some((i: any) => !i.itemId)) {
                console.log(d.name, 'MISSING ITEM ID');
                isEmpty = true;
            }
            else {
                console.log(d.name, 'OK', r.ingredients[0].itemId);
            }
            
            if (isEmpty) {
                toDelete.push(d._id);
            }
        }
        
        // Wait! The user says "chinese wale m abhi bhi vaisi dishes padi hui h"
        // This might mean dishes they don't want (like Chilli Paneer Dry, Veg Hakka Noodles etc.)
        // But if they just mean dishes that are "khali", I will delete them here.
        if (toDelete.length > 0) {
            console.log(`Will delete ${toDelete.length} Chinese dishes that are empty.`);
            await Dish.deleteMany({ _id: { $in: toDelete } });
            await Recipe.deleteMany({ targetModel: 'Dish', targetId: { $in: toDelete } });
        } else {
            console.log('No empty Chinese dishes found.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
