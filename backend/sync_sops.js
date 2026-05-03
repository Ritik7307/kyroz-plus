const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/kyroz';

const SopSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  category: String,
  contentEn: String,
  contentHi: String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const Sop = mongoose.model('Sop', SopSchema);
const User = mongoose.model('User', UserSchema);

const sops = [
  { title: "CORN PALAK CHEESE", category: "Dish", contentEn: "...", contentHi: "..." },
  // ... (Full content here)
];

// (I'll just run a simpler script that copies existing SOPs to other users)
mongoose.connect(MONGO_URI).then(async () => {
  const users = await User.find();
  const existingSops = await Sop.find({ userId: '69f5e3b052f7bf6a6d934ef4' });
  
  for (const user of users) {
    if (user._id.toString() === '69f5e3b052f7bf6a6d934ef4') continue;
    
    for (const sop of existingSops) {
      const sopData = sop.toObject();
      delete sopData._id;
      sopData.userId = user._id;
      
      await Sop.findOneAndUpdate(
        { title: sopData.title, userId: user._id },
        sopData,
        { upsert: true }
      );
    }
    console.log(`Synced SOPs for user: ${user.email}`);
  }
  process.exit(0);
});
