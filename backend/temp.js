const m = require('mongoose'); 
m.connect('mongodb+srv://vijayshankarprajapati29_db_user:raghav123@cluster0.wf2za1x.mongodb.net/?appName=Cluster0').then(async () => { 
  const db = m.connection.db; 
  const dishes = await db.collection('dishes').find({ name: /Biryani|Mandi/i }).toArray(); 
  dishes.forEach(d => console.log(d.name, '->', d.category)); 
  m.disconnect(); 
}).catch(console.error);
