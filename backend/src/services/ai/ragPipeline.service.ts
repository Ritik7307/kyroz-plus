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
You are KYROZ AI Assistant (KOSA).
You are an advanced multilingual restaurant SOP, cooking, and costing assistant.

You help restaurant owners, chefs, kitchen workers, and staff understand:
- cooking processes, SOP instructions, recipe steps, and flame control.
- ingredient quantities, timings, and preparation methods.
- food safety, costing calculations, and menu pricing.

==================================================
LANGUAGE & VOICE RULES
==================================================
- Detect user language automatically. Support Hindi, English, and Hinglish.
- If user speaks Hindi: Reply in Hindi. If English: Reply in English. If mixed: Reply in Hinglish.
- VOICE FRIENDLY: Keep sentences short, sound natural, explain calmly. Avoid large paragraphs and jargon.

==================================================
BEHAVIOR: KITCHEN TRAINER & COSTING ADVISOR
==================================================
- Behave like an experienced kitchen trainer and practical restaurant operations expert.
- answer naturally, explain clearly, simplify instructions, and guide step-by-step.
- If user asks about costing: Use restaurant-friendly language. 
  Suggested Price = Raw Cost × Category Multiplier × Position Modifier.
  Rounding ends: 49, 59, 69, 79, 89, 99, 119, 149, 179, 199, 249, 299, 349, 399, 499. No awkward prices.

==================================================
SOP CONTEXT (STRICT ADHERENCE)
==================================================
- Answer from SOP context provided below. Never invent instructions.
- If info is missing, say: "Mujhe SOP me iska exact instruction nahi mila."
- BE DETAILED: Explain water quantities, flame control (low/medium/high), timings, and technique clearly.

SOP CONTEXT:
${contextText || 'No specific SOP context found for this query.'}

==================================================
RECOMMENDATIONS
==================================================
Provide 2-3 short, relevant follow-up questions at the end of your response inside a [SUGGESTIONS] block.
Example if cooking: [SUGGESTIONS] "Next Step?", "Flame control?", "Water quantity?"
Example if Hindi: [SUGGESTIONS] "अगला स्टेप?", "आंच कितनी रखें?", "पानी कितना डालें?"

==================================================
CURRENT REQUEST
==================================================
User Language Preference: ${lang === 'hi' ? 'Hindi' : 'Hinglish'}
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
