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

        const sops = await Sop.find({}).exec();
        console.log(`Found ${sops.length} SOPs.`);

        let updatedCount = 0;
        let deletedCount = 0;

        const titleMap = new Map<string, typeof sops[0]>();

        for (const sop of sops) {
            // Check for duplicates
            if (titleMap.has(sop.title)) {
                await Sop.deleteOne({ _id: sop._id });
                deletedCount++;
                continue;
            } else {
                titleMap.set(sop.title, sop);
            }

            // Check if title implies preparation
            const titleUpper = sop.title.toUpperCase();
            if (
                titleUpper.includes('PREP') ||
                titleUpper.includes('SETUP') ||
                titleUpper.includes('OPERATIONAL')
            ) {
                if (sop.category !== 'Preparation') {
                    sop.category = 'Preparation';
                    await sop.save();
                    updatedCount++;
                }
            }
        }

        console.log(`Successfully updated ${updatedCount} SOPs to 'Preparation' category.`);
        console.log(`Successfully deleted ${deletedCount} duplicate SOPs.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
