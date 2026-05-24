import { GoogleGenerativeAI } from '@google/generative-ai';

let aiInstance: GoogleGenerativeAI | null = null;
let isGeminiDisabled = false;

const getAiInstance = (): GoogleGenerativeAI | null => {
  if (isGeminiDisabled) return null;
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_KEY_HERE') {
      isGeminiDisabled = true;
      return null;
    }
    aiInstance = new GoogleGenerativeAI(apiKey);
  }
  return aiInstance;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const ai = getAiInstance();
  if (!ai) {
    throw new Error("Gemini API is disabled or not configured.");
  }
  
  try {
    const model = ai.getGenerativeModel({ model: "gemini-embedding-001" });
    
    // Set a strict 2-second timeout on the API request to prevent hangs
    const embeddingPromise = model.embedContent(text);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API request timed out")), 2000)
    );
    
    const result = await Promise.race([embeddingPromise, timeoutPromise]);
    const embedding = result.embedding;

    if (!embedding || !embedding.values) {
      throw new Error("Failed to generate embedding array.");
    }
    
    return embedding.values;
  } catch (error: any) {
    console.error("Embedding generation failed:", error);
    
    // Check for permanent authorization failures (e.g. 403 Forbidden, invalid key)
    const errorStr = String(error).toLowerCase();
    if (
      errorStr.includes("403") || 
      errorStr.includes("forbidden") || 
      errorStr.includes("denied") || 
      errorStr.includes("api key") || 
      errorStr.includes("not valid")
    ) {
      console.warn("Permanent auth/forbidden error detected for Gemini. Disabling Gemini embeddings for process lifetime to eliminate request latency.");
      isGeminiDisabled = true;
    }
    
    throw new Error("Embedding generation failed.");
  }
};
