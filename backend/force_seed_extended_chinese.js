require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    const dishesToAdd = [
        { name: 'Veg Hot & Sour', price: 129 },
        { name: 'Chicken Hot & Sour', price: 149 },
        { name: 'Lemon Coriander Soup', price: 129 },
        { name: 'Veg Manchow Soup', price: 139 },
        { name: 'Chicken Manchow Soup', price: 159 },
        { name: 'Seafood Manchow Soup', price: 199 },
        { name: 'Spicy Garlic Soup', price: 129 },
        { name: 'Steamed Veg Momos', price: 129 },
        { name: 'Steamed Chicken Momos', price: 149 },
        { name: 'Steamed Cheese Momos', price: 159 },
        { name: 'Fried Veg Momos', price: 149 },
        { name: 'Fried Chicken Momos', price: 169 },
        { name: 'Kurkure Veg Momos', price: 179 },
        { name: 'Kurkure Chicken Momos', price: 199 },
        { name: 'Tandoori Veg Momos', price: 189 },
        { name: 'Tandoori Chicken Momos', price: 209 },
        { name: 'Chilli Paneer Dry', price: 249 },
        { name: 'Chilli Chicken Dry', price: 279 },
        { name: 'Chilli Soya Chaap Dry', price: 229 },
        { name: 'Chilli Mushroom Dry', price: 239 },
        { name: 'Chilli Potato Dry', price: 179 },
        { name: 'Veg Manchurian Dry', price: 199 },
        { name: 'Chicken Manchurian Dry', price: 249 },
        { name: 'Honey Chilli Potato', price: 199 },
        { name: 'Honey Chilli Lotus Stem', price: 229 },
        { name: 'Crispy Corn', price: 189 },
        { name: 'Salt & Pepper', price: 199 },
        { name: 'Chicken Lollipop', price: 249 },
        { name: 'Crispy Chicken', price: 279 },
        { name: 'Paneer Crispy', price: 249 },
        { name: 'Chilli Paneer Gravy', price: 259 },
        { name: 'Chilli Chicken Gravy', price: 289 },
        { name: 'Veg Manchurian Gravy', price: 209 },
        { name: 'Chicken Manchurian Gravy', price: 259 },
        { name: 'Veg Hakka Noodles', price: 199 },
        { name: 'Chicken Hakka Noodles', price: 239 },
        { name: 'Veg Fried Rice', price: 199 },
        { name: 'Egg Fried Rice', price: 219 },
        { name: 'Chicken Fried Rice', price: 249 },
        { name: 'Burnt Garlic Rice', price: 209 },
        { name: 'Burnt Garlic Noodles', price: 209 },
        { name: 'Schezwan Rice', price: 219 },
        { name: 'Schezwan Noodles', price: 219 },
        { name: 'Schezwan Chicken Rice', price: 259 },
        { name: 'American Chopsuey', price: 249 },
        { name: 'Chinese Bhel', price: 199 },
        { name: 'Crispy Noodle Bowl', price: 229 }
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
                        category: 'Chinese',
                        userId: user._id,
                        isInventoryLinked: true
                    }
                },
                { upsert: true }
            );
        }
    }
    
    console.log('Successfully added all Chinese dishes to existing users.');
    mongoose.disconnect();
});
