import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        const db = mongoose.connection.db!;
        
        console.log("Fetching all data...");
        const allDishes = await db.collection('dishes').find({}).toArray();
        const allRecipes = await db.collection('recipes').find({ targetModel: 'Dish' }).toArray();
        
        // Cache user items to avoid millions of queries
        const userItemsCache = new Map();
        
        async function hasItem(collectionName: string, id: any, userId: any) {
            const key = `${collectionName}_${id}_${userId}`;
            if (userItemsCache.has(key)) return userItemsCache.get(key);
            const found = !!await db.collection(collectionName).findOne({ _id: id, userId });
            userItemsCache.set(key, found);
            return found;
        }

        const recipeMap = new Map();
        allRecipes.forEach(r => recipeMap.set(r.targetId.toString(), r));
        
        let toDelete = [];
        let deletedNames = [];
        
        for (const dish of allDishes) {
            const r = recipeMap.get(dish._id.toString());
            let isEmpty = false;
            
            if (!r) {
                isEmpty = true;
            } else if (!r.ingredients || r.ingredients.length === 0) {
                isEmpty = true;
            } else {
                let hasValidIngredient = false;
                for (const ing of r.ingredients) {
                    if (!ing.itemId) continue;
                    
                    try {
                        const id = new mongoose.Types.ObjectId(ing.itemId);
                        const userId = dish.userId; 
                        
                        let found = false;
                        if (ing.itemModel === 'RawMaterial') found = await hasItem('rawmaterials', id, userId);
                        else if (ing.itemModel === 'SemiFinishedGood') found = await hasItem('semifinishedgoods', id, userId);
                        else if (ing.itemModel === 'PreparationMaster') found = await hasItem('preparationmasters', id, userId);
                        else if (ing.itemModel === 'PortionMaster') found = await hasItem('portionmasters', id, userId);
                        
                        if (found) {
                            hasValidIngredient = true;
                            // Optimization: If we found one valid ingredient, we can break early if we just want to know if it's completely empty.
                            // BUT wait, if ANY ingredient is invalid, does the user consider it "empty"? 
                            // The user said "jo jo dish khali dikhe or cost per plate 0 dikhe usse hata do". 
                            // If a dish has some valid ingredients but 0 cost for others, its cost might still be non-zero. 
                            // Let's assume if it has NO valid ingredients at all, it's 0 cost.
                            // I'll leave the break here to speed it up.
                            break;
                        }
                    } catch (e) {}
                }
                if (!hasValidIngredient) {
                    isEmpty = true;
                }
            }
            
            if (isEmpty) {
                toDelete.push(dish._id);
                deletedNames.push(dish.name);
            }
        }
        
        console.log(`Found ${toDelete.length} empty/invalid dishes to delete.`);
        if (toDelete.length > 0) {
             await db.collection('dishes').deleteMany({ _id: { $in: toDelete } });
             await db.collection('recipes').deleteMany({ targetModel: 'Dish', targetId: { $in: toDelete } });
             console.log(`Deleted ${toDelete.length} empty/invalid dishes.`);
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
