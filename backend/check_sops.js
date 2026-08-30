const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb+srv://vijayshankarprajapati29_db_user:loveshit@cluster0.wf2za1x.mongodb.net/?appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const masterDb = mongoose.connection.useDb('test'); // Or whatever the DB name is, assuming default
    
    // The collection is probably `mastersops` or `sops`
    const MasterSop = mongoose.models.MasterSop || mongoose.model('MasterSop', new mongoose.Schema({
      title: String,
      category: String
    }));

    const Sop = mongoose.models.Sop || mongoose.model('Sop', new mongoose.Schema({
      title: String,
      category: String,
      userId: mongoose.Schema.Types.ObjectId
    }));

    const tandoorMaster = await MasterSop.find({ category: 'Tandoor' });
    console.log('MasterSops in Tandoor:', tandoorMaster.map(s => s.title));

    const tandoorSops = await Sop.find({ category: 'Tandoor' });
    console.log('Sops in Tandoor:', tandoorSops.map(s => s.title));

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
