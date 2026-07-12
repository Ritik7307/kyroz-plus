const mongoose = require('mongoose');

const uri = 'mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0';

async function testConnection() {
  console.log('Attempting to connect...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
