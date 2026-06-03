require('dotenv').config();
const mongoose = require('mongoose');

const DB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kyroz';

async function migratePlans() {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Update Users
    const usersCollection = db.collection('users');
    
    const updateBasic = await usersCollection.updateMany({ plan: 'Basic' }, { $set: { plan: 'Starter' } });
    console.log(`Updated ${updateBasic.modifiedCount} users from Basic to Starter in plan field`);

    const updatePro = await usersCollection.updateMany({ plan: 'Pro' }, { $set: { plan: 'Growth' } });
    console.log(`Updated ${updatePro.modifiedCount} users from Pro to Growth in plan field`);

    const updateElite = await usersCollection.updateMany({ plan: 'Elite' }, { $set: { plan: 'Scale' } });
    console.log(`Updated ${updateElite.modifiedCount} users from Elite to Scale in plan field`);

    const updateSubPlanBasic = await usersCollection.updateMany({ subscriptionPlan: 'Basic' }, { $set: { subscriptionPlan: 'Starter' } });
    console.log(`Updated ${updateSubPlanBasic.modifiedCount} users from Basic to Starter in subscriptionPlan field`);

    const updateSubPlanPro = await usersCollection.updateMany({ subscriptionPlan: 'Pro' }, { $set: { subscriptionPlan: 'Growth' } });
    console.log(`Updated ${updateSubPlanPro.modifiedCount} users from Pro to Growth in subscriptionPlan field`);

    const updateSubPlanElite = await usersCollection.updateMany({ subscriptionPlan: 'Elite' }, { $set: { subscriptionPlan: 'Scale' } });
    console.log(`Updated ${updateSubPlanElite.modifiedCount} users from Elite to Scale in subscriptionPlan field`);

    // Also update subscriptions if applicable
    const subsCollection = db.collection('subscriptions');
    if (subsCollection) {
      const updateSubBasic = await subsCollection.updateMany({ plan: 'Basic' }, { $set: { plan: 'Starter' } });
      console.log(`Updated ${updateSubBasic.modifiedCount} subscriptions from Basic to Starter`);

      const updateSubPro = await subsCollection.updateMany({ plan: 'Pro' }, { $set: { plan: 'Growth' } });
      console.log(`Updated ${updateSubPro.modifiedCount} subscriptions from Pro to Growth`);

      const updateSubElite = await subsCollection.updateMany({ plan: 'Elite' }, { $set: { plan: 'Scale' } });
      console.log(`Updated ${updateSubElite.modifiedCount} subscriptions from Elite to Scale`);
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migratePlans();
