const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb+srv://vijayshankarprajapati29_db_user:loveshit@cluster0.wf2za1x.mongodb.net/?appName=Cluster0';

async function clean() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const Sop = mongoose.models.Sop || mongoose.model('Sop', new mongoose.Schema({
      title: String,
      category: String,
      userId: mongoose.Schema.Types.ObjectId
    }));

    const res = await Sop.deleteMany({ category: 'Tandoor' });
    console.log(`Deleted ${res.deletedCount} Tandoor SOPs from user collection.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clean();
