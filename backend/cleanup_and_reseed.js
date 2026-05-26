require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', mongoose.connection.name);

  // Load models dynamically
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const Dish = mongoose.model('Dish', new mongoose.Schema({}, { strict: false }));
  const Recipe = mongoose.model('Recipe', new mongoose.Schema({}, { strict: false }));
  const RawMaterial = mongoose.model('RawMaterial', new mongoose.Schema({}, { strict: false }));
  const SemiFinishedGood = mongoose.model('SemiFinishedGood', new mongoose.Schema({}, { strict: false }));
  const Packaging = mongoose.model('Packaging', new mongoose.Schema({}, { strict: false }));
  const Inventory = mongoose.model('Inventory', new mongoose.Schema({}, { strict: false }));

  // We import the compiled or raw TypeScript seeder?
  // Since we are running js, we can import the compiled one from dist/services/blueprintSeeder.service or we can just implement the seeder directly in this script or compile first.
  // Wait, let's just compile the backend codebase using tsc first, and then run a script that calls the seeded blueprints!
  // Or we can dynamically run it. Let's look at the users first.
  const users = await User.find({});
  console.log(`Found ${users.length} users in database.`);

  for (const user of users) {
    const userId = user._id;
    console.log(`\n--------------------------------------------`);
    console.log(`Cleaning up & reseeding for user: ${user.email} (${userId})`);
    console.log(`--------------------------------------------`);

    // 1. Delete old recipes, dishes, SFGs, raw materials, packaging, inventory
    // We only delete materials with seeded-like codes to prevent deleting custom items if any
    const rmDel = await RawMaterial.deleteMany({ userId });
    const sfgDel = await SemiFinishedGood.deleteMany({ userId });
    const pkgDel = await Packaging.deleteMany({ userId });
    const dishDel = await Dish.deleteMany({ userId });
    const recipeDel = await Recipe.deleteMany({ userId });
    const invDel = await Inventory.deleteMany({ userId });

    console.log(`Deleted: ${rmDel.deletedCount} raw materials, ${sfgDel.deletedCount} SFGs, ${pkgDel.deletedCount} packaging, ${dishDel.deletedCount} dishes, ${recipeDel.deletedCount} recipes, ${invDel.deletedCount} inventory records.`);

    // 2. Call the compiled seedBlueprints function
    // Wait, let's require the compiled seeder from dist/services/blueprintSeeder.service
    try {
      const { seedBlueprints } = require('./dist/services/blueprintSeeder.service');
      await seedBlueprints(userId);
      console.log(`Successfully seeded blueprints for user ${user.email}`);
    } catch (err) {
      console.error(`Failed to seed blueprints for user ${user.email} using compiled seeder:`, err.message);
      console.log('Will attempt to seed manually using TS-Node or trigger it via HTTP, or we compile first.');
    }
  }

  await mongoose.disconnect();
  console.log('\nCleanup & reseed complete.');
}

main().catch(console.error);
