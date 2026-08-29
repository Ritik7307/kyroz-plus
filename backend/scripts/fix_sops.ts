import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import Sop from '../src/models/Sop';

async function main() {
    try {
        const mongoUri = process.env.MONGO_URI || '';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const sops = await Sop.find({}).lean();
        
        console.log(`Found ${sops.length} SOPs.`);
        
        const titleCounts = new Map<string, number>();
        
        for (const sop of sops) {
            console.log(`[${sop.category}] ${sop.title}`);
            const count = titleCounts.get(sop.title) || 0;
            titleCounts.set(sop.title, count + 1);
        }

        console.log('\n--- Duplicate Titles ---');
        for (const [title, count] of titleCounts.entries()) {
            if (count > 1) {
                console.log(`${title}: ${count}`);
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
