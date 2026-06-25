require('dotenv').config({ path: '.env' });
const axios = require('axios');

let token = process.env.WHATSAPP_ACCESS_TOKEN;
let phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

if (token) token = token.replace(/"/g, '');
if (phoneId) phoneId = phoneId.replace(/"/g, '');

console.log('Token starts with:', token ? token.substring(0, 10) + '...' : 'Missing');
console.log('Phone ID:', phoneId);

if (token && phoneId) {
  axios.post(
    `https://graph.facebook.com/v17.0/${phoneId}/messages`,
    {
      messaging_product: 'whatsapp',
      to: '917887009800', // User's actual number
      type: 'text',
      text: { body: 'Test' }
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  ).then(res => {
    console.log('Success:', res.data);
  }).catch(err => {
    console.log('Meta API Error:', err.response ? err.response.data : err.message);
  });
} else {
  console.log('Missing env vars locally!');
}
