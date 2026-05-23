import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

function parseSops() {
  const content = fs.readFileSync(path.join(__dirname, 'raw-chinese.txt'), 'utf8');
  const docs = content.split('DOCUMENT ').filter(c => c.trim().length > 0);
  
  const sops = [];
  
  for (const doc of docs) {
    // "1: TITLE\nENGLISH\n..."
    const firstLineEnd = doc.indexOf('\n');
    const firstLine = doc.substring(0, firstLineEnd).trim(); // "1: TITLE"
    const titleMatch = firstLine.match(/^\d+:\s*(.+)$/);
    if (!titleMatch) continue;
    
    // Sometimes there's Hindi and English combined under same Document. Let's parse English and Hindi carefully.
    // A document typically has "ENGLISH\n" and "HINDI\n" or just the content for one language.
    // By looking at the raw file, we see:
    // DOCUMENT 1: TITLE
    // ENGLISH
    // ...
    // HINDI
    // DOCUMENT 1: HINDI TITLE
    // ...
    // Wait, the prompt has:
    // DOCUMENT 1: CHINESE DAILY KITCHEN SETUP SOP
    // ENGLISH
    // ...
    // HINDI
    // DOCUMENT 1: चाइनीज़ डेली किचन सेटअप SOP
    // ...
    
    // Oh, the user has "HINDI\nDOCUMENT 1: ..." 
    // This means `content.split('DOCUMENT ')` will split it again!
    // So the docs array will have:
    // 1: CHINESE DAILY KITCHEN SETUP SOP\nENGLISH\n...\nHINDI\n
    // 1: चाइनीज़ डेली किचन सेटअप SOP\n...
    // 2: AMERICAN CHOPSUEY SOP\nENGLISH\n...\nHINDI\n
    // 2: अमेरिकन चॉप्सुए SOP\n...
  }
}

// Rewriting parser to match the exact structure
function parseAccurately() {
  const content = fs.readFileSync(path.join(__dirname, 'raw-chinese.txt'), 'utf8');
  // Match "DOCUMENT X: TITLE"
  const regex = /DOCUMENT \d+:\s*([^\n]+)/g;
  
  let match;
  let indices = [];
  while ((match = regex.exec(content)) !== null) {
    indices.push({ title: match[1].trim(), index: match.index });
  }
  
  const sops = [];
  
  for (let i = 0; i < indices.length; i += 2) {
    const enDoc = indices[i];
    const hiDoc = indices[i + 1];
    if (!hiDoc) break;
    
    const enTitle = enDoc.title;
    
    // English content starts after "ENGLISH\n" and ends before "HINDI\nDOCUMENT"
    const enStartIndex = content.indexOf('ENGLISH', enDoc.index) + 'ENGLISH'.length;
    const enEndIndex = content.indexOf('HINDI', enStartIndex);
    const contentEn = content.substring(enStartIndex, enEndIndex).trim();
    
    // Hindi content starts after the hindi title and ends before the next document
    const hiStartIndex = content.indexOf('\n', hiDoc.index) + 1;
    const hiEndIndex = i + 2 < indices.length ? indices[i + 2].index : content.length;
    const contentHi = content.substring(hiStartIndex, hiEndIndex).trim();
    
    sops.push({
      title: enTitle,
      category: 'Chinese',
      contentEn,
      contentHi
    });
  }
  
  return sops;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');
    
    const sops = parseAccurately();
    console.log(`Parsed ${sops.length} Chinese SOPs.`);

    for (const sop of sops) {
      await MasterSop.findOneAndUpdate(
        { title: sop.title },
        sop,
        { upsert: true, new: true }
      );
      console.log(`Upserted: ${sop.title}`);
    }

    console.log(`Successfully seeded ${sops.length} ACTUAL Global SOPs for Chinese.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
