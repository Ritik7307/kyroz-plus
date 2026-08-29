import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        const db = mongoose.connection.db!;
        
        const userId = new mongoose.Types.ObjectId('69f84eb97a1102e857341078');
        
        const recipes = await db.collection('recipes').find({ userId }).toArray();
        let updatedCount = 0;
        
        for (const r of recipes) {
            let modified = false;
            for (let i = 0; i < r.ingredients.length; i++) {
                const ing = r.ingredients[i];
                if (!ing.itemId || ing.itemId === null) {
                    // Try to find the item by code
                    let col = '';
                    if (ing.itemModel === 'RawMaterial') col = 'rawmaterials';
                    else if (ing.itemModel === 'SemiFinishedGood') col = 'semifinishedgoods';
                    else if (ing.itemModel === 'PreparationMaster') col = 'preparationmasters';
                    else if (ing.itemModel === 'PortionMaster') col = 'portionmasters';
                    
                    if (col && ing.code) {
                        const found = await db.collection(col).findOne({ code: ing.code, userId });
                        if (found) {
                            ing.itemId = found._id;
                            modified = true;
                        } else {
                            console.log(`Could not find ${ing.itemModel} with code ${ing.code}`);
                        }
                    }
                }
            }
            if (modified) {
                await db.collection('recipes').updateOne({ _id: r._id }, { $set: { ingredients: r.ingredients } });
                updatedCount++;
            }
        }
        
        console.log(`Updated ${updatedCount} recipes with missing itemIds.`);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
