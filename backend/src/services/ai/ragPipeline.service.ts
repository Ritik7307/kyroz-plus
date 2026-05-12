import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { generateEmbedding } from './embedding.service';
import { retrieveRelevantChunks, searchSopByText } from './vectorStore.service';
import Sop from '../../models/Sop';
import { processSopText } from './ingestion.service';

const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

/**
 * Rephrases a follow-up query to be standalone based on conversation history.
 * This is critical for "next step", "done", "ab?" to work with RAG.
 */
const contextualizeQuery = async (query: string, history: any[]): Promise<string> => {
  if (history.length === 0) return query;

  // Only contextualize short or ambiguous queries
  const shortQueries = ['next', 'ab', 'ab?', 'done', 'then', 'then?', 'iske baad', 'ho gaya', 'repeat', 'samjhao', 'explain', 'ruk jao', 'bas', 'रुको', 'बस'];
  const isShort = query.split(' ').length < 3 || shortQueries.some(q => query.toLowerCase().includes(q));
  
  if (!isShort) return query;

  try {
    const prompt = `
      History: ${history.slice(-3).map(m => `${m.role}: ${m.content}`).join(' | ')}
      Query: ${query}
      
      Based on the history, rephrase the query to be a specific standalone question for searching an SOP library. 
      Example: If history is about "Dal Makhani" and query is "next", rephrase to "What is the next step for Dal Makhani recipe?".
      Return ONLY the rephrased query text.
    `;

    if (groq) {
      const res = await groq.chat.completions.create({
        messages: [{ role: 'system', content: "Rephrase the query for SOP search." }, { role: 'user', content: prompt }],
        model: 'llama3-8b-8192', 
        temperature: 0,
      });
      return res.choices[0]?.message?.content || query;
    }

    if (gemini) {
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const res = await model.generateContent(prompt);
      return res.response.text() || query;
    }
  } catch (e) {
    console.warn("Contextualization failed:", e);
  }
  return query;
};

/**
 * Formats retrieved SOP data into a human-like response in the requested language.
 */
const formatResponse = (relevantChunks: any[], query: string, lang: string = 'en'): string => {
  const bestMatch = relevantChunks[0];
  const isHi = lang === 'hi';
  
  let response = isHi 
    ? `बिलकुल! **${bestMatch.dish.toUpperCase()}** के बारे में ये रही जानकारी:\n\n`
    : `Sure! Here is what I found for **${bestMatch.dish.toUpperCase()}**:\n\n`;
  
  response += `${bestMatch.content}\n\n`;

  response += isHi 
    ? `उम्मीद है ये काम आएगा। कुछ और पूछना हो तो बताइये!`
    : `Hope this helps! Let me know if you want to know anything else.`;
    
  return response;
};

/**
 * Fallback logic to retrieve SOP info using keyword search.
 */
const getFallbackResponse = async (userId: string, query: string, lang: string = 'en'): Promise<string> => {
  let relevantChunks = await searchSopByText(userId, query, 2);

  if (relevantChunks.length === 0) {
    const userSops = await Sop.find({ userId }).limit(10);
    if (userSops.length > 0) {
      for (const sop of userSops) {
        const content = (lang === 'hi' && sop.contentHi) ? sop.contentHi : (sop.contentEn || sop.content || '');
        await processSopText(userId, `SOP: ${sop.title}\n${content}`);
      }
      relevantChunks = await searchSopByText(userId, query, 2);
    }
  }

  if (relevantChunks.length === 0) {
    return lang === 'hi' 
      ? "माफ़ कीजिये, मुझे इसके बारे में SOP में जानकारी नहीं मिली।"
      : "I'm sorry, I couldn't find information about that in the SOP.";
  }

  return formatResponse(relevantChunks, query, lang);
};

export const generateRagResponse = async (userId: string, query: string, lang: string = 'en', history: any[] = [], context: string = ''): Promise<{ reply: string, suggestions: string[] }> => {
  const isCostingMode = context && context.includes('costing');
  console.log("AI Mode:", isCostingMode ? "COSTING" : "SOP", "| Context:", context);

  if (!gemini && !groq) {
    if (isCostingMode) return { reply: "AI services are currently unavailable. Please check your API keys.", suggestions: [] };
    const fallback = await getFallbackResponse(userId, query, lang);
    return { reply: fallback, suggestions: [] };
  }

  try {
    // 1. Contextualize the query
    const standaloneQuery = await contextualizeQuery(query, history);
    
    // 2. Prepare System Instruction & Context
    let contextText = '';
    
    // Retrieve SOP Context if not just costing mode
    if (!isCostingMode || query.toLowerCase().includes('recipe') || query.toLowerCase().includes('sop')) {
      const queryEmbedding = await generateEmbedding(standaloneQuery);
      const relevantChunks = await retrieveRelevantChunks(userId, queryEmbedding, 8);
      
      if (relevantChunks.length > 0) {
        contextText = relevantChunks.map(chunk => 
          `[SOP: ${chunk.dish} | Section: ${chunk.section}]\n${chunk.content}\n---`
        ).join('\n');
      }
    }

    const systemInstruction = `
You are a smart multilingual AI voice assistant for restaurant and kitchen staff. 
Your job is to help users with:
- Cooking instructions & Recipe explanation
- SOP guidance & Safety instructions
- Inventory, costing, and profit/loss explanation
- Kitchen workflow and staff support

==================================================
LANGUAGE & AUTO-DETECTION RULES
==================================================
- Understand Hindi, English, and Hinglish naturally.
- Always detect the user's language automatically.
- Reply in the SAME language the user used.
- If user select or speak Hindi: Reply in proper, easy-to-understand Hindi.
- If user mixes Hindi and English, reply in simple Hinglish.
- NEVER use difficult English words. Keep vocabulary simple.

==================================================
VOICE RESPONSE & PERSONALITY RULES
==================================================
- restate/Acknowledge Question: Briefly restate the question in the response language to confirm understanding (e.g., "Aapne pucha ki...").
- Proper Explanation: Explain logically and clearly. If it's a cooking question, explain "Kyun" (Why) and "Kaise" (How).
- VOICE FRIENDLY: Keep sentences short and conversational. 
- Speak like a helpful human assistant. Use a friendly and practical tone.
- Add natural pauses using commas and short sentences. 
- Avoid long paragraphs. Explain step-by-step.
- If the user sounds confused, simplify the explanation.
- PERSONALITY: Friendly, Fast, Clear, Helpful, Practical.
- Never say you are an AI language model.

==================================================
KITCHEN & OPERATIONS GUIDANCE
==================================================
- FOR SOPs: Read step-by-step. Explain difficult terms simply. Highlight important safety warnings. Never skip mandatory steps.
- FOR COOKING: Give exact measurements if available. Mention cooking time, temperature, and flame control. Explain alternatives if ingredients are missing.
- FOR COSTING: Calculate clearly. Explain profit/loss simply. Use Indian currency format (₹). 
  (Suggested Price Rule: Raw Cost × Category Multiplier. Round to: 49, 99, 149, etc.)

==================================================
SOP CONTEXT (STRICT ADHERENCE)
==================================================
Answer ONLY using the SOP context provided below. Never invent instructions.
If info is missing, say: "Mujhe iska exact instruction nahi mila."

SOP CONTEXT:
${contextText || 'No specific SOP context found for this query.'}

==================================================
RECOMMENDATIONS
==================================================
Provide 2-3 short, relevant follow-up questions inside a [SUGGESTIONS] block.
Example: [SUGGESTIONS] "Next Step?", "Safety check?", "Costing?"
Example: [SUGGESTIONS] "अगला स्टेप?", "सावधानी क्या रखें?", "कीमत कितनी रखें?"

==================================================
CURRENT SESSION INFO
==================================================
User Language Context: ${lang === 'hi' ? 'Hindi' : 'Hinglish'}
Context Path: ${context}
`;

    // 3. Generate response
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    let rawReply = '';

    if (groq) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemInstruction },
            ...formattedHistory,
            { role: 'user', content: query }
          ] as any,
          model: 'llama3-70b-8192',
          temperature: 0.2,
        });
        rawReply = chatCompletion.choices[0]?.message?.content || "No response generated.";
      } catch (e) {
        console.error("Groq error:", e);
      }
    }

    if (!rawReply && gemini) {
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(`System Instruction: ${systemInstruction}\n\nUser Question: ${query}`);
      rawReply = result.response.text();
    }

    if (!rawReply) {
      const fallback = isCostingMode ? "AI failed to respond." : await getFallbackResponse(userId, query, lang);
      return { reply: fallback, suggestions: [] };
    }

    // Parse suggestions from [SUGGESTIONS] block
    let reply = rawReply;
    let suggestions: string[] = [];
    const suggestionMatch = rawReply.match(/\[SUGGESTIONS\](.*)$/is);
    
    if (suggestionMatch) {
      reply = rawReply.replace(/\[SUGGESTIONS\].*$/is, '').trim();
      const suggestionText = suggestionMatch[1];
      suggestions = suggestionText
        .split(/[,"\n]/)
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(s => s.length > 2 && s.length < 50);
    }

    return { reply, suggestions };
  } catch (error) {
    console.error("RAG error:", error);
    const fallback = isCostingMode ? "AI Error." : await getFallbackResponse(userId, query, lang);
    return { reply: fallback, suggestions: [] };
  }
};
