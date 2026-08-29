import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedBlueprints } from './src/services/blueprintSeeder.service';
import User from './src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kyroz';

async function runPatch() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const users = await User.find({});
    console.log(`Found ${users.length} users. Patching blueprint data...`);

    for (const user of users) {
      console.log(`Patching blueprint data for user: ${user.name} (${user._id})`);
      try {
        await seedBlueprints(user._id.toString());
        console.log(`[OK] Successfully synced blueprint for ${user.name}`);
      } catch (err) {
        console.error(`[ERROR] Failed to sync blueprint for ${user.name}:`, err);
      }
    }

    console.log('All users patched successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runPatch();
