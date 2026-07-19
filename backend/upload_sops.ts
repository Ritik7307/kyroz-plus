import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parseInventoryDocument } from './src/services/sopParser.service';
import User from './src/models/User';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to DB');
    
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      process.exit(1);
    }
    
    const sopsPath = path.join(__dirname, 'sops.txt');
    const content = fs.readFileSync(sopsPath, 'utf8');
    
    const stats = await parseInventoryDocument(content, user._id.toString());
    console.log('Upload complete!', stats);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
