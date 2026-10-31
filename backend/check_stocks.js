const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await mongoose.connection.db.collection('users').find({}, { projection: { email: 1, role: 1, isLocation: 1, businessName: 1, outletName: 1 } }).toArray();

  for (const u of users) {
    const rmCount = await mongoose.connection.db.collection('rawmaterials').countDocuments({ userId: u._id });
    const sfgCount = await mongoose.connection.db.collection('semifinishedgoods').countDocuments({ userId: u._id });
    const pkgCount = await mongoose.connection.db.collection('packagings').countDocuments({ userId: u._id });
    const invCount = await mongoose.connection.db.collection('inventories').countDocuments({ userId: u._id });
    const nonZeroRM = await mongoose.connection.db.collection('rawmaterials').countDocuments({ userId: u._id, currentStock: { $gt: 0 } });
    console.log(u.email, 'Role:', u.role, 'isLoc:', u.isLocation, 'RMs:', rmCount, 'nonZeroRM:', nonZeroRM, 'SFGs:', sfgCount, 'PKGs:', pkgCount, 'Inventories:', invCount);
  }
  await mongoose.disconnect();
}
check();
