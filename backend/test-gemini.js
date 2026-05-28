const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-pro-latest'];
  const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = gemini.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in 2 words");
      console.log(`GEMINI SUCCESS for ${modelName}:`, result.response.text());
    } catch (e) {
      console.error(`GEMINI ERROR for ${modelName}:`, e.message);
    }
  }
}

testGemini();
