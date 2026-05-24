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
 * Generates speech from text.
 */
export const generateSpeech = async (text: string, lang: string = 'auto'): Promise<Buffer> => {
  const hasAiCore = !!process.env.AI_CORE_URL || process.env.NODE_ENV !== 'production';
  const hasOpenAi = !!openai;

  if (!hasAiCore && !hasOpenAi) {
    throw new Error("No Text-to-Speech engines configured (missing AI_CORE_URL and valid OPENAI_API_KEY).");
  }

  try {
    const formData = new URLSearchParams();
    formData.append('text', text);
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
        const mp3 = await openai.audio.speech.create({ model: "tts-1", voice: "alloy", input: text });
        const arrayBuffer = await mp3.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } catch (openaiError) {
        console.error("OpenAI Fallback failed:", openaiError);
      }
    }
    
    throw new Error("Both Python TTS and OpenAI TTS fallbacks failed or are unconfigured.");
  }
};
