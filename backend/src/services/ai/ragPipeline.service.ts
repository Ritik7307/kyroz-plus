import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { generateEmbedding } from './embedding.service';
import { retrieveRelevantChunks, searchSopByText } from './vectorStore.service';
import Sop from '../../models/Sop';

const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Calculate Levenshtein distance between two strings
const getSimilarity = (s1: string, s2: string): number => {
  let longer = s1.toLowerCase();
  let shorter = s2.toLowerCase();
  if (s1.length < s2.length) { longer = s2.toLowerCase(); shorter = s1.toLowerCase(); }
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  const costs = new Array();
  for (let i = 0; i <= longerLength; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longerLength - costs[shorter.length]) / longerLength;
};

const contextualizeQuery = async (userId: string, query: string, history: any[]): Promise<string> => {
  let processedQuery = query;

  // 1. Dish Name Auto-Correction (Fuzzy Matching)
  try {
    const dishes = await Sop.find({ userId }).select('title').lean();
    const queryLower = query.toLowerCase();

    let bestDishMatch = null;
    let highestScore = 0;

    for (const d of dishes) {
      if (!d.title) continue;
      const dishName = d.title.toLowerCase();
      // Exact match
      if (queryLower.includes(dishName)) {
        bestDishMatch = d.title;
        highestScore = 1;
        break;
      }

      // Check similarity of query against the dish name
      // We check if any sequence of words in the query matches the dish name
      const queryWords = queryLower.split(/\s+/);
      const dishWordCount = dishName.split(/\s+/).length;

      for (let i = 0; i <= queryWords.length - dishWordCount; i++) {
        const querySegment = queryWords.slice(i, i + dishWordCount).join(' ');
        const score = getSimilarity(dishName, querySegment);
        if (score > highestScore) {
          highestScore = score;
          bestDishMatch = d.title;
        }
      }

      // Also check overall similarity if query is very short
      if (queryWords.length <= dishWordCount + 2) {
        const score = getSimilarity(dishName, queryLower);
        if (score > highestScore) {
          highestScore = score;
          bestDishMatch = d.title;
        }
      }
    }

    // If similarity is above 65%, auto-correct the query
    if (highestScore > 0.65 && bestDishMatch) {
      processedQuery = bestDishMatch; // Auto-replace with official name
    }
  } catch (e) { console.error("Fuzzy Match Error:", e); }

  return processedQuery; // Skip the slow LLM rephrasing to save massive latency
};

const getFallbackResponse = async (userId: string, query: string, lang: string = 'en'): Promise<string> => {
  try {
    const relevantChunks = await searchSopByText(userId, query, 1);
    const isHi = lang === 'hi';

    if (!relevantChunks || relevantChunks.length === 0) {
      return isHi ? "माफ़ कीजिये, मुझे इसके बारे में SOP में जानकारी नहीं मिली।" : "I'm sorry, I couldn't find that in the SOP library.";
    }

    const bestMatch = relevantChunks[0];
    const queryLower = query.toLowerCase();
    const dishLower = bestMatch.dish.toLowerCase();

    // Strict Match Check for Fallback: Does the query actually mention this dish?
    const dishWords = dishLower.split(/\s+/).filter(w => w.length > 3);
    // Use EVERY instead of SOME to ensure all major keywords match, preventing "Lashni Paneer" from matching "Paneer Lababdar"
    const hasDishMatch = dishWords.every(word => queryLower.includes(word.substring(0, 4))) || queryLower.includes(dishLower);

    if (!hasDishMatch) {
      return isHi
        ? `मुझे आपकी लाइब्रेरी में यह रेसिपी नहीं मिली। क्या आप **${bestMatch.dish.toUpperCase()}** के बारे में जानना चाहते थे?`
        : `I couldn't find that recipe. Did you mean **${bestMatch.dish.toUpperCase()}**?`;
    }

    const baseReply = isHi
      ? `बिलकुल! **${bestMatch.dish.toUpperCase()}** के बारे में ये रही जानकारी:\n\n${bestMatch.content}`
      : `Sure! Here is the info for **${bestMatch.dish.toUpperCase()}**:\n\n${bestMatch.content}`;

    return baseReply;
  } catch (e) {
    return lang === 'hi' ? "डेटा प्राप्त करने में त्रुटि हुई।" : "Error retrieving data.";
  }
};

const detectLanguage = (text: string): 'en' | 'hi' => {
  // Simple regex check for Devanagari characters
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
};

export const generateRagResponse = async (userId: string, query: string, lang: string = 'en', history: any[] = [], context: string = ''): Promise<{ reply: string, suggestions: string[], detectedLang: string }> => {
  try {
    // Smart Language Logic:
    // 1. If query has Hindi characters, always respond in Hindi.
    // 2. Otherwise, use the user's selected language (from the toggle).
    const hasHindi = /[\u0900-\u097F]/.test(query);
    const targetLang = hasHindi ? 'hi' : (lang === 'hi' ? 'hi' : 'en');

    const standaloneQuery = await contextualizeQuery(userId, query, history);
    let contextText = '';

    try {
      if (gemini) {
        const queryEmbedding = await generateEmbedding(standaloneQuery);
        const relevantChunks = await retrieveRelevantChunks(userId, queryEmbedding, 8, standaloneQuery);
        if (relevantChunks.length > 0) {
          contextText = relevantChunks.map(chunk => `[SOP: ${chunk.dish}]\n${chunk.content}`).join('\n---\n');
        }
      }
    } catch (e) {
      const textChunks = await searchSopByText(userId, standaloneQuery, 5);
      if (textChunks.length > 0) {
        contextText = textChunks.map(chunk => `[SOP: ${chunk.dish}]\n${chunk.content}`).join('\n---\n');
      }
    }

    const systemInstruction = `
You are KOSA, a professional kitchen assistant for Kyroz Plus.
Your goal is to answer questions about recipes (SOPs) from the provided context.

STRICT RULES:
1. LANGUAGE: You MUST respond entirely in ${targetLang === 'hi' ? 'Hindi (हिंदी)' : 'English'}. Translate the context if needed.
2. SPECIFICITY: Only answer the specific question asked. Do not provide the full recipe unless requested.
3. SOURCE: Use ONLY the provided SOP CONTEXT. If the answer is not in the context, say you don't know.

SOP CONTEXT:
${contextText || 'No matching SOP found in the library.'}

Provide exactly 3 short follow-up suggestions in a [SUGGESTIONS] block at the end.
`;

    const cleanHistory = history.filter(m => m.content !== query);

    let rawReply = '';

    if (groq) {
      try {
        const formattedHistory = cleanHistory.map(m => ({
          role: (m.role === 'user' || m.role === 'human') ? 'user' : 'assistant',
          content: m.content
        })).slice(-6); // Keep history short

        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemInstruction },
            ...formattedHistory,
            { role: 'user', content: query }
          ] as any,
          model: 'llama-3.1-8b-instant',
          temperature: 0.2,
          max_tokens: 512, // Reduce max tokens to speed up output
        });
        rawReply = completion.choices[0]?.message?.content || "";
      } catch (e: any) {
        console.error("Groq Error:", e.message);
      }
    }

    if (!rawReply && gemini) {
      try {
        const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const geminiHistory = [];
        let lastRole = '';

        for (const m of cleanHistory) {
          const role = (m.role === 'user' || m.role === 'human') ? 'user' : 'model';
          // Gemini MUST start with user. If the first message is model, skip it.
          if (geminiHistory.length === 0 && role === 'model') continue;

          if (role !== lastRole) {
            geminiHistory.push({ role, parts: [{ text: m.content }] });
            lastRole = role;
          }
        }

        // If history still ends with model, it's fine as sendMessage adds a user message.
        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(`System Instructions: ${systemInstruction}\n\nUser Question: ${query}`);
        rawReply = result.response.text();
      } catch (e) { console.error("Gemini fail", e); }
    }

    if (!rawReply) {
      return {
        reply: await getFallbackResponse(userId, standaloneQuery, targetLang),
        suggestions: [],
        detectedLang: targetLang
      };
    }

    let reply = rawReply;
    let suggestions: string[] = [];
    const suggestionMatch = rawReply.match(/\[SUGGESTIONS\](.*)$/is);
    if (suggestionMatch) {
      reply = rawReply.replace(/\[SUGGESTIONS\].*$/is, '').trim();
      suggestions = suggestionMatch[1].split(/[\n,]/).map(s => s.trim().replace(/[*"-]/g, '')).filter(s => s.length > 2);
    }
    return { reply, suggestions, detectedLang: targetLang };
  } catch (err: any) {
    console.error("Global Error:", err);
    return { reply: "Technical error occurred.", suggestions: [], detectedLang: lang || 'en' };
  }
};
