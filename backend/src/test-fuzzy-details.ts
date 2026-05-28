import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User';
import Sop from './models/Sop';
import SopChunk from './models/SopChunk';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

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

const translateToEnglish = async (query: string): Promise<string> => {
  if (!groq) {
    console.log("No GROQ_API_KEY configured!");
    return query;
  }
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
    return query;
  }
};

const contextualizeQuery = async (userId: string, query: string): Promise<{ processedQuery: string; debugInfo: any }> => {
  const englishQuery = await translateToEnglish(query);
  let processedQuery = englishQuery;
  let debugInfo: any = { englishQuery };

  try {
    const dishes = await Sop.find({ userId }).select('title').lean();
    const queryLower = englishQuery.toLowerCase();

    let bestDishMatch = null;
    let highestScore = 0;
    let details = [];

    for (const d of dishes) {
      if (!d.title) continue;
      const dishName = d.title.toLowerCase();
      
      // Exact match
      if (queryLower.includes(dishName)) {
        bestDishMatch = d.title;
        highestScore = 1.0;
        details.push({ title: d.title, type: 'exact', score: 1.0 });
        break;
      }

      // Check cleaned dish name overlaps
      const cleanedDish = cleanDishNameForMatching(d.title);
      if (cleanedDish && (queryLower.includes(cleanedDish) || cleanedDish.includes(queryLower))) {
        const score = queryLower.includes(cleanedDish) ? 0.95 : 0.8;
        details.push({ title: d.title, type: 'cleaned_overlap', score });
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
        details.push({ title: d.title, type: 'segment_similarity', segment: querySegment, score });
        if (score > highestScore) {
          highestScore = score;
          bestDishMatch = d.title;
        }
      }

      if (queryWords.length <= dishWordCount + 2) {
        const score = getSimilarity(dishName, queryLower);
        details.push({ title: d.title, type: 'overall_similarity', score });
        if (score > highestScore) {
          highestScore = score;
          bestDishMatch = d.title;
        }
      }
    }

    debugInfo.details = details;
    debugInfo.bestDishMatch = bestDishMatch;
    debugInfo.highestScore = highestScore;

    if (highestScore > 0.65 && bestDishMatch) {
      processedQuery = bestDishMatch;
    }
  } catch (e) { console.error("Fuzzy Match Error:", e); }

  return { processedQuery, debugInfo };
};

async function runDiagnostics() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';
  await mongoose.connect(MONGO_URI);

  const user = await User.findOne({});
  if (!user) {
    console.error('No user found');
    await mongoose.disconnect();
    return;
  }
  const userId = user._id.toString();

  const queries = [
    'luckonowi biryani',
    'लक्नदी बिर्यानी',
    'लखनवी बिर्यानी कैसे बनाएँ?'
  ];

  for (const q of queries) {
    console.log('\n==================================================');
    console.log(`QUERY: "${q}"`);
    const { processedQuery, debugInfo } = await contextualizeQuery(userId, q);
    console.log('Resulting standalone query:', processedQuery);
    console.log('Best match:', debugInfo.bestDishMatch, 'Score:', debugInfo.highestScore);
    console.log('English translation:', debugInfo.englishQuery);
    // Print all matches that got score > 0.5
    const goodMatches = debugInfo.details?.filter((d: any) => d.score > 0.5) || [];
    console.log('Matches with score > 0.5:', goodMatches);
  }

  await mongoose.disconnect();
}

runDiagnostics().catch(console.error);
