require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const sops = await mongoose.connection.collection('sops').find({}).toArray();
    const seenTitles = new Set();
    const toDelete = [];
    
    for (const sop of sops) {
        const title = sop.title.trim();
        // also trim trailing ' SOP' to deduplicate e.g. "INSTANT DOSA" vs "INSTANT DOSA SOP"
        let baseTitle = title.replace(/\s+SOP$/i, '');
        
        if (seenTitles.has(baseTitle)) {
            toDelete.push(sop._id);
        } else {
            seenTitles.add(baseTitle);
        }
    }
    
    console.log('Total duplicates to delete:', toDelete.length);
    if (toDelete.length > 0) {
        const result = await mongoose.connection.collection('sops').deleteMany({ _id: { $in: toDelete } });
        console.log('Deleted duplicates:', result.deletedCount);
    }
    
    process.exit(0);
});
