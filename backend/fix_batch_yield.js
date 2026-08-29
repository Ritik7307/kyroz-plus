require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await mongoose.connection.db.collection('users').findOne({ email: 'vijayshankarprajapati29@gmail.com' });
  const result = await mongoose.connection.db.collection('semifinishedgoods').updateMany(
    { 
      userId: user._id, 
      $or: [
        { batchYield: { $exists: false } }, 
        { batchYield: null }, 
        { batchYield: 0 }, 
        { batchYield: 1 }
      ] 
    }, 
    { $set: { batchYield: 1000 } }
  );
  console.log('Updated SFGs:', result.modifiedCount);

  // For packaging standard serving plate
  await mongoose.connection.db.collection('packagings').updateOne(
    { userId: user._id, name: 'Standard Serving Plate' },
    { $set: { cost: 5 } } // Set a reasonable cost
  );

  await mongoose.disconnect();
}
run();
