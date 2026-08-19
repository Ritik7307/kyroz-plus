import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { syncMasterSopsForUser } from '../src/services/sop.service';
import User from '../src/models/User';
import MasterSop from '../src/models/MasterSop';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const users = await User.find({});
    for (const user of users) {
      console.log(`Syncing SOPs for user ${user._id}`);
      await syncMasterSopsForUser(user._id);
    }
    
    // Also sync for the default 'test_user_id' just in case some records use it as a string
    console.log(`Syncing SOPs for test_user_id`);
    await syncMasterSopsForUser('test_user_id' as any);

    console.log('Sync complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
