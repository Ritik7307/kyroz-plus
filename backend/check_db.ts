import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dish from './src/models/Dish';
import User from './src/models/User';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB');

    const users = await User.find({}, 'email name');
    console.log('Users:', users);

    for (const u of users) {
      const count = await Dish.countDocuments({ userId: u._id });
      console.log(`User ${u.email} has ${count} dishes.`);
    }

    const allDishes = await Dish.find({}, 'name userId');
    console.log('Total dishes in DB:', allDishes.length);
    for (const d of allDishes) {
        console.log(`- ${d.name} (user: ${d.userId})`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
