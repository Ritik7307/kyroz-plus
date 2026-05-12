import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { processSopText } from '../services/ai/ingestion.service';
import { generateRagResponse } from '../services/ai/ragPipeline.service';
import { transcribeAudio, generateSpeech } from '../services/ai/voice.service';
import Sop from '../models/Sop';
import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

// RAG Chat Endpoint
export const chatWithKosa = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, lang, history, context } = req.body;
    const userId = req.user?.userId;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { reply, suggestions } = await generateRagResponse(userId, message, lang, history, context);
    res.status(200).json({ reply, suggestions });
  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with KYROZ KOSA.' });
  }
};

// Voice Transcription Endpoint
export const transcribeVoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { lang } = req.body;

    if (!file) {
      res.status(400).json({ error: 'Audio file is required' });
      return;
    }

    if (!req.user?.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transcript = await transcribeAudio(file.buffer, lang);
    res.status(200).json({ transcript });
  } catch (error: any) {
    console.error('Error transcribing voice:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
};

// Automated SOP Ingestion Endpoint (File Upload)
export const uploadSopFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const userId = req.user?.userId;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded. Please upload a PDF, DOCX, or TXT file.' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      const data = await pdf(file.buffer);
      extractedText = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else if (file.mimetype === 'text/plain') {
      extractedText = file.buffer.toString('utf-8');
    } else {
      res.status(400).json({ error: 'Unsupported file format. Use PDF, DOCX, or TXT.' });
      return;
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadPath = path.join(__dirname, '../../public/uploads/sops', fileName);
    fs.writeFileSync(uploadPath, file.buffer);
    const fileUrl = `/public/uploads/sops/${fileName}`;

    const { dish, chunksStored } = await processSopText(userId, extractedText);

    const newSop = new Sop({
      userId,
      title: dish.toUpperCase(),
      category: 'Dish',
      contentEn: extractedText,
      fileUrl: fileUrl
    });
    await newSop.save();

    res.status(200).json({
      message: 'SOP processed successfully',
      dish,
      chunksStored,
      fileUrl
    });

  } catch (error: any) {
    console.error('Error uploading SOP:', error);
    res.status(500).json({ error: error.message || 'Failed to process SOP file.' });
  }
};

// Get suggested questions (dish names) from the library
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
    const starters = shuffled.slice(0, 3).map(s => {
      if (lang === 'hi') return `${s.title} कैसे बनाएं?`;
      return `How to make ${s.title}?`;
    });
    
    if (starters.length === 0) {
      if (lang === 'hi') {
        starters.push("खाने की बर्बादी कैसे कम करें?", "किचन की सफाई के टिप्स?", "स्टैंडर्ड कुकिंग प्रोसेस क्या है?");
      } else {
        starters.push("How to reduce food waste?", "Tips for kitchen hygiene?", "Standard cooking procedures?");
      }
    }

    res.status(200).json({ starters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch starters' });
  }
};

// Text-to-Speech Endpoint
export const speakWithKosa = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const audioBuffer = await generateSpeech(text);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    
    res.status(200).send(audioBuffer);
  } catch (error: any) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
};
