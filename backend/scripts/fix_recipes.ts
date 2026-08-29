import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import SemiFinishedGood from '../src/models/SemiFinishedGood';

async function main() {
    try {
        const mongoUri = 'mongodb+srv://vijayshankarprajapati29_db_user:korakagazhai@cluster0.wf2za1x.mongodb.net/test?retryWrites=true&w=majority';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const sfg = await SemiFinishedGood.findOne({ name: 'Prepared Biryani (Dum)' }).lean();
        if (sfg) {
            const db = mongoose.connection.db;
            if (!db) throw new Error('DB is undefined');
            const res = await db.collection('recipes').updateMany(
                { 'ingredients.itemModel': 'SemiFinishedGood', 'ingredients.itemId': { $exists: false } },
                { $set: { 'ingredients.$[].itemId': (sfg as any)._id } }
            );
            console.log(`Fixed ${res.modifiedCount} Biryani recipes!`);
        } else {
            console.log('Prepared Biryani (Dum) SFG not found!');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
