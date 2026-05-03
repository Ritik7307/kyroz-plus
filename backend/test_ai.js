const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function testAI() {
  console.log('--- KYROZ AI Diagnostic ---');
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is missing in .env file!');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey); // SDK usually defaults to v1 or v1beta correctly
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  try {
    console.log('Connecting to Google Gemini (Embedding)...');
    const result = await model.embedContent('Hello');
    console.log('SUCCESS: Embedding generated!');
  } catch (error) {
    console.error('FAILED: AI connection error.');
    console.error(error);
  }
}

testAI();
