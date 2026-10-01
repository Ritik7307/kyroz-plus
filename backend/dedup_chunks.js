const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kyroz-plus').then(async () => {
    const chunks = await mongoose.connection.collection('sopchunks').find({}).toArray();
    const seen = new Set();
    const toDelete = [];
    
    for (const chunk of chunks) {
        const uid = chunk.userId ? chunk.userId.toString() : 'global';
        const key = uid + '_' + chunk.text;
        if (seen.has(key)) {
            toDelete.push(chunk._id);
        } else {
            seen.add(key);
        }
    }
    
    console.log('Total duplicate chunks found:', toDelete.length);
    if (toDelete.length > 0) {
        await mongoose.connection.collection('sopchunks').deleteMany({ _id: { $in: toDelete } });
        console.log('Deleted duplicates.');
    }
    process.exit(0);
});
