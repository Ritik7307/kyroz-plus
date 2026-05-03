const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const promoteUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz');
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String
    }));

    const result = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (result) {
      console.log(`SUCCESS: ${email} is now an ADMIN!`);
    } else {
      console.error(`ERROR: User with email ${email} not found.`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Connection error:', error);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email: node promote_admin.js your@email.com');
  process.exit(1);
}

promoteUser(email);
