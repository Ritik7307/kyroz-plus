const { generateSpeech } = require('./src/services/ai/voice.service');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });

async function testSpeak() {
  console.log("Calling generateSpeech for Hindi...");
  try {
    const buffer = await generateSpeech("नमस्ते! मैं कोसा हूँ।", "hi");
    console.log("SUCCESS! Generated audio buffer of size:", buffer.length);
  } catch (error) {
    console.error("FAILED to generate speech:", error.message);
  }
}

testSpeak();
