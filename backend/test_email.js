const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

async function testEmail() {
  console.log('--- KYROZ Email Diagnostic ---');
  console.log('Testing with User:', process.env.SMTP_USER);
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('ERROR: Missing SMTP_USER or SMTP_PASS in .env file!');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    console.log('Connecting to Google...');
    await transporter.verify();
    console.log('SUCCESS: Connection is valid! Your credentials are correct.');
  } catch (error) {
    console.error('FAILED: Could not connect to Gmail.');
    console.error('Reason:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\nTIP: Google rejected your password.');
      console.log('1. Ensure you are using a 16-character APP PASSWORD, not your normal password.');
      console.log('2. Ensure there are NO SPACES in the password in your .env file.');
    } else if (error.message.includes('ETIMEOUT')) {
      console.log('\nTIP: Connection timed out. Check your internet or if a firewall is blocking port 465.');
    }
  }
}

testEmail();
