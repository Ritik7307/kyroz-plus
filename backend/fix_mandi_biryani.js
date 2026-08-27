const m = require('mongoose');
m.connect('mongodb+srv://vijayshankarprajapati29_db_user:raghav123@cluster0.wf2za1x.mongodb.net/?appName=Cluster0').then(async () => {
  const db = m.connection.db;
  
  const mandiRes = await db.collection('dishes').updateMany(
    { name: /Mandi/i },
    { $set: { category: 'Mandi' } }
  );
  console.log(`Updated ${mandiRes.modifiedCount} Mandi dishes`);

  const biryaniRes = await db.collection('dishes').updateMany(
    { name: /Biryani/i },
    { $set: { category: 'Biryani' } }
  );
  console.log(`Updated ${biryaniRes.modifiedCount} Biryani dishes`);
  
  m.disconnect();
}).catch(console.error);
