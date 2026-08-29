require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    const dishesToAdd = [
        { name: 'Aloo Gobhi Matar', price: 219 },
        { name: 'Corn Palak Cheese', price: 249 },
        { name: 'Kadhai Paneer', price: 279 },
        { name: 'Lehsunia Paneer', price: 289 },
        { name: 'Malai Kofta (Ivory)', price: 299 },
        { name: 'Malai Kofta Red', price: 299 },
        { name: 'Mushroom Do Pyaza', price: 269 },
        { name: 'Palak Paneer', price: 279 },
        { name: 'Paneer Butter Masala', price: 289 },
        { name: 'Paneer Dhaniya Adraki', price: 289 },
        { name: 'Paneer Lababdar', price: 299 },
        { name: 'Paneer Pasanda', price: 319 },
        { name: 'Shahi Paneer', price: 289 },
        { name: 'Signature Panch-Ratan Curry Veg', price: 329 },
        { name: 'Veg Handi', price: 259 },
        { name: 'Veg Jalfrezi', price: 249 }
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
                        ingredientPrice: Math.floor(dish.price * 0.3)
                    }
                },
                { upsert: true }
            );
        }
    }
    
    console.log('Successfully added all Indian Curry Veg dishes to existing users.');
    mongoose.disconnect();
});
