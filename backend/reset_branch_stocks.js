const mongoose = require('mongoose');
require('dotenv').config();

async function resetBranchStocks() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // Find all branch accounts (isLocation: true) and users who haven't made purchases
  const branchUsers = await mongoose.connection.db.collection('users').find({
    $or: [
      { isLocation: true },
      { role: 'manager' },
      { email: 'ritikprajapati7307@gmail.com' }
    ]
  }).toArray();

  console.log(`Found ${branchUsers.length} branch accounts to reset inventory stock to 0:`);
  for (const u of branchUsers) {
    console.log(`- ${u.email} (${u.shopName || u.name})`);
    
    // Reset Raw Materials stock to 0
    const rmRes = await mongoose.connection.db.collection('rawmaterials').updateMany(
      { userId: u._id },
      { $set: { currentStock: 0 } }
    );

    // Reset Semi Finished Goods stock to 0
    const sfgRes = await mongoose.connection.db.collection('semifinishedgoods').updateMany(
      { userId: u._id },
      { $set: { currentStock: 0 } }
    );

    // Reset Packaging stock to 0
    const pkgRes = await mongoose.connection.db.collection('packagings').updateMany(
      { userId: u._id },
      { $set: { currentStock: 0 } }
    );

    // Reset Premixes stock to 0 if any
    const pmRes = await mongoose.connection.db.collection('premixes').updateMany(
      { userId: u._id },
      { $set: { currentStock: 0 } }
    );

    // Reset Inventory (totalPlates) to 0
    const invRes = await mongoose.connection.db.collection('inventories').updateMany(
      { userId: u._id },
      { $set: { totalPlates: 0, totalPackets: 0 } }
    );

    console.log(`  Updated: RMs=${rmRes.modifiedCount}, SFGs=${sfgRes.modifiedCount}, PKGs=${pkgRes.modifiedCount}, PMs=${pmRes.modifiedCount}, Inv=${invRes.modifiedCount}`);
  }

  await mongoose.disconnect();
  console.log('Finished stock reset.');
}

resetBranchStocks();
