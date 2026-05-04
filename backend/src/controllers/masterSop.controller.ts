import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import MasterSop from '../models/MasterSop';

export const createMasterSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, category, contentEn, contentHi, content } = req.body;
    const newSop = new MasterSop({ title, category, contentEn, contentHi, content });
    await newSop.save();
    res.status(201).json(newSop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Master SOP' });
  }
};

export const getMasterSops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sops = await MasterSop.find().sort({ createdAt: -1 });
    res.status(200).json(sops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Master SOPs' });
  }
};

export const updateMasterSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, contentEn, contentHi, content } = req.body;
    const updatedSop = await MasterSop.findByIdAndUpdate(
      id,
      { title, category, contentEn, contentHi, content },
      { new: true }
    );
    if (!updatedSop) {
      res.status(404).json({ error: 'Master SOP not found' });
      return;
    }
    res.status(200).json(updatedSop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Master SOP' });
  }
};

export const deleteMasterSop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedSop = await MasterSop.findByIdAndDelete(id);
    if (!deletedSop) {
      res.status(404).json({ error: 'Master SOP not found' });
      return;
    }
    res.status(200).json({ message: 'Master SOP deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Master SOP' });
  }
};
