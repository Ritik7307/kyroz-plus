import mongoose from 'mongoose';
import { seedBlueprints } from './src/services/blueprintSeeder.service';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/kyroz-plus';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const testUserId = "6a3e0e5d5302a36ceee1999d"; // Admin User ID
    console.log('Running seeder for user:', testUserId);
    
    await seedBlueprints(testUserId);
    
    console.log('Seeder completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
};

run();
