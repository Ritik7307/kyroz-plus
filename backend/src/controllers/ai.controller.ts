import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { processSopText } from '../services/ai/ingestion.service';
import { generateRagResponse } from '../services/ai/ragPipeline.service';
import { transcribeAudio, generateSpeech } from '../services/ai/voice.service';
import Sop from '../models/Sop';
import fs from 'fs';
import path from 'path';
const { PDFParse } = require('pdf-parse');
import mammoth from 'mammoth';

export const chatWithKosa = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, lang, history = [], context } = req.body;
    const userId = req.user?.userId;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { reply, suggestions, detectedLang } = await generateRagResponse(userId, message, lang, history, context);
    res.status(200).json({ reply, suggestions, detectedLang });
  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with KYROZ KOSA.' });
  }
};

export const transcribeVoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { lang } = req.body;
    if (!file || !req.user?.userId) {
      res.status(400).json({ error: 'Audio file and authentication required' });
      return;
    }
    const transcript = await transcribeAudio(file.buffer, lang, file.originalname);
    res.status(200).json({ transcript });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
};

export const uploadSopFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const userId = req.user?.userId;
    if (!file || !userId) {
      res.status(400).json({ error: 'File and authentication required' });
      return;
    }

    let extractedText = '';
    if (file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: file.buffer });
      const data = await parser.getText();
      extractedText = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else if (file.mimetype === 'text/plain') {
      extractedText = file.buffer.toString('utf-8');
    } else {
      res.status(400).json({ error: 'Unsupported format' });
      return;
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadDir = path.join(__dirname, '../../public/uploads/sops');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const uploadPath = path.join(uploadDir, fileName);
    fs.writeFileSync(uploadPath, file.buffer);
    const fileUrl = `/public/uploads/sops/${fileName}`;

    const { dish, chunksStored } = await processSopText(userId, extractedText);
    const newSop = new Sop({ userId, title: dish.toUpperCase(), category: 'Dish', contentEn: extractedText, fileUrl });
    await newSop.save();

    res.status(200).json({ message: 'SOP processed', dish, chunksStored, fileUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to process SOP' });
  }
};

export const getKosaStarters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { lang } = req.query;
    const sops = await Sop.find({ userId }).select('title').limit(20);
    const shuffled = sops.sort(() => 0.5 - Math.random());
    const starters = shuffled.slice(0, 3).map(s => lang === 'hi' ? `${s.title} कैसे बनाएं?` : `How to make ${s.title}?`);
    
    if (starters.length === 0) {
      if (lang === 'hi') starters.push("खाने की बर्बादी कैसे कम करें?", "किचन की सफाई के टिप्स?");
      else starters.push("How to reduce food waste?", "Tips for kitchen hygiene?");
    }
    res.status(200).json({ starters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch starters' });
  }
};

export const speakWithKosa = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, lang } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }
    const audioBuffer = await generateSpeech(text, lang);
    res.set({ 
      'Content-Type': 'audio/mpeg', 
      'Content-Length': audioBuffer.length.toString(),
      'Cache-Control': 'no-store'
    });
    res.status(200).send(audioBuffer);
  } catch (error: any) {
    console.error("Speak Error:", error);
    res.status(500).json({ error: 'Failed to generate speech. Ensure AI services are running.' });
  }
};
