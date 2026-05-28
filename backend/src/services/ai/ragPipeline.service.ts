import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';
import Groq from 'groq-sdk';

import { generateEmbedding } from './embedding.service';

import { retrieveRelevantChunks, searchSopByText } from './vectorStore.service';

import Sop from '../../models/Sop';

import SopChunk from '../../models/SopChunk';

import MasterSop from '../../models/MasterSop';

import { processSopText } from './ingestion.service';

import { syncMasterSopsForUser } from '../sop.service';



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



// Correct common phonetic voice-to-text spelling issues

const correctPhoneticTypos = (query: string): string => {

  let cleaned = query.toLowerCase();



  // Phrase level mappings

  const phraseMappings: Record<string, string> = {

    'lye siddeley': 'rice idli',

    'lye sidley': 'rice idli',

    'mini-stries': 'mini size',

    'mini ministries': 'mini size',

    'coco chatni': 'coconut chutney',

    'coco chutney': 'coconut chutney',

    'cara chutney': 'red kara chutney',

    'cada chutney': 'red kara chutney',

    'medu wada': 'medu vada',

    'mendu wada': 'medu vada',

    'mendu vada': 'medu vada',

    'medu wada maker': 'medu vada maker',

    'alu masala': 'aloo masala',

    'rawa dosa': 'rava dosa',

    'rawa dhosa': 'rava dosa',

    'rava dhosa': 'rava dosa',

  };



  for (const [typo, correction] of Object.entries(phraseMappings)) {

    cleaned = cleaned.replace(new RegExp(`\\b${typo}\\b`, 'gi'), correction);

  }



  // Word level mappings

  const wordMappings: Record<string, string> = {

    'siddeley': 'idli',

    'sidley': 'idli',

    'idly': 'idli',

    'idlies': 'idli',

    'edli': 'idli',

    'edly': 'idli',

    'dhosa': 'dosa',

    'dosha': 'dosa',

    'tosa': 'dosa',

    'utappa': 'uttapam',

    'uttapa': 'uttapam',

    'utapam': 'uttapam',

    'uthapam': 'uttapam',

    'oothapam': 'uttapam',

    'sambar': 'sambhar',

    'shambar': 'sambhar',

    'shambhar': 'sambhar',

    'sombar': 'sambhar',

    'wada': 'vada',

    'bada': 'vada',

    'vadha': 'vada',

    'briyani': 'biryani',

    'birani': 'biryani',

    'beryani': 'biryani',

    'chatni': 'chutney',

    'chutny': 'chutney',

    'chatney': 'chutney',

    'mandy': 'mandi',

    'alu': 'aloo',

    'rawa': 'rava',

    'kada': 'kara',

    'cara': 'kara',

    'luckonowi': 'lucknowi',

    'lucknawi': 'lucknowi',

    'lucknow': 'lucknowi',

  };



  const words = cleaned.split(/\s+/);

  const correctedWords = words.map(w => {

    const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    if (wordMappings[cleanWord]) {

      return w.replace(cleanWord, wordMappings[cleanWord]);

    }

    return w;

  });



  return correctedWords.join(' ');

};



// Clean noise terms from dish titles for matching purposes

const cleanDishNameForMatching = (name: string): string => {

  return name.toLowerCase()

    .replace(/\bsop\b/g, '')

    .replace(/\binstant\b/g, '')

    .replace(/\bpremium\b/g, '')

    .replace(/\bkyroz\b/g, '')

    .replace(/[()]/g, '')

    .trim()

    .replace(/\s+/g, ' ');

};



const matchDishByKeywords = (englishQuery: string, dishes: { title: string }[]): string | null => {

  const queryLower = englishQuery.toLowerCase();

  const stopwords = new Set([

    'how', 'make', 'cook', 'recipe', 'prepare', 'need', 'want', 'get', 'show', 'give', 

    'find', 'does', 'what', 'where', 'easy', 'step', 'steps', 'method', 'way', 'info', 

    'information', 'detail', 'details', 'about', 'from', 'with', 'within', 'made', 'done'

  ]);

  

  const queryWords = queryLower

    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")

    .split(/\s+/)

    .filter(w => w.length > 2 && !stopwords.has(w));



  let bestMatch: string | null = null;

  let maxMatchCount = 0;

  let bestDishWordCount = 0;



  for (const d of dishes) {

    if (!d.title) continue;

    const cleanedTitle = cleanDishNameForMatching(d.title);

    const dishWords = cleanedTitle.split(/\s+/).filter(w => w.length > 2);

    

    // Count matches

    let matchCount = 0;

    for (const qw of queryWords) {

      if (dishWords.includes(qw)) {

        matchCount++;

      } else {

        // Allow minor fuzzy matching on words (e.g. spelling errors)

        for (const dw of dishWords) {

          if (getSimilarity(qw, dw) > 0.8) {

            matchCount++;

            break;

          }

        }

      }

    }



    if (matchCount > 0) {

      // For multi-word dishes (>= 2 keywords), we need at least 2 matches

      // For single-word dishes (1 keyword), 1 match is sufficient if it's an exact/close match

      const isQualifying = dishWords.length >= 2 ? matchCount >= 2 : matchCount >= 1;

      

      if (isQualifying) {

        // Prioritize the dish that matches more words

        if (matchCount > maxMatchCount) {

          maxMatchCount = matchCount;

          bestMatch = d.title;

          bestDishWordCount = dishWords.length;

        } else if (matchCount === maxMatchCount) {

          // Tie-breaker: prefer the more specific dish (fewer total words)

          if (bestDishWordCount === 0 || dishWords.length < bestDishWordCount) {

            bestMatch = d.title;

            bestDishWordCount = dishWords.length;

          }

        }

      }

    }

  }



  return bestMatch;

};



const translateToEnglish = async (query: string): Promise<string> => {

  if (!groq) return query;

  try {

    const completion = await groq.chat.completions.create({

      messages: [

        {

          role: 'system',

          content: 'Translate the kitchen query to English. Correct any spelling errors, transcription typos, or phonetics (e.g. "बिर्यानी" to "Biryani", "लक्नदी" to "Lucknowi", "Lye Siddeley" to "Rice Idli"). Reply ONLY with the plain English translation, nothing else.'

        },

        { role: 'user', content: query }

      ],

      model: 'llama-3.3-70b-versatile',

      temperature: 0.1,

      max_tokens: 30,

    });

    return completion.choices[0]?.message?.content?.trim() || query;

  } catch (e) {

    console.error("Translation error in RAG:", e);

    // Fallback to Gemini if Groq fails (e.g. 429 Rate Limits)
    if (gemini) {
      try {
        const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(`Translate the kitchen query to English. Correct any spelling errors, transcription typos, or phonetics (e.g. "बिर्यानी" to "Biryani", "लक्नदी" to "Lucknowi", "Lye Siddeley" to "Rice Idli"). Reply ONLY with the plain English translation, nothing else.\n\nQuery: ${query}`);
        return result.response.text().trim() || query;
      } catch (geminiErr) {
        console.error("Translation fallback to Gemini failed:", geminiErr);
      }
    }

    return query;

  }

};

const HINDI_PHONETIC_MAP: Record<string, string> = {
  'लखनवी': 'lucknowi',
  'लक्नदी': 'lucknowi',
  'बिरयानी': 'biryani',
  'बिर्यानी': 'biryani',
  'पिर्यानी': 'biryani',
  'दोसा': 'dosa',
  'डोसा': 'dosa',
  'मंडी': 'mandi',
  'इडली': 'idli',
  'चटनी': 'chutney',
  'सांबर': 'sambhar',
  'वड़ा': 'vada',
  'उत्तपम': 'uttapam',
  'पनीर': 'paneer',
  'मशरूम': 'mushroom',
  'वेग': 'veg',
  'चिकन': 'chicken',
  'मटन': 'mutton',
  'पिज्जा': 'pizza',
  'बर्गर': 'burger',
  'पास्ता': 'pasta',
  'सैंडविच': 'sandwich',
  'मोमो': 'momo',
  'सूप': 'soup',
  'नूडल्स': 'noodles'
};

const HINGLISH_MAP: Record<string, string> = {
  'luckonowi': 'lucknowi',
  'laksani': 'lucknowi',
  'lakhnavi': 'lucknowi',
  'biryani': 'biryani',
  'piryani': 'biryani',
  'briyani': 'biryani',
  'dosa': 'dosa',
  'dhosa': 'dosa'
};

const translatePhoneticsLocally = (query: string): string => {
  let cleaned = query.toLowerCase();
  for (const [hiWord, enWord] of Object.entries(HINDI_PHONETIC_MAP)) {
    const regex = new RegExp(hiWord, 'g');
    cleaned = cleaned.replace(regex, enWord);
  }
  for (const [hiWord, enWord] of Object.entries(HINGLISH_MAP)) {
    const regex = new RegExp(hiWord, 'g');
    cleaned = cleaned.replace(regex, enWord);
  }
  return cleaned;
};

const contextualizeQuery = async (userId: string, query: string, history: any[]): Promise<string> => {

  const normalizedQuery = translatePhoneticsLocally(query);

  const hasDevanagari = /[\u0900-\u097F]/.test(normalizedQuery);



  try {

    const dishes = await Sop.find({ userId }).select('title').lean();



    // 1. Try to match directly on the normalized query (very fast, covers 90% of cases!)

    const directMatch = matchDishByKeywords(normalizedQuery, dishes as any);

    if (directMatch) {

      return directMatch;

    }



    // 2. If not matched, translate to English

    const englishQuery = await translateToEnglish(query);



    // 3. Try matching on the translated query

    const translatedMatch = matchDishByKeywords(englishQuery, dishes as any);

    if (translatedMatch) {

      return translatedMatch;

    }



    // 4. Fallback to existing Levenshtein distance check on englishQuery

    let processedQuery = englishQuery;

    const queryLower = englishQuery.toLowerCase();

    let bestDishMatch = null;

    let highestScore = 0;



    for (const d of dishes) {

      if (!d.title) continue;

      const dishName = d.title.toLowerCase();

      // Exact match

      if (queryLower.includes(dishName)) {

        bestDishMatch = d.title;

        highestScore = 1.0;

        break;

      }



      // Check cleaned dish name overlaps

      const cleanedDish = cleanDishNameForMatching(d.title);

      if (cleanedDish && (queryLower.includes(cleanedDish) || cleanedDish.includes(queryLower))) {

        const score = queryLower.includes(cleanedDish) ? 0.95 : 0.8;

        if (score > highestScore) {

          highestScore = score;

          bestDishMatch = d.title;

        }

      }



      // Check similarity of query against the dish name

      const queryWords = queryLower.split(/\s+/);

      const dishWords = dishName.split(/\s+/);

      const dishWordCount = dishWords.length;



      for (let i = 0; i <= queryWords.length - dishWordCount; i++) {

        const querySegment = queryWords.slice(i, i + dishWordCount).join(' ');

        const score = getSimilarity(dishName, querySegment);

        if (score > highestScore) {

          highestScore = score;

          bestDishMatch = d.title;

        }

      }



      if (queryWords.length <= dishWordCount + 2) {

        const score = getSimilarity(dishName, queryLower);

        if (score > highestScore) {

          highestScore = score;

          bestDishMatch = d.title;

        }

      }

    }



    if (highestScore > 0.65 && bestDishMatch) {

      processedQuery = bestDishMatch;

    }

    return processedQuery;

  } catch (e) {

    console.error("Fuzzy Match Error:", e);

    return query;

  }

};



const getFallbackResponse = async (userId: string, query: string, lang: string = 'en'): Promise<string> => {

  try {

    const relevantChunks = await searchSopByText(userId, query, 1, lang);

    const isHi = lang === 'hi';



    if (!relevantChunks || relevantChunks.length === 0) {

      return isHi ? "मेरे पास SOP लाइब्रेरी में यह रेसिपी नहीं है।" : "I do not have this recipe in my SOP library.";

    }



    const bestMatch = relevantChunks[0];

    const queryLower = query.toLowerCase();

    const dishLower = bestMatch.dish.toLowerCase();



    // Check if the query contains any of the core dish keywords

    const cleanedDish = cleanDishNameForMatching(bestMatch.dish);

    const dishKeywords = cleanedDish.split(/\s+/).filter(w => w.length > 2);

    const hasDishMatch = dishKeywords.some(word => queryLower.includes(word)) || queryLower.includes(cleanedDish) || queryLower.includes(dishLower);



    if (!hasDishMatch) {

      return isHi ? "मेरे पास SOP लाइब्रेरी में यह रेसिपी नहीं है।" : "I do not have this recipe in my SOP library.";

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

    // Ensure all master SOPs are chunked and indexed for this user (run asynchronously in background to avoid blocking latency)

    Promise.resolve().then(async () => {

      try {

        if (mongoose.connection.readyState !== 1) return;
        const masterSops = await MasterSop.find({}).lean();

        const userChunksDishes = await SopChunk.distinct('dish', { userId });

        const userChunksDishesSet = new Set(userChunksDishes.map(d => d.toLowerCase()));

        

        const missingMasterSops = masterSops.filter(m => !userChunksDishesSet.has(m.title.toLowerCase()));

        

        if (missingMasterSops.length > 0) {

          console.log(`User ${userId} is missing ${missingMasterSops.length} master SOPs in vector store. Syncing in background...`);

          await syncMasterSopsForUser(userId);

          

          for (const sop of missingMasterSops) {

            try {

              if (sop.contentEn) {

                const contentEn = `SOP: ${sop.title}\n\n${sop.contentEn}`;

                await processSopText(userId, contentEn, 'en');

              }

              if (sop.contentHi) {

                const contentHi = `SOP: ${sop.title}\n\n${sop.contentHi}`;

                await processSopText(userId, contentHi, 'hi');

              }

            } catch (e: any) {

              console.error(`Auto-sync failed for missing master SOP ${sop.title}:`, e.message);

            }

          }

          console.log(`Auto-sync background complete for user ${userId}.`);

        }

      } catch (err: any) {

        console.error("Auto-sync background check failed:", err.message);

      }

    }).catch(err => console.error("Auto-sync background promise rejected:", err));



    // 1. Correct any phonetic typos from voice-to-text transcription

    const cleanedQuery = correctPhoneticTypos(query);



    // Smart Language Logic:

    // 1. If the user explicitly selected 'en' or 'hi', respect their choice.

    // 2. If 'lang' is not specified or set to 'auto', fallback to auto-detection from the query.

    const hasHindi = /[\u0900-\u097F]/.test(cleanedQuery);

    const targetLang = (lang === 'en' || lang === 'hi')

      ? lang

      : (hasHindi ? 'hi' : 'en');

    // Local Troubleshooting & Expert Rules (for absolute resiliency against LLM rate-limits)
    const normalizedQueryForCheck = cleanedQuery.toLowerCase();
    const isHiLanguage = targetLang === 'hi';

    // A. Burnt Dosa
    if ((normalizedQueryForCheck.includes('dosa') || normalizedQueryForCheck.includes('दोसा') || normalizedQueryForCheck.includes('डोसा')) && 
        (normalizedQueryForCheck.includes('जल') || normalizedQueryForCheck.includes('burnt') || normalizedQueryForCheck.includes('jala') || normalizedQueryForCheck.includes('jhal') || normalizedQueryForCheck.includes('jalna'))) {
      const reply = isHiLanguage 
        ? "अगर आपका डोसा जल गया है, तो ये उपाय करें:\n\n1. **तवे का तापमान कम करें**: तवे का तापमान बहुत अधिक होने से डोसा जल जाता है। तवे पर पानी की कुछ बूंदें छिड़कें और इसे एक साफ सूती कपड़े से पोंछ लें ताकि तापमान नियंत्रित हो सके।\n2. **आंच नियंत्रित करें**: डोसा बैटर (घोल) डालने और फैलाने से पहले आंच को बिल्कुल धीमा कर दें। जब डोसा फैल जाए, तब आंच मध्यम करें।\n3. **तवे को चिकना करें**: तवे पर थोड़ा सा तेल लगाकर आधा कटा प्याज या गीला कपड़ा रगड़ें, इससे डोसा जलेगा नहीं और आसानी से निकलेगा।\n4. जले हुए डोसे को हटा दें, तवे को ठंडा करें और फिर से डोसा फैलाएं।"
        : "If your dosa is burnt, try these quick chef fixes:\n\n1. **Reduce Pan Temperature**: The griddle (tawa) is likely too hot. Sprinkle some water droplets on the tawa and wipe it clean with a damp cotton cloth to regulate the temperature.\n2. **Control the Flame**: Lower the flame completely before pouring and spreading the dosa batter. Once spread, increase to medium.\n3. **Grease the Tawa**: Rub a drop of oil onto the pan using half a cut onion or a damp cloth to prevent sticking and burning.\n4. Clear the burnt remains, cool down the griddle, and try spreading the batter again.";
      return { reply, suggestions: ["Instant Dosa SOP", "Dosa Troubleshooting"], detectedLang: targetLang };
    }

    // B. Watery Dosa Batter
    if ((normalizedQueryForCheck.includes('dosa') || normalizedQueryForCheck.includes('दोसा') || normalizedQueryForCheck.includes('डोसा')) && 
        (normalizedQueryForCheck.includes('पानी') || normalizedQueryForCheck.includes('water') || normalizedQueryForCheck.includes('patla') || normalizedQueryForCheck.includes('paani') || normalizedQueryForCheck.includes('watery') || normalizedQueryForCheck.includes('thin'))) {
      const reply = isHiLanguage 
        ? "अगर आपके डोसा घोल (batter) में पानी ज्यादा हो गया है, तो उसे ठीक करने के आसान तरीके:\n\n1. **चावल का आटा मिलाएं**: घोल में 2-3 चम्मच चावल का आटा (Rice Flour) मिलाएं। यह अतिरिक्त पानी सोख लेगा और डोसे को कुरकुरा बनाएगा।\n2. **सूजी (Rava) मिलाएं**: आप घोल में थोड़ी सूजी या रवा मिला सकते हैं। सूजी मिलाने के बाद बैटर को 10-15 मिनट के लिए छोड़ दें ताकि सूजी पानी सोख कर फूल जाए।\n3. **उबला आलू या गेहूं का आटा**: इमरजेंसी में आप 1 चम्मच गेहूं का आटा या हल्का सा बेसन भी मिला सकते हैं, लेकिन चावल का आटा या सूजी सबसे बेहतरीन परिणाम देते हैं।"
        : "If your dosa batter is too watery or thin, use these professional kitchen adjustments:\n\n1. **Add Rice Flour**: Mix in 2-3 tablespoons of fine rice flour. It will absorb the excess moisture and ensure the dosa remains crispy.\n2. **Add Semolina (Rava)**: Mix in a small amount of fine rava/semolina. Let the batter rest for 10-15 minutes so the semolina absorbs the water and swells.\n3. **Add Wheat Flour or Besan**: In an emergency, you can blend in a tablespoon of wheat flour or gram flour (besan) to thicken it, though rice flour yields the best results.";
      return { reply, suggestions: ["Instant Dosa SOP", "Dosa Batter Setup"], detectedLang: targetLang };
    }



    // Predefined general keyword mappings

    const keywordMappings: Record<string, { enReply: string; hiReply: string; suggestions: string[] }> = {

      'biryani': {

        enReply: "We have the standard recipe and costing structure for **Kyroz Shahi Lucknowi Biryani**. Which specific style of Biryani would you like to know about?",

        hiReply: "हमारे पास **Kyroz Shahi Lucknowi Biryani** की विशेष रेसिपी और कॉस्टिंग स्ट्रक्चर उपलब्ध है। आप कौन सी बिरयानी के बारे में जानना चाहते हैं?",

        suggestions: ["Chicken Biryani", "Mutton Biryani", "Hyderabadi Biryani", "Veg Biryani"]

      },

      'mandi': {

        enReply: "We have the recipe and costing structure for **Kyroz Indo Arabic White Mandi**. Are you interested in Chicken Mandi or Mutton Mandi?",

        hiReply: "हमारे पास **Kyroz Indo Arabic White Mandi** की रेसिपी और कॉस्टिंग स्ट्रक्चर उपलब्ध है। आप चिकन मंडी या मटन मंडी के बारे में जानना चाहते हैं?",

        suggestions: ["Chicken Mandi", "Mutton Mandi", "White Mandi Costing"]

      },

      'dosa': {

        enReply: "We have SOPs and portion recipes for **Masala Dosa** and **Onion Rava Dosa** (available in Small, Regular, and Large sizes). Which one would you like to explore?",

        hiReply: "हमारे पास **Masala Dosa** और **Onion Rava Dosa** (Small, Regular, Large साइज) की SOP और रेसिपी उपलब्ध हैं। आप कौन से डोसा के बारे में जानना चाहते हैं?",

        suggestions: ["Regular Masala Dosa", "Onion Rava Dosa", "Dosa Batter Production"]

      },

      'idli': {

        enReply: "We have recipes and portion yield details for **Rice Idli** (available in Mini, Regular, and Large sizes). Would you like to know about Idli Batter or portion yield?",

        hiReply: "हमारे पास **Rice Idli** (Mini, Regular, Large साइज) की रेसिपी और यील्ड डिटेल्स उपलब्ध हैं। क्या आप इडली बैटर या पोर्शन यील्ड के बारे में जानना चाहते हैं?",

        suggestions: ["Regular Rice Idli", "Idli Batter Recipe", "Mini Idli Yield"]

      },

      'chutney': {

        enReply: "We have standard recipes for **Coconut Chutney** and **Red Kara Chutney**. Which one would you like to know about?",

        hiReply: "हमारे पास **Coconut Chutney** और **Red Kara Chutney** की SOPs और रेसिपी उपलब्ध हैं। आप कौन सी चटनी के बारे में जानना चाहते हैं?",

        suggestions: ["Coconut Chutney", "Red Kara Chutney", "Chutney Cup Costing"]

      },

      'vada': {

        enReply: "We have the recipe and portion details for **Kyroz Medu Vada**. Would you like to know about its portion sizing or batter recipe?",

        hiReply: "हमारे पास **Kyroz Medu Vada** की रेसिपी और पोर्शन  डिटेल्स उपलब्ध हैं। क्या आप इसके पोर्शन  साइज़ या बैटर रेसिपी के बारे में जानना चाहते हैं?",

        suggestions: ["Medu Vada Portion", "Medu Vada Costing", "Medu Vada Packaging"]

      },

      'uttapam': {

        enReply: "We have the SOP and yield configurations for **Mix Veg Uttapam** (available in Small, Regular, and Large sizes). What details would you like to explore?",

        hiReply: "हमारे पास **Mix Veg Uttapam** (Small, Regular, Large साइज) की SOP और यील्ड कॉन्फ़िगरेशन उपलब्ध है। आप इसके बारे में क्या जानना चाहते हैं?",

        suggestions: ["Regular Mix Veg Uttapam", "Uttapam Batter Yield", "Uttapam Accompaniments"]

      },

      'sambhar': {

        enReply: "We have the recipe and portion details for **Premium Sambhar**. Would you like to check its batch yield or standard serving size?",

        hiReply: "हमारे पास **Premium Sambhar** की रेसिपी और पोर्शन  डिटेल्स उपलब्ध हैं। क्या आप इसकी बैच यील्ड या सर्विंग साइज के बारे में जानना चाहते हैं?",

        suggestions: ["Premium Sambhar Recipe", "Sambhar Portion Sizing", "Sambhar Costing"]

      }

    };



    const queryLower = cleanedQuery.toLowerCase();

    const isHi = targetLang === 'hi';



    // Get standaloneQuery and check if it maps to an exact official SOP title

    const standaloneQuery = await contextualizeQuery(userId, cleanedQuery, history);

    const userSops = await Sop.find({ userId }).select('title').lean();

    const userSopTitles = new Set(userSops.map(s => s.title.toLowerCase()));

    const isExactSopMatch = userSopTitles.has(standaloneQuery.toLowerCase());



    // Specific query check to bypass general answers if user asks a specific question

    const englishSpecific = /\b(recipe|ingredient|make|cook|prepare|cost|price|packaging|sop|method|step|how|what|button|batches|portion|plates|kg|gm|ml|chicken|mutton|veg|rava|onion|masala|white|shahi|lucknowi|arabic|batter|stuffing|mini|regular|large|medium|small|size|about|scale|yield|quantity|ratio|water|tadka|tempering|store|storage|troubleshoot|spoilage|yields|plates|pieces|piece|sops|coconut|red|kara|rice|medu|premium|indo)\b/i.test(queryLower);

    const hindiSpecific = /(विधि|सामग्री|बनाएं|कैसे|मूल्य|कीमत|चिकन|मटन|वेज|रवा|प्याज़|मसाला|सफेद|शाही|लखनऊ|बैटर|स्टफिंग|साइज|मात्रा|अनुपात|पानी|स्टोर|फ्रिज|तापमान|उबाल|पकाना|परोस|नारियल|लाल|कारा|चावल|मेदु|प्रीमियम|इंडो)/i.test(queryLower);

    

    const isSpecificQuery = englishSpecific || hindiSpecific || isExactSopMatch;



    if (!isSpecificQuery) {

      const matchedKey = Object.keys(keywordMappings).find(key => {

        const words = queryLower.split(/\s+/);

        return words.some(word => {

          if (word === key || word === `${key}s` || word === `${key}es`) return true;

          if (word.length >= 4 && key.length >= 4) {

            const sim = getSimilarity(word, key);

            return sim > 0.7;

          }

          return false;

        });

      });



      if (matchedKey) {

        const mapping = keywordMappings[matchedKey];

        return {

          reply: isHi ? mapping.hiReply : mapping.enReply,

          suggestions: mapping.suggestions,

          detectedLang: targetLang

        };

      }

    }



    let contextText = '';



    try {

      if (isExactSopMatch) {
        // Direct MongoDB query by dish name and language (saves Gemini embedding latency!)
        let directChunks = await SopChunk.find({
          userId,
          dish: standaloneQuery.toLowerCase(),
          lang: targetLang
        }).lean();



        // Fallback to English if no chunks exist for targetLang

        if (directChunks.length === 0 && targetLang !== 'en') {

          directChunks = await SopChunk.find({

            userId,

            dish: standaloneQuery.toLowerCase(),

            lang: 'en'

          }).lean();

        }



        if (directChunks.length > 0) {

          contextText = directChunks.map(chunk => `[SOP: ${chunk.dish}]\n${chunk.content}`).join('\n---\n');

        }

      } else if (gemini) {

        const queryEmbedding = await generateEmbedding(standaloneQuery);

        const relevantChunks = await retrieveRelevantChunks(userId, queryEmbedding, 8, standaloneQuery, targetLang);

        if (relevantChunks.length > 0) {

          contextText = relevantChunks.map(chunk => `[SOP: ${chunk.dish}]\n${chunk.content}`).join('\n---\n');

        }

      }

    } catch (e) {

      const textChunks = await searchSopByText(userId, standaloneQuery, 5, targetLang);

      if (textChunks.length > 0) {

        contextText = textChunks.map(chunk => `[SOP: ${chunk.dish}]\n${chunk.content}`).join('\n---\n');

      }

    }



    const languageRule = targetLang === 'hi'

      ? `1. LANGUAGE: You MUST respond entirely in proper, grammatically correct, professional Hindi using the Devanagari script (हिंदी देवनागरी). Do NOT write in Hinglish or write Hindi words in English/Latin letters (Roman script). Do NOT use English letters/words in the response (e.g. write "रेसिपी", "सामग्री", "विधि", "फ़्रीज़र" instead of "recipe", "ingredients", "method", "freezer"). Translate all context details into clear, natural, and correct Hindi sentences.`

      : `1. LANGUAGE: You MUST respond entirely in professional English.`;



    const suggestionsInstruction = targetLang === 'hi'

      ? `Provide exactly 3 short follow-up suggestions in Hindi (हिंदी) in a [SUGGESTIONS] block at the end.`

      : `Provide exactly 3 short follow-up suggestions in a [SUGGESTIONS] block at the end.`;



    const systemInstruction = `

You are Chef, a professional kitchen assistant for Kyroz Plus.

Your goal is to answer questions about recipes (SOPs) from the provided context.



STRICT RULES:

${languageRule}

2. SPECIFICITY: Only answer the specific question asked. Do not provide the full recipe unless requested.

3. SOURCE: Use ONLY the provided SOP CONTEXT. Do NOT use your own database or general training knowledge to answer recipe or kitchen questions. If the requested recipe, dish, or operational step is NOT explicitly detailed in the provided SOP CONTEXT, you MUST strictly respond with: "I do not have this recipe in my SOP library." (or in Hindi: "मेरे पास SOP लाइब्रेरी में यह रेसिपी नहीं है।") and absolutely nothing else. Never list general ingredients, instructions, or suggestions for dishes that are missing from the SOP CONTEXT.

4. PHONETIC/TYPO TOLERANCE: Treat transcription typos or phonetic variants (e.g. "Lye Siddeley" as "Rice Idli", "mendu wada" as "medu vada", "लक्नदी" as "लखनवी", "biryani" as "shahi lucknowi biryani") when matching with the context.



SOP CONTEXT:

${contextText || (targetLang === 'hi' ? 'लाइब्रेरी में कोई मिलान SOP नहीं मिला।' : 'No matching SOP found in the library.')}



${suggestionsInstruction}

`;



    const llmQuery = isExactSopMatch ? standaloneQuery : cleanedQuery;

    const cleanHistory = history.filter(m => m.content !== query && m.content !== cleanedQuery);



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

            { role: 'user', content: llmQuery }

          ] as any,

          model: 'llama-3.3-70b-versatile',

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

        const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });

        const geminiHistory = [];

        let lastRole = '';



        for (const m of cleanHistory) {

          const role = (m.role === 'user' || m.role === 'human') ? 'user' : 'model';

          if (geminiHistory.length === 0 && role === 'model') continue;



          if (role !== lastRole) {

            geminiHistory.push({ role, parts: [{ text: m.content }] });

            lastRole = role;

          }

        }



        const chat = model.startChat({ history: geminiHistory });

        const result = await chat.sendMessage(`System Instructions: ${systemInstruction}\n\nUser Question: ${llmQuery}`);

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

