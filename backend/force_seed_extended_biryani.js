require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    const dishesToAdd = [
        { name: 'Mutton Biryani', price: 399 },
        { name: 'Veg Biryani', price: 249 },
        { name: 'Paneer Biryani', price: 279 },
        { name: 'Chicken Biryani (Family Pack)', price: 799 },
        { name: 'Mutton Biryani (Family Pack)', price: 999 },
        { name: 'Veg Biryani (Family Pack)', price: 699 },
        { name: 'Paneer Biryani (Family Pack)', price: 749 }
    ];

    const dishesCollection = db.collection('dishes');

    for (const user of users) {
        for (const dish of dishesToAdd) {
            await dishesCollection.updateOne(
                { userId: user._id, name: dish.name },
                {
                    $set: {
                        name: dish.name,
                        price: dish.price,
                        category: 'Biryani',
                        userId: user._id,
                        isInventoryLinked: true
                    }
                },
                { upsert: true }
            );
        }
    }
    
    console.log('Successfully added all Biryani dishes to existing users.');
    mongoose.disconnect();
});
