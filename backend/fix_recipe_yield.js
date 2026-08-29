require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await mongoose.connection.db.collection('recipes').updateMany(
    { 
      targetModel: 'SemiFinishedGood', 
      $or: [
        { operationalYield: { $exists: false } }, 
        { operationalYield: null }, 
        { operationalYield: 0 }, 
        { operationalYield: 1 }
      ] 
    }, 
    { $set: { operationalYield: 1000, targetYield: 1000 } }
  );
  console.log('Updated Recipes:', result.modifiedCount);

  // Re-run the dish costing update here so we don't have to run sync_ingredient_prices again
  await mongoose.disconnect();
}
run();
