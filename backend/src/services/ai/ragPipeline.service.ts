import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateEmbedding } from './embedding.service';
import { retrieveRelevantChunks } from './vectorStore.service';

const ai = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const generateRagResponse = async (userId: string, query: string): Promise<string> => {
  if (!ai) throw new Error("Gemini API Key not configured.");

  // 1. Convert Query to Embedding
  const queryEmbedding = await generateEmbedding(query);

  // 2. Retrieve Top K Chunks from Vector Store
  const relevantChunks = await retrieveRelevantChunks(userId, queryEmbedding, 3);

  if (relevantChunks.length === 0) {
    return "This is not available in KYROZ SOP.";
  }

  // 3. Build Strict Context Prompt
  const contextText = relevantChunks.map(chunk => 
    `[Dish: ${chunk.dish} | Section: ${chunk.section}]\n${chunk.content}\n---`
  ).join('\n');

  const systemInstruction = `
    You are KYROZ KOSA, an elite AI restaurant consultant. 
    You MUST strictly answer questions based ONLY on the provided SOP context chunks below. 
    If the answer is not in the context, say exactly: "This is not available in KYROZ SOP."
    Do NOT hallucinate. Do NOT use outside knowledge.

    Automatically detect the language of the user's query (e.g., Hindi, English, Hinglish).
    If they ask in Hinglish, respond in natural conversational Hinglish. 
    Make the response sound human, not robotic. 
    Keep responses short (5-7 lines), clear, and actionable.

    Required Format:
    Problem: [Brief summary]
    Cause: [Reason based on SOP]
    Solution: [Actionable advice based on SOP]
    SOP Reference: [Dish Name - Section]
    Practical Tip: [Humanized tip from the SOP or inferred context]

    Context Chunks:
    ${contextText}
  `;

  // 4. Send to Gemini 2.5 Flash
  try {
    const model = ai.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: query }] }],
      generationConfig: {
        temperature: 0.1,
      },
      systemInstruction: systemInstruction,
    });

    const response = result.response;
    return response.text() || "Failed to generate response.";
  } catch (error: any) {
    console.error("Error calling Gemini generation API:", error);
    throw new Error("AI generation failed.");
  }
};
