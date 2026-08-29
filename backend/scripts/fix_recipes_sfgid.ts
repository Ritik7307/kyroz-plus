import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        const db = mongoose.connection.db;
        if (!db) throw new Error("No db");
        
        const recipes = await db.collection('recipes').find({ 'ingredients.sfgId': { $exists: true } }).toArray();
        console.log(`Found ${recipes.length} recipes to fix`);
        let fixedCount = 0;
        
        for (const r of recipes) {
            let changed = false;
            const newIngs = await Promise.all(r.ingredients.map(async (ing: any) => {
                if (ing.sfgId && !ing.itemId) {
                    ing.itemId = ing.sfgId;
                    let isSfg = await db.collection('semifinishedgoods').findOne({ _id: ing.itemId });
                    if (isSfg) {
                        ing.itemModel = 'SemiFinishedGood';
                    } else {
                        ing.itemModel = 'RawMaterial';
                    }
                    changed = true;
                }
                return ing;
            }));
            
            if (changed) {
                await db.collection('recipes').updateOne({ _id: r._id }, { $set: { ingredients: newIngs } });
                fixedCount++;
            }
        }
        console.log(`Fixed ${fixedCount} recipes in DB!`);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

main();
