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
        
        const dishes = await db.collection('dishes').find({ userId }).toArray();
        const recipes = await db.collection('recipes').find({ userId, targetModel: 'Dish', targetId: { $in: dishes.map(d => d._id) } }).toArray();
        
        let updatedCount = 0;
        
        for (const r of recipes) {
            for (const ing of (r.ingredients || [])) {
                if (!ing.itemId) continue;
                try {
                    const id = new mongoose.Types.ObjectId(ing.itemId);
                    let collectionName = '';
                    if (ing.itemModel === 'RawMaterial') collectionName = 'rawmaterials';
                    else if (ing.itemModel === 'SemiFinishedGood') collectionName = 'semifinishedgoods';
                    else if (ing.itemModel === 'PreparationMaster') collectionName = 'preparationmasters';
                    else if (ing.itemModel === 'PortionMaster') collectionName = 'portionmasters';
                    
                    if (collectionName) {
                        const result = await db.collection(collectionName).updateOne({ _id: id }, { $set: { userId } });
                        if (result.modifiedCount > 0) {
                            updatedCount++;
                        }
                    }
                } catch(e) {}
            }
        }
        
        console.log(`Updated ${updatedCount} referenced ingredients to belong to user ${userIdStr}`);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
