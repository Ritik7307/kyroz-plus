const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSmtp() {
  console.log('Starting SMTP test...');
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass:', process.env.SMTP_PASS ? '********' : 'NOT SET');

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
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection verified successfully!');

    const mailOptions = {
      from: `"KYROZ Test" <${process.env.SMTP_USER}>`,
      to: 'ritikprajapati7307@gmail.com', // Send to user
      subject: 'KYROZ SMTP Test',
      text: 'If you received this, your SMTP configuration is working!'
    };

    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP Test failed:');
    console.error(error);
  }
}

testSmtp();
