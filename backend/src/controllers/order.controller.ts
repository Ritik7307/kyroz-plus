import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';
import Order from '../models/Order';
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
    const orderItems = [];
    let totalRevenue = 0;
    let totalProfit = 0;

    for (const item of items) {
      const { dishId, quantity } = item;
      
      const dish = await Dish.findById(dishId);
      if (dish) {
        const price = dish.price || 0;
        const ingredientPrice = dish.ingredientPrice || 0;
        
        orderItems.push({
          dishId,
          quantity,
          price,
          ingredientPrice
        });
        
        totalRevenue += price * quantity;
        totalProfit += (price - ingredientPrice) * quantity;
      }
      
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

    if (orderItems.length > 0) {
      const order = new Order({
        userId: req.user?.userId,
        items: orderItems,
        totalRevenue,
        totalProfit
      });
      await order.save();
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

export const getDailyProfit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await Order.find({
      userId: req.user?.userId,
      createdAt: { $gte: today }
    });
    
    const dailyProfit = orders.reduce((sum, order) => sum + order.totalProfit, 0);
    const dailyRevenue = orders.reduce((sum, order) => sum + order.totalRevenue, 0);
    
    res.status(200).json({ dailyProfit, dailyRevenue });
  } catch (error) {
    console.error('Daily Profit Error:', error);
    res.status(500).json({ error: 'Failed to fetch daily profit' });
  }
};

export const getOrderHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user?.userId })
      .populate('items.dishId', 'name category imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Order History Error:', error);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
};
