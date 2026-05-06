import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { processSopText } from '../services/ai/ingestion.service';
import { generateRagResponse } from '../services/ai/ragPipeline.service';
import Sop from '../models/Sop';
import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

// RAG Chat Endpoint
export const chatWithKosa = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const userId = req.user?.userId;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Call the newly created RAG Pipeline
    const { lang } = req.body;
    const reply = await generateRagResponse(userId, message, lang);

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with KYROZ KOSA.' });
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

    // 1. Extract Text based on Mimetype
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

    // 2. Save the file to disk for direct download/viewing
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadPath = path.join(__dirname, '../../public/uploads/sops', fileName);
    fs.writeFileSync(uploadPath, file.buffer);
    const fileUrl = `/public/uploads/sops/${fileName}`;

    // 3. Pass to the Ingestion Service to Parse, Chunk, Embed, and Save (for AI)
    const { dish, chunksStored } = await processSopText(userId, extractedText);

    // 4. Create a persistent SOP record with the file attachment
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

    // Get 3 random unique dish names
    const sops = await Sop.find({ userId }).select('title').limit(20);
    const shuffled = sops.sort(() => 0.5 - Math.random());
    const starters = shuffled.slice(0, 3).map(s => `How to make ${s.title}?`);
    
    // Default fallback if no SOPs yet
    if (starters.length === 0) {
      starters.push("How to reduce food waste?", "Tips for kitchen hygiene?", "Standard cooking procedures?");
    }

    res.status(200).json({ starters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch starters' });
  }
};
