import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { seedBlueprints } from '../src/services/blueprintSeeder.service';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        const user = await mongoose.connection.collection('users').findOne({email: 'vijayshankarprajapati29@gmail.com'});
        if (!user) throw new Error('User not found');
        const userId = user._id;
        console.log('Seeding data for user', userId);
        await seedBlueprints(userId);
        console.log('Seeding complete!');
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
main();
