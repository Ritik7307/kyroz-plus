const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  try {
    const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello in 2 words");
    console.log("GEMINI SUCCESS:", result.response.text());
  } catch (e) {
    console.error("GEMINI ERROR:", e.message);
  }
}

testGemini();
