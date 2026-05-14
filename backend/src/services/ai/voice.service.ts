import Groq from 'groq-sdk';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

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
  try {
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('lang', lang);

    const response = await fetch(`${process.env.AI_CORE_URL || 'http://localhost:8000'}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      throw new Error(`Python AI Core responded with status ${response.status}`);
    }
  } catch (error) {
    console.warn("Python AI Core TTS failed. Falling back to OpenAI.");
    
    if (openai) {
      try {
        const mp3 = await openai.audio.speech.create({ model: "tts-1", voice: "alloy", input: text });
        const arrayBuffer = await mp3.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } catch (openaiError) {
        console.error("OpenAI Fallback failed:", openaiError);
      }
    }
    
    throw new Error("Both Python TTS and OpenAI TTS fallbacks failed.");
  }
};
