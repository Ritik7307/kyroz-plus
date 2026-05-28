import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import mongoose from 'mongoose';
import { generateRagResponse } from './services/ai/ragPipeline.service';
import User from './models/User';
import Sop from './models/Sop';
import SopChunk from './models/SopChunk';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kyroz';

// We extract helper functions to run them standalone and inspect outcomes
import Groq from 'groq-sdk';
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const translateToEnglish = async (query: string): Promise<string> => {
  if (!groq) return 'GROQ NOT INITIALIZED';
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
  } catch (e: any) {
    return 'ERROR: ' + e.message;
  }
};

async function debug() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const user = await User.findOne({});
  if (!user) {
    console.error('No user found');
    await mongoose.disconnect();
    return;
  }
  const userId = user._id.toString();

  const query = 'लक्नदी बिर्यानी';
  console.log('Original Query:', query);

  const translation = await translateToEnglish(query);
  console.log('Translation result from Groq:', translation);

  const dishes = await Sop.find({ userId }).select('title').lean();
  console.log('Available Dishes Count:', dishes.length);

  // Let's run matchDishByKeywords manually on the translation
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

    console.log('Query Keywords:', queryWords);

    let bestMatch: string | null = null;
    let maxMatchCount = 0;
    let bestDishWordCount = 0;

    for (const d of dishes) {
      if (!d.title) continue;
      const cleanedTitle = cleanDishNameForMatching(d.title);
      const dishWords = cleanedTitle.split(/\s+/).filter(w => w.length > 2);
      
      let matchCount = 0;
      for (const qw of queryWords) {
        if (dishWords.includes(qw)) {
          matchCount++;
        } else {
          for (const dw of dishWords) {
            if (getSimilarity(qw, dw) > 0.8) {
              matchCount++;
              break;
            }
          }
        }
      }

      if (matchCount > 0) {
        const isQualifying = dishWords.length >= 2 ? matchCount >= 2 : matchCount >= 1;
        if (isQualifying) {
          if (matchCount > maxMatchCount) {
            maxMatchCount = matchCount;
            bestMatch = d.title;
            bestDishWordCount = dishWords.length;
          } else if (matchCount === maxMatchCount) {
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

  const match = matchDishByKeywords(translation, dishes as any);
  console.log('Manual matchDishByKeywords output:', match);

  // Test full generateRagResponse
  console.log('\nRunning generateRagResponse...');
  const res = await generateRagResponse(userId, query, 'auto');
  console.log('Full response reply:', res.reply);

  await mongoose.disconnect();
}

debug().catch(console.error);
