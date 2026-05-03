import { GoogleGenerativeAI } from '@google/generative-ai';

const ai = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!ai) throw new Error("Gemini API Key not configured.");
  
  try {
    const model = ai.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;

    if (!embedding || !embedding.values) {
      throw new Error("Failed to generate embedding array.");
    }
    
    return embedding.values;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    throw new Error("Embedding generation failed.");
  }
};
