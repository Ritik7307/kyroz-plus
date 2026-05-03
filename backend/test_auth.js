const axios = require('axios');

const testAuth = async () => {
  console.log('--- STARTING AUTH DIAGNOSTIC ---');
  try {
    console.log('1. Testing Backend Connectivity...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('   RESULT:', health.data);

    console.log('\n2. Testing OTP Sending (to cravinghubknp@gmail.com)...');
    try {
      const otp = await axios.post('http://localhost:5000/api/auth/send-otp', {
        email: 'cravinghubknp@gmail.com'
      });
      console.log('   RESULT:', otp.data);
    } catch (e) {
      console.error('   OTP ERROR:', e.response?.data || e.message);
    }

  } catch (err) {
    console.error('   CRITICAL ERROR:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('   >>> BACKEND IS NOT ACCESSIBLE ON PORT 5000!');
    }
  }
  console.log('\n--- DIAGNOSTIC COMPLETE ---');
};

testAuth();
