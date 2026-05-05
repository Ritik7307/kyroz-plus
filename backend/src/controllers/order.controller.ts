import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';
import { sendLowStockAlert } from '../services/whatsapp.service';

export const processCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items } = req.body; // Array of { dishId, quantity }
    
    if (!items || !Array.isArray(items)) {
      res.status(400).json({ error: 'Invalid items format' });
      return;
    }

    const updates = [];
    const alerts = [];

    for (const item of items) {
      const { dishId, quantity } = item;
      
      // Find inventory for this dish
      const inventory = await Inventory.findOne({ dishId, userId: req.user?.userId }).populate('dishId');
      
      if (inventory) {
        // Reduce total plates
        inventory.totalPlates -= quantity;
        await inventory.save();

        // Check for low stock
        const remainingPackets = Math.floor(inventory.totalPlates / inventory.platesPerPacket);
        if (remainingPackets <= inventory.lowStockThreshold) {
          // Prevent spamming alerts (only once every 24 hours or if it drops further)
          const dishName = (inventory.dishId as any).name;
          alerts.push({ dishName, remainingPackets });
          
          // Send WhatsApp Alert
          await sendLowStockAlert(dishName, remainingPackets);
        }
        
        updates.push({ dishId, remainingPlates: inventory.totalPlates });
      }
    }

    res.status(200).json({ 
      message: 'Checkout successful and inventory updated', 
      updates,
      alerts 
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
};
