require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    const dishesToAdd = [
        // Dosas
        { name: 'Plain Dosa', price: 129 },
        { name: 'Masala Dosa', price: 149 },
        { name: 'Butter Dosa', price: 159 },
        { name: 'Mysore Masala Dosa', price: 169 },
        { name: 'Cheese Dosa', price: 179 },
        { name: 'Paper Dosa', price: 119 },
        
        // Rava Dosas
        { name: 'Plain Rava Dosa', price: 149 },
        { name: 'Onion Rava Dosa', price: 159 },
        { name: 'Masala Rava Dosa', price: 169 },
        { name: 'Cheese Rava Dosa', price: 189 },

        // Uttapams
        { name: 'Plain Uttapam', price: 129 },
        { name: 'Onion Uttapam', price: 139 },
        { name: 'Mix-Veg Uttapam', price: 149 },
        { name: 'Cheese Uttapam', price: 169 },
        { name: 'Masala Uttapam', price: 159 },

        // Idlis
        { name: 'Plain Idli', price: 99 },
        { name: 'Mini Idli', price: 89 },
        { name: 'Butter Idli', price: 119 },
        { name: 'Fried Idli', price: 129 },

        // Vadas
        { name: 'Medu Vada', price: 99 },
        { name: 'Mini Vada', price: 89 },
        { name: 'Sambar Vada', price: 109 },
        { name: 'Curd Vada', price: 129 },

        // Combos
        { name: 'Idli Vada Combo', price: 149 },
        { name: 'South Indian Combo Meal', price: 249 }
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
                        category: 'South Indian',
                        userId: user._id,
                        isInventoryLinked: true
                    }
                },
                { upsert: true }
            );
        }
    }
    
    console.log('Successfully added all South Indian dishes to existing users.');
    mongoose.disconnect();
});
