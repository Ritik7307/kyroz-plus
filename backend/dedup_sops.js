const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kyroz-plus').then(async () => {
    const sops = await mongoose.connection.collection('sops').find({}).sort({createdAt: -1}).toArray();
    const seen = new Set();
    const toDelete = [];
    
    for (const sop of sops) {
        // Stringify userId or default to 'global' if null
        const userIdStr = sop.userId ? sop.userId.toString() : 'global';
        const key = userIdStr + '_' + sop.title;
        if (seen.has(key)) {
            toDelete.push(sop._id);
        } else {
            seen.add(key);
        }
    }
    
    console.log('Total duplicates found:', toDelete.length);
    if (toDelete.length > 0) {
        await mongoose.connection.collection('sops').deleteMany({ _id: { $in: toDelete } });
        console.log('Deleted duplicates.');
    }
    process.exit(0);
});
