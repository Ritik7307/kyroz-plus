import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import Sop from '../src/models/Sop';
import dotenv from 'dotenv';
import SopChunk from '../src/models/SopChunk';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const sopDefs = [
  { prefix: 'data_navratankorma', title: 'NAVRATAN KORMA SOP', category: 'Veg' },
  { prefix: 'data_palakpaneer', title: 'PALAK PANEER SOP', category: 'Veg' },
  { prefix: 'data_paneerbuttermasala', title: 'PANEER BUTTER MASALA SOP', category: 'Veg' },
  { prefix: 'data_shahipaneer', title: 'SHAHI PANEER SOP', category: 'Veg' },
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    for (const def of sopDefs) {
      const enFile = path.join(__dirname, def.prefix + '_en.txt');
      const hiFile = path.join(__dirname, def.prefix + '_hi.txt');

      if (!fs.existsSync(enFile) || !fs.existsSync(hiFile)) {
        console.log('Missing files for ' + def.prefix);
        continue;
      }

      const contentEn = fs.readFileSync(enFile, 'utf8');
      const contentHi = fs.readFileSync(hiFile, 'utf8');

      // Find or create matching MasterSop by title
      let matchingSop = await MasterSop.findOne({ title: def.title });
      
      if (!matchingSop) {
        console.log('Creating new MasterSop: ' + def.title);
        matchingSop = new MasterSop({
          title: def.title,
          category: def.category,
          contentEn,
          contentHi
        });
        await matchingSop.save();
      } else {
        console.log('Updating MasterSop: ' + matchingSop.title);
        matchingSop.contentEn = contentEn;
        matchingSop.contentHi = contentHi;
        matchingSop.category = def.category;
        await matchingSop.save();
      }

      // Also update the ones for users
      const userSops = await Sop.find({ title: matchingSop.title });
      for (const uSop of userSops) {
        console.log('  -> Updating user SOP for user ' + uSop.userId);
        uSop.contentEn = contentEn;
        uSop.contentHi = contentHi;
        uSop.category = def.category;
        uSop.content = undefined; // clear out content just in case
        await uSop.save();

        // Delete existing chunks so they are reprocessed next time it's needed
        await SopChunk.deleteMany({ userId: uSop.userId, dish: uSop.title.toLowerCase() });
      }
    }
    
    // Sync to all users immediately so they have the newly created SOPs
    const User = require('../src/models/User').default;
    const users = await User.find({});
    console.log('Syncing MasterSops to all users...');
    const masterSops = await MasterSop.find().lean();
    for (const user of users) {
      const operations = masterSops.map(sopData => ({
        updateOne: {
          filter: { title: sopData.title, userId: user._id },
          update: { 
            $set: {
              title: sopData.title,
              category: sopData.category,
              contentEn: sopData.contentEn,
              contentHi: sopData.contentHi,
              content: sopData.content,
              userId: user._id,
              masterId: sopData._id
            }
          },
          upsert: true
        }
      }));
      await Sop.bulkWrite(operations);
    }
    console.log('Successfully bulk-synced for all users.');

    console.log('Done.');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
