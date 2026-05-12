import Groq from 'groq-sdk';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/**
 * Transcribes audio buffer using Groq Whisper.
 * Supports Hindi and English.
 */
export const transcribeAudio = async (audioBuffer: Buffer, lang: string = 'en'): Promise<string> => {
  if (!groq) {
    throw new Error('Groq API Key is not configured for voice transcription.');
  }

  const tempFile = path.join(os.tmpdir(), `voice_${Date.now()}.wav`);
  fs.writeFileSync(tempFile, audioBuffer);

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFile),
      model: "whisper-large-v3",
      prompt: "This is a kitchen assistant conversation. Support Hindi, English, and Hinglish names of dishes and ingredients.",
      response_format: "text",
    });

    return transcription as any;
  } catch (error) {
    console.error("Whisper Transcription Error:", error);
    throw error;
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }
};

/**
 * Generates speech from text using OpenAI TTS.
 * This provides the "Proper Hindi" and high-quality voice required.
 */
export const generateSpeech = async (text: string): Promise<Buffer> => {
  if (!openai) {
    throw new Error('OpenAI API Key is not configured for text-to-speech.');
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer", // 'shimmer' or 'alloy' work well for helpful assistants
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("OpenAI TTS Error:", error);
    throw error;
  }
};
