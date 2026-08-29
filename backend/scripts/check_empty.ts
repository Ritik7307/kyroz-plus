import mongoose from 'mongoose';
import Dish from '../src/models/Dish';
import Recipe from '../src/models/Recipe';
import Sop from '../src/models/Sop';

async function main() {
    try {
        const mongoUri = 'mongodb+srv://vijayshankarprajapati29_db_user:chuphojabhai@cluster0.wf2za1x.mongodb.net/?appName=Cluster0';
        await mongoose.connect(mongoUri);
        
        const allDishes = await Dish.find({}).lean();
        const allRecipes = await Recipe.find({ targetModel: 'Dish' }).lean();
        
        const missingItemRecipes = await Recipe.find({ 'ingredients.itemId': { $exists: false } }).lean();
        const missingRecipeIds = new Set(missingItemRecipes.map(r => r.targetId.toString()));
        console.log('Recipes with missing itemId:', missingRecipeIds.size);

        const recipeMap = new Map();
        allRecipes.forEach(r => recipeMap.set(r.targetId.toString(), r));

        let emptyCount = 0;
        let toDelete: any[] = [];

        for (const dish of allDishes as any[]) {
            const r = recipeMap.get(dish._id.toString());
            let isEmpty = false;
            
            if (!r) {
                isEmpty = true;
            } else if (!r.ingredients || r.ingredients.length === 0) {
                isEmpty = true;
            } else if (missingRecipeIds.has(dish._id.toString())) {
                isEmpty = true;
            } else {
                const hasValidQty = r.ingredients.some((ing: any) => ing.quantity > 0);
                if (!hasValidQty) isEmpty = true;
            }

            if (isEmpty) {
                emptyCount++;
                toDelete.push(dish._id);
            }
        }
        
        console.log('Total empty dishes detected via script logic:', emptyCount);
        
        if (toDelete.length > 0) {
             await Dish.deleteMany({ _id: { $in: toDelete } });
             await Recipe.deleteMany({ targetModel: 'Dish', targetId: { $in: toDelete } });
             await Sop.deleteMany({ dishId: { $in: toDelete } });
             console.log('Deleted empty dishes successfully.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
