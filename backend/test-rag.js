const { generateRagResponse } = require('./src/services/ai/ragPipeline.service');
const mongoose = require('mongoose');
require('dotenv').config();

async function testRAG() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // User ID doesn't matter much for a missing dish test
  const userId = "60c72b2f9b1d8b001c8e4a9a"; // Dummy
  
  const res = await generateRagResponse(userId, "How to cook laksani paneel?", "en");
  console.log("RAG RESPONSE:", res);
  
  process.exit(0);
}

testRAG();
