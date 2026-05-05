import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';
import { sendManualStockRequest } from '../services/whatsapp.service';

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const inventory = await Inventory.find({ userId: req.user?.userId }).populate('dishId');
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const updateInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId, platesPerPacket, totalPackets } = req.body;
    
    // Convert packets to total plates
    const totalPlates = totalPackets * platesPerPacket;

    const inventory = await Inventory.findOneAndUpdate(
      { dishId, userId: req.user?.userId },
      { 
        platesPerPacket, 
        totalPlates,
        $setOnInsert: { userId: req.user?.userId, dishId } 
      },
      { upsert: true, new: true }
    );

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
};

export const deleteInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Inventory.findOneAndDelete({ _id: id, userId: req.user?.userId });
    res.status(200).json({ message: 'Item removed from inventory' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove inventory item' });
  }
};

export const notifyAdminAboutStock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id).populate('dishId');
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const packets = Math.floor(item.totalPlates / item.platesPerPacket);
    const dishName = (item.dishId as any).name;

    await sendManualStockRequest(dishName, packets);
    res.status(200).json({ message: 'Admin notified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to notify admin' });
  }
};
