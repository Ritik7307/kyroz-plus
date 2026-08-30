import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { syncMasterSopsForUser } from './src/services/sop.service';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb+srv://vijayshankarprajapati29_db_user:loveshit@cluster0.wf2za1x.mongodb.net/?appName=Cluster0';

async function sync() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');
    
    // User ID
    const userId = new mongoose.Types.ObjectId('6a3e0e5d5302a36ceee1999d');
    
    await syncMasterSopsForUser(userId);
    console.log('Successfully synced Master SOPs to user.');
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

sync();
