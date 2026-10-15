const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Update MasterSops
  const mRes = await mongoose.connection.db.collection('mastersops').updateMany(
    { category: 'Indian Curry' },
    { $set: { category: 'Indian Veg Curry' } }
  );
  console.log('Updated MasterSops:', mRes.modifiedCount);

  // Update User Sops
  const uRes = await mongoose.connection.db.collection('sops').updateMany(
    { category: 'Indian Curry' },
    { $set: { category: 'Indian Veg Curry' } }
  );
  console.log('Updated User Sops:', uRes.modifiedCount);

  // Also check initial categories in globalsettings
  const defaultCats = [
    'South Indian',
    'Cafe',
    'Biryani',
    'Mandi',
    'Chinese',
    'Indian Veg Curry',
    'Indian Non-Veg Curry',
    'Tandoor',
    'Preparation',
    'Discipline'
  ];

  await mongoose.connection.db.collection('globalsettings').updateOne(
    { key: 'sop_categories' },
    { $set: { value: defaultCats, updatedAt: new Date() } },
    { upsert: true }
  );
  console.log('Saved sop_categories to globalsettings:', defaultCats);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
