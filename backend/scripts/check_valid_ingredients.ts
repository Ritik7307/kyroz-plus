import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        const db = mongoose.connection.db!;

        const userIdStr = '69f84eb97a1102e857341078';
        const userId = new mongoose.Types.ObjectId(userIdStr);
        
        // Find all dishes for this user
        const dishes = await db.collection('dishes').find({ userId }).toArray();
        console.log(`User ${userIdStr} has ${dishes.length} dishes`);
        
        // Let's check how many have recipes
        const recipes = await db.collection('recipes').find({ 
            userId, 
            targetModel: 'Dish',
            targetId: { $in: dishes.map(d => d._id) }
        }).toArray();
        console.log(`User has ${recipes.length} dish recipes`);
        
        // Let's see how many recipe ingredients can actually be resolved
        let validIngredients = 0;
        let invalidIngredients = 0;
        
        for (const recipe of recipes) {
            for (const ing of (recipe.ingredients || [])) {
                let found = false;
                if (ing.itemModel === 'RawMaterial') {
                    found = !!await db.collection('rawmaterials').findOne({ _id: new mongoose.Types.ObjectId(ing.itemId), userId });
                } else if (ing.itemModel === 'SemiFinishedGood') {
                    found = !!await db.collection('semifinishedgoods').findOne({ _id: new mongoose.Types.ObjectId(ing.itemId), userId });
                } else if (ing.itemModel === 'PreparationMaster') {
                    found = !!await db.collection('preparationmasters').findOne({ _id: new mongoose.Types.ObjectId(ing.itemId), userId });
                } else if (ing.itemModel === 'PortionMaster') {
                    found = !!await db.collection('portionmasters').findOne({ _id: new mongoose.Types.ObjectId(ing.itemId), userId });
                }
                
                if (found) validIngredients++;
                else invalidIngredients++;
            }
        }
        console.log(`Valid ingredients (matches user): ${validIngredients}`);
        console.log(`Invalid ingredients (wrong user or deleted): ${invalidIngredients}`);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
