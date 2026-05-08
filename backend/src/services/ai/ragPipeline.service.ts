import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { generateEmbedding } from './embedding.service';
import { retrieveRelevantChunks, searchSopByText } from './vectorStore.service';
import Sop from '../../models/Sop';
import { processSopText } from './ingestion.service';

const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

/**
 * Formats retrieved SOP data into a human-like response in the requested language.
 */
const formatResponse = (relevantChunks: any[], query: string, lang: string = 'en'): string => {
  const bestMatch = relevantChunks[0];
  const otherMatch = relevantChunks[1];

  const isHi = lang === 'hi';
  
  let response = isHi 
    ? `नमस्ते! आपके **${bestMatch.dish.toUpperCase()}** (${bestMatch.section}) के SOP के आधार पर, यहाँ जानकारी है:\n\n`
    : `Namaste! Based on your SOP for **${bestMatch.dish.toUpperCase()}** (${bestMatch.section}), here is what you need:\n\n`;
  
  if (bestMatch.section.includes('TROUBLESHOOTING')) {
    response += isHi ? `**समस्या:** ${query}\n` : `**Issue:** ${query}\n`;
    response += isHi ? `**समाधान:** ${bestMatch.content}\n\n` : `**Fix:** ${bestMatch.content}\n\n`;
  } else {
    response += `${bestMatch.content}\n\n`;
  }

  if (otherMatch && otherMatch.dish === bestMatch.dish && otherMatch.section !== bestMatch.section) {
    response += isHi 
      ? `**अतिरिक्त टिप (${otherMatch.section}):**\n${otherMatch.content}\n\n`
      : `**Additional Tip (${otherMatch.section}):**\n${otherMatch.content}\n\n`;
  }

  response += isHi 
    ? `आशा है कि यह मदद करेगा! मुझे बताएं कि क्या आपको कुछ और चाहिए।`
    : `Hope this helps! Let me know if you need anything else.`;
    
  return response;
};

/**
 * Fallback logic to retrieve SOP info using keyword search.
 */
const getFallbackResponse = async (userId: string, query: string, lang: string = 'en'): Promise<string> => {
  console.log(`Using Text Search Fallback for query (${lang}):`, query);
  let relevantChunks = await searchSopByText(userId, query, 2);

  if (relevantChunks.length === 0) {
    const userSops = await Sop.find({ userId }).limit(20);
    if (userSops.length > 0) {
      for (const sop of userSops) {
        const content = (lang === 'hi' && sop.contentHi) ? sop.contentHi : (sop.contentEn || sop.content || '');
        const text = `SOP: ${sop.title}\nGENERAL INFO\n${content}`;
        try {
          await processSopText(userId, text);
        } catch (e) {
          console.warn(`Failed to sync SOP: ${sop.title}`);
        }
      }
      relevantChunks = await searchSopByText(userId, query, 2);
    }
  }

  if (relevantChunks.length === 0) {
    return lang === 'hi' 
      ? "नमस्ते! मैंने लाइब्रेरी की जाँच की, लेकिन मुझे आपके KYROZ SOP में आपके अनुरोध के लिए कोई सीधा मिलान नहीं मिला। कृपया किसी विशिष्ट डिश या खाना पकाने की प्रक्रिया के बारे में पूछें।"
      : "Namaste! I checked the library, but I couldn't find a direct match for your request in your KYROZ SOPs. Try asking about a specific dish name or cooking process.";
  }

  return formatResponse(relevantChunks, query, lang);
};

export const generateRagResponse = async (userId: string, query: string, lang: string = 'en'): Promise<string> => {
  // If no AI key is provided, use fallback immediately
  if (!gemini && !groq) {
    return await getFallbackResponse(userId, query, lang);
  }

  try {
    const queryEmbedding = await generateEmbedding(query);
    const relevantChunks = await retrieveRelevantChunks(userId, queryEmbedding, 3);

    if (relevantChunks.length === 0) {
      return await getFallbackResponse(userId, query, lang);
    }

    const contextText = relevantChunks.map(chunk => 
      `[Dish: ${chunk.dish} | Section: ${chunk.section}]\n${chunk.content}\n---`
    ).join('\n');

    const systemInstruction = `
      You are KYROZ KOSA, an elite AI restaurant consultant. 
      You MUST strictly answer questions based ONLY on the provided SOP context chunks below. 
      If the answer is not in the context, say exactly: "This is not available in KYROZ SOP."
      Do NOT hallucinate. Do NOT use outside knowledge.
      
      Language: ${lang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.
      Respond entirely in ${lang === 'hi' ? 'Hindi' : 'English'}.
      
      Required Format: Problem, Cause, Solution, SOP Reference, Practical Tip.
      Context: ${contextText}
    `;

    // 1. Try Groq (Llama 3 70B) if available - Usually faster and better at following strict instructions
    if (groq) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: query }
          ],
          model: 'llama3-70b-8192',
          temperature: 0.1,
          max_tokens: 1024,
        });
        return chatCompletion.choices[0]?.message?.content || "Failed to generate response with Groq.";
      } catch (groqErr) {
        console.error("Groq failed, attempting Gemini fallback:", groqErr);
      }
    }

    // 2. Fallback to Gemini if Groq is missing or failed
    if (gemini) {
      const model = gemini.getGenerativeModel({ model: "gemini-flash-latest" });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: query }] }],
        generationConfig: { temperature: 0.1 },
        systemInstruction: systemInstruction,
      });
      return result.response.text() || "Failed to generate response with Gemini.";
    }

    return await getFallbackResponse(userId, query, lang);
  } catch (error: any) {
    console.error("AI Pipeline failed, falling back to text search:", error);
    return await getFallbackResponse(userId, query, lang);
  }
};
