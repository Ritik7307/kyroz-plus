import mongoose from 'mongoose';
import { seedBlueprints } from './src/services/blueprintSeeder.service';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/kyroz-plus';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users. Applying updated blueprints to all...`);
    
    for (const user of users) {
      console.log(`Seeding for user: ${user.email} (${user._id})`);
      await seedBlueprints(user._id.toString());
    }
    
    console.log('Successfully updated costing master and blueprints for all users!');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
};

run();
