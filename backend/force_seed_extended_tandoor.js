require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    const dishesToAdd = [
        // Chicken Tikka & Tandoori Chicken (T-604, T-605)
        { name: 'Chicken Tikka (6 Pcs)', price: 299 },
        { name: 'Tandoori Chicken (Half)', price: 349 },
        { name: 'Tandoori Chicken (Full)', price: 599 },
        { name: 'Chicken Malai Tikka (6 Pcs)', price: 329 },
        { name: 'Afghani Chicken (Half)', price: 379 },
        { name: 'Afghani Chicken (Full)', price: 649 },
        
        // Seekh Kebab (T-606)
        { name: 'Chicken Seekh Kebab (2 Pcs)', price: 249 },
        
        // Al Faham (T-607)
        { name: 'Al Faham Chicken (Whole)', price: 699 },

        // Veg Tandoor (Paneer)
        { name: 'Tandoori Paneer Tikka', price: 249 },
        { name: 'Malai Paneer Tikka', price: 279 },
        { name: 'Hariyali Paneer Tikka', price: 259 },
        { name: 'Achari Paneer Tikka', price: 259 },

        // Veg Tandoor (Chaap)
        { name: 'Tandoori Soya Chaap', price: 199 },
        { name: 'Malai Soya Chaap', price: 229 },
        { name: 'Hariyali Soya Chaap', price: 209 },
        { name: 'Achari Soya Chaap', price: 209 },

        // Veg Tandoor (Mushroom)
        { name: 'Tandoori Mushroom', price: 229 },
        { name: 'Malai Mushroom', price: 259 },
        { name: 'Hariyali Mushroom', price: 239 },
        { name: 'Achari Mushroom', price: 239 },

        // Veg Tandoor (Momos)
        { name: 'Tandoori Momos (6 Pcs)', price: 179 }
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
                        category: 'Tandoor',
                        userId: user._id,
                        isInventoryLinked: true
                    }
                },
                { upsert: true }
            );
        }
    }
    
    console.log('Successfully added all Tandoor dishes to existing users.');
    mongoose.disconnect();
});
