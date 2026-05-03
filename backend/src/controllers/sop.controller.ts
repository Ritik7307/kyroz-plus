import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Sop from '../models/Sop';

export const createSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, category, contentEn, contentHi, content } = req.body;
    const userId = req.user?.userId;

    const newSop = new Sop({
      userId,
      title,
      category,
      contentEn,
      contentHi,
      content
    });

    await newSop.save();
    res.status(201).json(newSop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SOP' });
  }
};

export const getSops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sops = await Sop.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(sops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SOPs' });
  }
};

export const updateSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { title, category, contentEn, contentHi, content } = req.body;

    const updatedSop = await Sop.findOneAndUpdate(
      { _id: id, userId },
      { title, category, contentEn, contentHi, content },
      { new: true }
    );

    if (!updatedSop) {
      res.status(404).json({ error: 'SOP not found' });
      return;
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
