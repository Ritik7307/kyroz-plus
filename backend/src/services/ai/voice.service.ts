import Groq from 'groq-sdk';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_OPENAI_KEY_HERE'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Transcribes audio buffer using Groq Whisper.
 */
export const transcribeAudio = async (audioBuffer: Buffer, lang: string = 'en', filename: string = 'voice.webm'): Promise<string> => {
  if (!groq) throw new Error('Groq API Key is missing.');

  const extension = path.extname(filename) || '.webm';
  const tempFile = path.join(os.tmpdir(), `voice_${Date.now()}${extension}`);
  fs.writeFileSync(tempFile, audioBuffer);

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFile),
      model: "whisper-large-v3",
      language: lang === 'hi' ? 'hi' : 'en',
      prompt: "This is a kitchen assistant conversation. Recognize Hindi and English dish names.",
      response_format: "text",
    });
    return transcription as any;
  } catch (error) {
    console.error("Whisper Error:", error);
    throw error;
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }
};

/**
 * Cleans and prepares text for speech synthesis, ensuring hyphens/dashes
 * are never pronounced as "minus" and ranges like "10-15" are pronounced
 * "10 to 15" in English and "10 से 15" (or "10 se 15") in Hindi.
 */
export const cleanSpeechText = (text: string, lang: string = 'auto'): string => {
  if (!text) return '';

  const isDevanagari = /[\u0900-\u097F]/.test(text);
  const isHindi =
    lang === 'hi' ||
    isDevanagari ||
    /\b(karein|kare|kijiye|dalen|chammach|ke|liye|aur|se|mein|ko|hai|hain|bhi|tak|ka|ki|pakaen|kholiye|dhyan|rakhein)\b/i.test(text);

  const toWord = isHindi ? (isDevanagari ? ' से ' : ' se ') : ' to ';

  let s = text;

  // 1. Remove URLs
  s = s.replace(/https?:\/\/\S+/gi, '');

  // 2. Remove all emojis and pictographs completely (so TTS does not read symbol names)
  s = s.replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{200C}\u{20E3}\u{E0020}-\u{E007F}]/gu, '');

  // 3. Fix Brand Name pronunciation (KYROZ / KYROZ+ / KOSA)
  // Prevents TTS from spelling letter-by-letter (K-Y-R-O-Z) and reads as the word "Kyroz" / "कैरोज़"
  if (isHindi && isDevanagari) {
    s = s
      .replace(/\bKYROZ\s*\+/gi, 'कैरोज़ प्लस')
      .replace(/\bKYROZ\s+PLUS\b/gi, 'कैरोज़ प्लस')
      .replace(/\bKYROZ\b/gi, 'कैरोज़')
      .replace(/\bKOSA\b/gi, 'कोसा');
  } else {
    s = s
      .replace(/\bKYROZ\s*\+/gi, 'Kyroz Plus')
      .replace(/\bKYROZ\s+PLUS\b/gi, 'Kyroz Plus')
      .replace(/\bKYROZ\b/gi, 'Kyroz')
      .replace(/\bKOSA\b/gi, 'Kosa');
  }

  // 4. Fix fractions and cooking measurements with slashes
  if (isHindi && isDevanagari) {
    s = s
      .replace(/\b1\/2\b/g, 'आधा')
      .replace(/\b1\/4\b/g, 'एक चौथाई')
      .replace(/\b3\/4\b/g, 'तीन चौथाई');
  } else {
    s = s
      .replace(/\b1\/2\b/g, 'half')
      .replace(/\b1\/4\b/g, 'one fourth')
      .replace(/\b3\/4\b/g, 'three fourths');
  }
  // Replace word/word with "word or word" / "word ya word"
  s = s.replace(/([A-Za-z\u0900-\u097F]+)\s*\/\s*([A-Za-z\u0900-\u097F]+)/g, isHindi ? (isDevanagari ? '$1 या $2' : '$1 ya $2') : '$1 or $2');
  // Replace remaining slashes
  s = s.replace(/[\\\/]/g, ' ');

  // 5. Fix percentages and degrees
  s = s.replace(/(\d+)\s*%/g, isHindi ? (isDevanagari ? '$1 प्रतिशत' : '$1 percent') : '$1 percent');
  s = s.replace(/(\d+)\s*°\s*C\b/gi, isHindi ? (isDevanagari ? '$1 डिग्री सेल्सियस' : '$1 degree Celsius') : '$1 degrees Celsius');
  s = s.replace(/(\d+)\s*°\s*F\b/gi, isHindi ? (isDevanagari ? '$1 डिग्री फ़ारेनहाइट' : '$1 degree Fahrenheit') : '$1 degrees Fahrenheit');
  s = s.replace(/(\d+)\s*°\b/g, isHindi ? (isDevanagari ? '$1 डिग्री' : '$1 degree') : '$1 degrees');

  // 6. Fix currencies
  s = s.replace(/(?:₹|Rs\.?)\s*(\d+(?:\.\d+)?)/gi, isHindi ? (isDevanagari ? '$1 रुपये' : '$1 rupees') : '$1 rupees');
  s = s.replace(/\$\s*(\d+(?:\.\d+)?)/g, isHindi ? (isDevanagari ? '$1 डॉलर' : '$1 dollars') : '$1 dollars');

  // 7. Fix ampersand (&)
  s = s.replace(/&/g, isHindi ? (isDevanagari ? ' और ' : ' aur ') : ' and ');

  // 8. Strip brackets, parentheses, quotes, and punctuation symbols that TTS reads aloud
  s = s.replace(/[()\[\]{}"'“”‘’`#*_~^=|<><>\+@•▪◦●○■□★☆✓✔✕✖✗➤➜➡◆◇▲▼※]/g, ' ');

  // 9. Fix Hindi step pronunciation if Hindi
  if (isHindi) {
    s = s.replace(/(?:स्टेप्स|स्टेप)/g, 'चरण').replace(/\b[Ss]teps?\b/g, 'चरण');
  }

  // 10. Number ranges: 10-15, 10 - 15, 1.5-2, 10–15, १०-१५, etc.
  s = s.replace(/([0-9\u0966-\u096F]+(?:\.[0-9\u0966-\u096F]+)?)\s*[-–—]\s*([0-9\u0966-\u096F]+(?:\.[0-9\u0966-\u096F]+)?)/g, (_match, p1, p2) => {
    return `${p1}${toWord}${p2}`;
  });

  // 11. Word-based ranges: two-three, low-medium, धीमी-मध्यम
  s = s.replace(/(low|medium|high)\s*[-–—]\s*(medium|high|low)/gi, '$1 to $2');
  s = s.replace(/(धीमी|मध्यम|तेज)\s*[-–—]\s*(मध्यम|तेज|धीमी)/g, isHindi ? '$1 से $2' : '$1 to $2');

  // 12. Bullet points at start of line or after punctuation
  s = s.replace(/(?:^|\n|(?<=[:.,!?]))\s*[-–—]\s*/g, ' ');

  // 13. Separator dashes like " - " -> replace with comma pause
  s = s.replace(/\s+[-–—]+\s+/g, ', ');

  // 14. Compound words or word pairs: deep-fry -> deep fry, गरम-गरम -> गरम गरम
  s = s.replace(/([A-Za-z\u0900-\u097F]+)[-–—]([A-Za-z\u0900-\u097F]+)/g, '$1 $2');

  // 15. Any remaining hyphens or dashes -> replace with space
  s = s.replace(/[-–—]+/g, ' ');

  // 16. Unit expansions for natural pronunciation
  if (isHindi) {
    s = s
      .replace(/(\d+)\s*(?:gm|g|ग्राम)\b/gi, '$1 ग्राम')
      .replace(/(\d+)\s*(?:kg|किलो)\b/gi, '$1 किलो')
      .replace(/(\d+)\s*(?:ml|मिली)\b/gi, '$1 मिलीलीटर')
      .replace(/(\d+)\s*(?:tbsp|tbs)\b/gi, '$1 बड़ा चम्मच')
      .replace(/(\d+)\s*(?:tsp)\b/gi, '$1 छोटा चम्मच');
  } else {
    s = s
      .replace(/(\d+)\s*tbsp\b/gi, '$1 tablespoons')
      .replace(/(\d+)\s*tsp\b/gi, '$1 teaspoons')
      .replace(/(\d+)\s*(?:gm|g)\b/gi, '$1 grams')
      .replace(/(\d+)\s*kg\b/gi, '$1 kilograms')
      .replace(/(\d+)\s*ml\b/gi, '$1 milliliters');
  }

  // 17. Natural pauses and clean colons / semicolons / multiple punctuation
  s = s
    .replace(/((?:चरण|[Ss]tep)\s*\d+)\s*[:\.,]?\s*/g, '$1, ')
    .replace(/[;:]\s*/g, ', ')
    .replace(/,\s*,+/g, ', ')
    .replace(/\.{2,}/g, '.')
    .replace(/\s*,\s*/g, ', ')
    .replace(/(?<=[.?!।])\s+/g, ' ');

  return s.replace(/\s+/g, ' ').trim();
};

/**
 * Generates speech from text.
 */
export const generateSpeech = async (text: string, lang: string = 'auto'): Promise<Buffer> => {
  const hasAiCore = !!process.env.AI_CORE_URL || process.env.NODE_ENV !== 'production';
  const hasOpenAi = !!openai;

  if (!hasAiCore && !hasOpenAi) {
    throw new Error("No Text-to-Speech engines configured (missing AI_CORE_URL and valid OPENAI_API_KEY).");
  }

  const cleanedText = cleanSpeechText(text, lang);

  // Notice: For Indian English, Python AI Core uses Microsoft Edge's natural Indian English
  // voice (en-IN-NeerjaExpressiveNeural) instead of American OpenAI voices.
  // We prioritize the Indian AI Core TTS first. If AI Core is unavailable, fallback to OpenAI.

  try {
    const formData = new URLSearchParams();
    formData.append('text', cleanedText);
    formData.append('lang', lang);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${process.env.AI_CORE_URL || 'http://127.0.0.1:8000'}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      throw new Error(`Python AI Core responded with status ${response.status}`);
    }
  } catch (error: any) {
    const isAbort = error.name === 'AbortError';
    console.warn(isAbort ? "Python AI Core TTS connection timed out." : "Python AI Core TTS failed. Falling back to OpenAI if available.");
    
    if (openai) {
      try {
        const mp3 = await openai.audio.speech.create({ model: "tts-1", voice: "shimmer", input: cleanedText });
        const arrayBuffer = await mp3.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } catch (openaiError) {
        console.error("OpenAI Fallback failed:", openaiError);
      }
    }
    
    throw new Error("Both Python TTS and OpenAI TTS fallbacks failed or are unconfigured.");
  }
};
