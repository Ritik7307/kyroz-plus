const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MasterSopSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    contentEn: { type: String, required: true },
    contentHi: { type: String, required: true },
    content: { type: String }
}, { timestamps: true });

const MasterSop = mongoose.models.MasterSop || mongoose.model('MasterSop', MasterSopSchema);

const sopsDir = path.join(__dirname, '../../SOPs');

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const folders = fs.readdirSync(sopsDir).filter(f => fs.statSync(path.join(sopsDir, f)).isDirectory());
        
        for (const folder of folders) {
            const category = folder.replace(/_/g, ' ');
            const folderPath = path.join(sopsDir, folder);
            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'));
            
            for (const file of files) {
                let title = file.replace('.md', '');
                
                // Keep the original filename-based title but make it more readable
                title = title.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
                if (title === 'S 301 COASTAL CRUST') title = 'S-301 COASTAL CRUST';
                if (title === 'S 302 YELLOW TEMPER') title = 'S-302 YELLOW TEMPER';
                if (title === 'S 304 CRUNCH CORE') title = 'S-304 CRUNCH CORE';
                if (title === 'S 305 STEAM CLOUD') title = 'S-305 STEAM CLOUD';
                if (title === 'S 307 KERALA KERNEL') title = 'S-307 KERALA KERNEL';
                if (title === 'S 308 LENTIL LAVA') title = 'S-308 LENTIL LAVA';

                const filePath = path.join(folderPath, file);
                let content = fs.readFileSync(filePath, 'utf-8');
                
                // Remove trailing quotes/commas that might have been picked up during extraction
                content = content.replace(/^"/, '').replace(/",\s*$/, '').trim();
                
                let contentEn = '';
                let contentHi = '';
                
                const parts = content.split('---');
                if (parts.length >= 2) {
                    contentEn = parts[0].trim();
                    contentHi = parts[1].trim();
                } else {
                    contentEn = content;
                    contentHi = 'Hindi translation not provided.';
                }
                
                try {
                    await MasterSop.findOneAndUpdate(
                        { title },
                        { category, contentEn, contentHi, content },
                        { upsert: true, new: true }
                    );
                    console.log(`Upserted: ${title} [${category}]`);
                } catch (err) {
                    console.error(`Failed to upsert: ${title}`, err.message);
                }
            }
        }
        
        await mongoose.disconnect();
        console.log('Done!');
    } catch (e) {
        console.error('Error:', e.message);
    }
}

run();
