import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import SopPacket from '../models/SopPacket';

export const createSopPacket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, price, description, images, category } = req.body;
    const newPacket = new SopPacket({ name, price, description, images, category });
    await newPacket.save();
    res.status(201).json(newPacket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SOP Packet' });
  }
};

export const getSopPackets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const packets = await SopPacket.find().sort({ createdAt: -1 });
    res.status(200).json(packets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SOP Packets' });
  }
};

export const updateSopPacket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, description, images, category } = req.body;
    const updatedPacket = await SopPacket.findByIdAndUpdate(
      id,
      { name, price, description, images, category },
      { new: true }
    );
    if (!updatedPacket) {
      res.status(404).json({ error: 'SOP Packet not found' });
      return;
    }
    res.status(200).json(updatedPacket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SOP Packet' });
  }
};

export const deleteSopPacket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedPacket = await SopPacket.findByIdAndDelete(id);
    if (!deletedPacket) {
      res.status(404).json({ error: 'SOP Packet not found' });
      return;
    }
    res.status(200).json({ message: 'SOP Packet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete SOP Packet' });
  }
};
