require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    const dishesToAdd = [
        { name: '10 Inch Farmhouse Pizza', price: 349 },
        { name: '10 Inch Veggie Supreme Pizza', price: 399 },
        { name: '10 Inch Paneer Tikka Pizza', price: 399 },
        { name: '10 Inch Chicken Tikka Pizza', price: 449 },
        { name: '10 Inch Cheese Burst Pizza', price: 499 },
        { name: '12 Inch Margherita Pizza', price: 399 },
        { name: '12 Inch Farmhouse Pizza', price: 449 },
        { name: '12 Inch Veggie Supreme Pizza', price: 499 },
        { name: '12 Inch Paneer Tikka Pizza', price: 499 },
        { name: '12 Inch Chicken Tikka Pizza', price: 549 },
        { name: '12 Inch Cheese Burst Pizza', price: 599 },
        { name: 'Aloo Tikki Burger', price: 99 },
        { name: 'Crispy Veg Burger', price: 129 },
        { name: 'Chicken Zinger Burger', price: 199 },
        { name: 'Tandoori Paneer Burger', price: 179 },
        { name: 'Cheese Burger', price: 159 },
        { name: 'Peri-Peri Paneer Wrap', price: 199 },
        { name: 'Crispy Chicken Wrap', price: 229 },
        { name: 'Zing Crunchy Roll', price: 249 },
        { name: 'Veg Club Sandwich', price: 149 },
        { name: 'Corn & Cheese Sandwich', price: 179 },
        { name: 'Peri-Peri Paneer Sandwich', price: 199 },
        { name: 'Crispy Chicken Sandwich', price: 229 },
        { name: 'Cheese Grill Sandwich', price: 159 },
        { name: 'White Sauce Penne', price: 229 },
        { name: 'White Sauce Fusilli', price: 229 },
        { name: 'Alfredo Pasta', price: 249 },
        { name: 'Mushroom Alfredo', price: 279 },
        { name: 'Cheese Alfredo Pasta', price: 299 },
        { name: 'Arrabbiata Pasta', price: 229 },
        { name: 'Red Sauce Penne', price: 229 },
        { name: 'Red Sauce Fusilli', price: 229 },
        { name: 'Spicy Marinara Pasta', price: 249 },
        { name: 'Pink Penne', price: 249 },
        { name: 'Pink Fusilli', price: 249 },
        { name: 'Cheese Pink Pasta', price: 279 },
        { name: 'Classic Garlic Bread', price: 129 },
        { name: 'Cheese Garlic Bread', price: 159 },
        { name: 'Peri Peri French Fries', price: 129 },
        { name: 'Chicken Nuggets', price: 179 },
        { name: 'Paneer Grill', price: 229 },
        { name: 'Chicken Grill', price: 249 },
        { name: 'Crispy Strips', price: 229 },
        { name: 'Chicken Wings', price: 249 },
        { name: 'Leg Piece', price: 149 },
        { name: 'Chocolate Shake', price: 169 },
        { name: 'Mango Shake', price: 179 },
        { name: 'Strawberry Shake', price: 179 },
        { name: 'Oreo Shake', price: 199 },
        { name: 'KitKat Shake', price: 199 },
        { name: 'Hazelnut Shake', price: 229 },
        { name: 'Mocha', price: 189 }
    ];

    const dishesCollection = db.collection('dishes');

    for (const user of users) {
        // Also update existing Cafe dishes that had sub-categories (Pizza, Burger, etc.)
        await dishesCollection.updateMany(
            { userId: user._id, category: { $in: ['Pizza', 'Burger', 'Wrap', 'Snacks', 'Pasta', 'Beverages'] } },
            { $set: { category: 'Cafe' } }
        );

        for (const dish of dishesToAdd) {
            await dishesCollection.updateOne(
                { userId: user._id, name: dish.name },
                {
                    $set: {
                        name: dish.name,
                        price: dish.price,
                        category: 'Cafe',
                        userId: user._id,
                        isInventoryLinked: true
                    }
                },
                { upsert: true }
            );
        }
    }
    
    console.log('Successfully added all dishes to existing users and updated sub-categories to Cafe');
    mongoose.disconnect();
});
