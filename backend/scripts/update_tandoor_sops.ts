import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const parsedSopsPath = 'c:/Users/Ritik prajapati/Desktop/project/kyroz-plus/parsed_sops.json';

const sops = JSON.parse(fs.readFileSync(parsedSopsPath, 'utf-8'));

async function updateSops() {
    console.log("Connecting to", process.env.MONGO_URI ? "MONGO_URI found" : "NO MONGO URI");
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz');

    for (let i = 0; i < sops.length; i += 2) {
        if (i + 1 >= sops.length) break;
        const enContent = sops[i];
        const hiContent = sops[i+1];
        
        let titleLine = enContent.split('\n').find((l: string) => l.startsWith('## '));
        let title = titleLine ? titleLine.replace('## ', '').trim() : `Tandoor SOP ${i/2}`;

        // Ensure title is consistent
        if (title.includes('T-605')) title = 'T-605 SILK INFUSION SERIES';
        else if (title.includes('T-607')) title = 'T-607 ARABIAN SMOKE SERIES';
        else if (title.includes('VEG TANDOOR')) title = 'VEG TANDOOR SERIES';
        else if (title.includes('T-606')) title = 'T-606 MINCE MASTER SERIES';
        
        const category = 'Tandoor';

        console.log(`Updating ${title}...`);
        await MasterSop.findOneAndUpdate(
            { title },
            { category, contentEn: enContent, contentHi: hiContent },
            { upsert: true }
        );
    }
    console.log('Finished updating SOPs.');
    process.exit(0);
}
updateSops();
