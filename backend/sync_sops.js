require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

const SopSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  category: String,
  contentEn: String,
  contentHi: String,
  isInventoryLinked: Boolean,
  platesPerPacket: Number
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const MasterSopSchema = new mongoose.Schema({
  title: String,
  category: String,
  contentEn: String,
  contentHi: String,
  isInventoryLinked: Boolean,
  platesPerPacket: Number
}, { collection: 'mastersops' });

const Sop = mongoose.model('Sop', SopSchema);
const User = mongoose.model('User', UserSchema);
const MasterSop = mongoose.model('MasterSop', MasterSopSchema);

mongoose.connect(MONGO_URI).then(async () => {
  const users = await User.find();
  console.log(`Starting massive sync for ${users.length} users...`);

  const masterSops = await MasterSop.find({});
  console.log(`Fetched ${masterSops.length} Master SOPs from database.`);

  for (const user of users) {
    for (const sopData of masterSops) {
      await Sop.findOneAndUpdate(
        { title: sopData.title, userId: user._id },
        { 
          title: sopData.title,
          category: sopData.category,
          contentEn: sopData.contentEn,
          contentHi: sopData.contentHi,
          isInventoryLinked: sopData.isInventoryLinked || false,
          platesPerPacket: sopData.platesPerPacket || 10,
          userId: user._id 
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Synced ${masterSops.length} SOPs for: ${user.email}`);
  }
  
  console.log('--- MASSIVE SYNC COMPLETE ---');
  process.exit(0);
}).catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
