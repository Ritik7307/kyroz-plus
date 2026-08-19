const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/kyroz').then(async () => {
    const coll = mongoose.connection.db.collection('mastersops');
    const doc = await coll.findOne({title: 'Hakka Noodles, Fried Rice & White Garlic Style'});
    
    if (doc) {
        let newContentEn = doc.contentEn;
        
        // Fix double header
        newContentEn = newContentEn.replace(
            /\| Problem \| Reason \| Solution \|\n\| ------- \| ------ \| -------- \|\n\| Problem \| Reason \| Solution \|\n\| ------- \| ------ \| -------- \|/g,
            '| Problem | Reason | Solution |\n| ------- | ------ | -------- |'
        );
        
        await coll.updateOne({_id: doc._id}, {$set: {contentEn: newContentEn}});
        console.log('Fixed double header in Hakka Noodles, Fried Rice & White Garlic Style');
    }

    process.exit(0);
});
