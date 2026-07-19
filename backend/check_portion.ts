import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PortionMaster from './src/models/PortionMaster';
import User from './src/models/User';
import SemiFinishedGood from './src/models/SemiFinishedGood';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to DB');

    const user = await User.findOne({ email: 'vijayshankarprajapati29@gmail.com' });
    if (!user) {
        console.log('User not found');
        process.exit(1);
    }
    const pt = await PortionMaster.findOne({ name: 'Aloo Gobhi Matar Portion', userId: user._id });
    if (!pt) {
        console.log('Portion not found');
        process.exit(1);
    }

    console.log('Portion ingredients:', pt.ingredients);

    for (const ing of pt.ingredients) {
        const sfg = await SemiFinishedGood.findOne({ _id: ing.sfgId });
        console.log(`Checking sfgId ${ing.sfgId}: found = ${!!sfg}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
