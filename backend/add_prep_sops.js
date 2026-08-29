require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const masterCollection = db.collection('mastersops');
  const ops = [
    { title: 'PREMIX PREP', category: 'Preparation', contentEn: '1. Prepare all premixes according to the daily required quantity.\n2. Store in airtight containers.', contentHi: '1. दैनिक आवश्यकता के अनुसार सभी प्रीमिक्स तैयार करें।\n2. एयरटाइट कंटेनर में स्टोर करें।' },
    { title: 'PRE PREP', category: 'Preparation', contentEn: '1. Chop all required vegetables.\n2. Boil potatoes and keep them ready.\n3. Prepare basic gravies.', contentHi: '1. आवश्यक सभी सब्जियां काट लें।\n2. आलू उबाल कर तैयार रखें।\n3. बेसिक ग्रेवी तैयार करें।' },
    { title: 'CHINESE DAILY KITCHEN PREP', category: 'Preparation', contentEn: '1. Prepare ginger garlic paste.\n2. Chop cabbage, carrot, and capsicum.\n3. Keep sauces ready.', contentHi: '1. अदरक लहसुन का पेस्ट तैयार करें।\n2. पत्ता गोभी, गाजर, और शिमला मिर्च काट लें।\n3. सॉस तैयार रखें।' }
  ];
  for (const op of ops) {
    await masterCollection.updateOne({ title: op.title }, { $set: op }, { upsert: true });
  }
  console.log('MasterSops added');
  const sopCollection = db.collection('sops');
  const users = await db.collection('users').find({}).toArray();
  for (const user of users) {
    for (const op of ops) {
      await sopCollection.updateOne({ title: op.title, userId: user._id }, { $set: { ...op, userId: user._id } }, { upsert: true });
    }
  }
  console.log('Sops added for all users');
  mongoose.disconnect();
});
