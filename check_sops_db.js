const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

const MasterSopSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    contentEn: { type: String, required: true },
    contentHi: { type: String, required: true },
    content: { type: String }
});

const MasterSop = mongoose.models.MasterSop || mongoose.model('MasterSop', MasterSopSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz');
    const sops = await MasterSop.find({});
    console.log('SOP Titles in DB:');
    sops.forEach(s => console.log(s.title));
    process.exit(0);
}
check();
