import mongoose from 'mongoose';
import User from '../src/models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kyroz';

async function promote(email: string) {
  try {
    await mongoose.connect(MONGODB_URI);
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found. Creating a new Admin account...');
      user = new User({
        email,
        name: 'Super Admin',
        role: 'admin',
        subscriptionPlan: 'Admin'
      });
    } else {
      user.role = 'admin';
      user.subscriptionPlan = 'Admin';
    }

    await user.save();

    console.log(`Successfully promoted ${email} to ADMIN.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: npx ts-node scripts/promote-admin.ts <email>');
  process.exit(1);
}

promote(email);
