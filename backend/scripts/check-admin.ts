import mongoose from 'mongoose';
import User from '../src/models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

async function checkAdmin() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ email: '24mc3040@rgipt.ac.in' });
  console.log('User Found:', user ? 'YES' : 'NO');
  if (user) {
    console.log('User Role:', user.role);
    console.log('User Plan:', user.subscriptionPlan);
  }
  process.exit(0);
}

checkAdmin();
