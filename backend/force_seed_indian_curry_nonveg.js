require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    const dishesToAdd = [
        { name: 'Desi Handi Chicken', price: 349 },
        { name: 'Desi Handi Mutton', price: 449 },
        { name: 'Chicken Barrah Masala', price: 359 },
        { name: 'Mutton Barrah Masala', price: 459 },
        { name: 'Butter Chicken', price: 349 },
        { name: 'Chicken Changezi', price: 369 },
        { name: 'Chicken Curry', price: 319 },
        { name: 'Chicken Kali Mirch', price: 349 },
        { name: 'Chicken Lababdar', price: 359 },
        { name: 'Chicken Rara', price: 379 },
        { name: 'Mutton Rara', price: 479 },
        { name: 'Chicken Pasanda', price: 369 },
        { name: 'Chicken Tikka Masala', price: 349 },
        { name: 'Kadhai Chicken', price: 339 },
        { name: 'Murg Hariyali', price: 349 },
        { name: 'Murg Mumtaz', price: 379 },
        { name: 'Murg Musallam', price: 499 },
        { name: 'Murg Patiala', price: 369 },
        { name: 'Mutton Bhuna Gosht', price: 449 },
        { name: 'Mutton Curry', price: 429 },
        { name: 'Mutton Handi', price: 459 },
        { name: 'Mutton Rogan Josh', price: 459 },
        { name: 'Chicken Nizami Handi', price: 369 },
        { name: 'Saag Chicken', price: 329 },
        { name: 'Saag Mutton', price: 439 }
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
                        category: 'Indian Curry',
                        userId: user._id,
                        isInventoryLinked: true,
                        ingredientPrice: Math.floor(dish.price * 0.35)
                    }
                },
                { upsert: true }
            );
        }
    }
    
    console.log('Successfully added all Indian Curry Non-Veg dishes to existing users.');
    mongoose.disconnect();
});
