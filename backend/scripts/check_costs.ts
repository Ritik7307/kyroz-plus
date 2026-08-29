import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import RawMaterial from '../src/models/RawMaterial';
import Recipe from '../src/models/Recipe';
import Dish from '../src/models/Dish';
import SemiFinishedGood from '../src/models/SemiFinishedGood';
import PreparationMaster from '../src/models/PreparationMaster';
import PortionMaster from '../src/models/PortionMaster';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        const db = mongoose.connection.db!;
        
        // Find all dishes and recipes
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
            } else {
                // Check if any ingredient is dangling (does not exist or belongs to a different user)
                let hasValidIngredient = false;
                for (const ing of r.ingredients) {
                    if (!ing.itemId) continue;
                    
                    try {
                        const id = new mongoose.Types.ObjectId(ing.itemId);
                        const userId = dish.userId; // The dish's owner
                        
                        let found = false;
                        if (ing.itemModel === 'RawMaterial') found = !!await db.collection('rawmaterials').findOne({ _id: id, userId });
                        else if (ing.itemModel === 'SemiFinishedGood') found = !!await db.collection('semifinishedgoods').findOne({ _id: id, userId });
                        else if (ing.itemModel === 'PreparationMaster') found = !!await db.collection('preparationmasters').findOne({ _id: id, userId });
                        else if (ing.itemModel === 'PortionMaster') found = !!await db.collection('portionmasters').findOne({ _id: id, userId });
                        
                        if (found) {
                            hasValidIngredient = true;
                        }
                    } catch (e) {
                        // Invalid ObjectId
                    }
                }
                if (!hasValidIngredient) {
                    isEmpty = true;
                }
            }
            
            if (isEmpty) {
                toDelete.push(dish._id);
                console.log(`Will delete empty dish: ${dish.name} (category: ${dish.category})`);
            }
        }
        
        if (toDelete.length > 0) {
             await Dish.deleteMany({ _id: { $in: toDelete } });
             await Recipe.deleteMany({ targetModel: 'Dish', targetId: { $in: toDelete } });
             console.log(`Deleted ${toDelete.length} empty/invalid dishes.`);
        } else {
             console.log('No empty/invalid dishes found to delete.');
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
