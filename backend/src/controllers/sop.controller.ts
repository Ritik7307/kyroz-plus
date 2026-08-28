import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Sop from '../models/Sop';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';
import { processSopText } from '../services/ai/ingestion.service';

export const createSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, category, subCategory, contentEn, contentHi, content, isInventoryLinked, platesPerPacket } = req.body;
    const userId = req.user?.userId;

    const newSop = new Sop({
      userId,
      title,
      category,
      contentEn,
      contentHi,
      content,
      subCategory,
      isInventoryLinked,
      platesPerPacket
    });

    await newSop.save();

    // If linked, ensure a Dish and Inventory item exist or are updated
    if (isInventoryLinked) {
      // Find or create a Dish with this title
      let dish = await Dish.findOne({ name: title, userId });
      if (!dish) {
        dish = new Dish({ name: title, price: 0, ingredientPrice: 0, category, userId });
        await dish.save();
      }

      // Update/Upsert Inventory
      await Inventory.findOneAndUpdate(
        { dishId: dish._id, userId },
        { platesPerPacket, $setOnInsert: { totalPlates: 0 } },
        { upsert: true }
      );
    }

    // Process SOP for AI Chatbot Context
    if (userId) {
      if (contentEn) {
        processSopText(userId.toString(), `SOP: ${title}\n\n${contentEn}`, 'en').catch(e => console.error('SOP AI Sync Error EN:', e));
      }
      if (contentHi) {
        processSopText(userId.toString(), `SOP: ${title}\n\n${contentHi}`, 'hi').catch(e => console.error('SOP AI Sync Error HI:', e));
      }
      if (content && !contentEn && !contentHi) {
        processSopText(userId.toString(), `SOP: ${title}\n\n${content}`, 'en').catch(e => console.error('SOP AI Sync Error:', e));
      }
    }

    res.status(201).json(newSop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SOP' });
  }
};

export const getSops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sops = await Sop.find({ userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json(sops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SOPs' });
  }
};

export const updateSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { title, category, subCategory, contentEn, contentHi, content, isInventoryLinked, platesPerPacket } = req.body;

    const updatedSop = await Sop.findOneAndUpdate(
      { _id: id, userId },
      { title, category, subCategory, contentEn, contentHi, content, isInventoryLinked, platesPerPacket },
      { new: true }
    );

    if (!updatedSop) {
      res.status(404).json({ error: 'SOP not found' });
      return;
    }

    if (isInventoryLinked) {
      let dish = await Dish.findOne({ name: title, userId });
      if (!dish) {
        dish = new Dish({ name: title, price: 0, ingredientPrice: 0, category, userId });
        await dish.save();
      }
      await Inventory.findOneAndUpdate(
        { dishId: dish._id, userId },
        { platesPerPacket },
        { upsert: true }
      );
    }

    // Process SOP for AI Chatbot Context
    if (userId) {
      if (contentEn) {
        processSopText(userId.toString(), `SOP: ${title}\n\n${contentEn}`, 'en').catch(e => console.error('SOP AI Sync Error EN:', e));
      }
      if (contentHi) {
        processSopText(userId.toString(), `SOP: ${title}\n\n${contentHi}`, 'hi').catch(e => console.error('SOP AI Sync Error HI:', e));
      }
      if (content && !contentEn && !contentHi) {
        processSopText(userId.toString(), `SOP: ${title}\n\n${content}`, 'en').catch(e => console.error('SOP AI Sync Error:', e));
      }
    }

    res.status(200).json(updatedSop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SOP' });
  }
};

export const deleteSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const deletedSop = await Sop.findOneAndDelete({ _id: id, userId });
    if (!deletedSop) {
      res.status(404).json({ error: 'SOP not found' });
      return;
    }
    res.status(200).json({ message: 'SOP deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete SOP' });
  }
};

export const syncSops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { syncMasterSopsForUser } = require('../services/sop.service');
    await syncMasterSopsForUser(userId);
    res.status(200).json({ message: 'SOPs synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
};
