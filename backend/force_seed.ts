import mongoose from 'mongoose';
import { seedBlueprints } from './src/services/blueprintSeeder.service';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri as string);
    console.log('Connected to MongoDB Live');
    
    const users = await User.find({});
    console.log('Found ' + users.length + ' users');
    
    for (const user of users) {
      console.log('Running seeder for user: ' + user._id);
      await seedBlueprints(user._id);
    }
    
    console.log('Live DB Seeder completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
};

run();
