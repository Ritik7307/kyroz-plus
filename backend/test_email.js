const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');

dotenv.config();

const testEmail = process.argv[2] || process.env.ADMIN_EMAIL || 'test@example.com';

async function testEmails() {
  console.log(`\n--- Testing Email Delivery to ${testEmail} ---\n`);

  // 1. Test Resend
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // 1. TEST RESEND API WITH SUBDOMAIN
    console.log('\n[TEST 1A] Testing Resend API with subdomain (send.kyrozplus.com)...');
    try {
      const data = await resend.emails.send({
        from: 'KYROZ Security <security@send.kyrozplus.com>',
        to: testEmail,
        subject: 'Resend Subdomain Test',
        html: '<p>This is a test from the subdomain.</p>'
      });

      if (data.error) {
        console.error('❌ Resend Subdomain Error:', data.error);
      } else {
        console.log('✅ Resend Subdomain Success! Message ID:', data.data?.id);
      }
    } catch (error) {
      console.error('❌ Resend SDK Error:', error);
    }

    // 2. TEST RESEND API WITH ROOT DOMAIN
    console.log('\n[TEST 1B] Testing Resend API with root domain (kyrozplus.com)...');
    try {
      const data = await resend.emails.send({
        from: 'KYROZ Security <security@kyrozplus.com>',
        to: testEmail,
        subject: 'Resend Root Domain Test',
        html: '<p>This is a test from the root domain.</p>'
      });

      if (data.error) {
        console.error('❌ Resend Root Domain Error:', data.error);
      } else {
        console.log('✅ Resend Root Domain Success! Message ID:', data.data?.id);
      }
    } catch (error) {
      console.error('❌ Resend SDK Error:', error);
    }
  } else {
    console.log('⚠️ RESEND_API_KEY not found in .env, skipping Resend test.');
  }

  console.log('\n----------------------------------------\n');

  // 2. Test Nodemailer
  console.log('[TEST 2] Testing Nodemailer (Gmail)...');
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify connection config
      await transporter.verify();
      console.log('✅ Nodemailer Transport verified. Credentials are correct.');

      const info = await transporter.sendMail({
        from: `"KYROZ Security" <${process.env.SMTP_USER}>`,
        to: testEmail,
        subject: 'KYROZ Email Test (Nodemailer)',
        html: '<p>This is a test email from Nodemailer.</p>'
      });
      console.log('✅ Nodemailer Success! Message ID:', info.messageId);
    } catch (e) {
      console.error('❌ Nodemailer Error:', e.message);
    }
  } else {
    console.log('⚠️ SMTP_USER or SMTP_PASS not found in .env, skipping Nodemailer test.');
  }
}

testEmails();
