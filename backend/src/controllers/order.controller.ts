import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';
import Order from '../models/Order';
import Customer from '../models/Customer';
import Packaging from '../models/Packaging';
import Notification from '../models/Notification';
import { sendLowStockAlert } from '../services/whatsapp.service';
import { deductInventory } from '../services/inventory.service';

export const processCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, customerName, customerPhone, discount, paymentMethod, orderType = 'DineIn' } = req.body; // Array of { dishId, quantity }
    
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
        // Reduce total plates (portion tracking for Biryani/Mandi)
        inventory.totalPlates -= quantity;
        await inventory.save();

        // Check for low stock
        const remainingPackets = Math.floor(inventory.totalPlates / inventory.platesPerPacket);
        if (remainingPackets <= inventory.lowStockThreshold) {
          const dishName = (inventory.dishId as any).name;
          alerts.push({ dishName, remainingPackets });
          await sendLowStockAlert(dishName, remainingPackets);

          // Pushing database Notification for refilling
          const existing = await Notification.findOne({
            userId: req.user?.userId,
            title: 'Low Stock Alert',
            message: { $regex: new RegExp(dishName, 'i') },
            isRead: false
          });
          if (!existing && req.user?.userId) {
            await Notification.create({
              userId: req.user.userId,
              title: 'Low Stock Alert',
              message: `Your stock for ${dishName} is low (${remainingPackets} packets remaining). Please refill.`,
              type: 'warning',
              category: 'inventory',
              isRead: false
            });
            console.log(`Created low stock notification for dish ${dishName}`);
          }
        }
        
        updates.push({ dishId, remainingPlates: inventory.totalPlates });
      }

      // ALWAYS deduct recipe ingredients from the inventory section at POS billing checkout
      if (req.user?.userId) {
        await deductInventory('Dish', dishId, quantity, req.user.userId);
      }
    }

    // Auto deduct packaging if takeaway/delivery
    if (orderType === 'Takeaway' || orderType === 'Delivery') {
      const getPackagingForDish = (dishName: string): string[] => {
        const name = dishName.toLowerCase();
        if (name.includes('masala dosa')) {
          return ['Dosa Box', 'Butter Paper', 'Spoon', 'Carry Bag', 'Chutney Container', 'Sambhar Container'];
        } else if (name.includes('rava dosa')) {
          return ['Dosa Box', 'Butter Paper', 'Chutney Container', 'Carry Bag'];
        } else if (name.includes('idli')) {
          return ['Idli Container', 'Chutney Container', 'Sambhar Container', 'Spoon', 'Carry Bag'];
        } else if (name.includes('vada')) {
          return ['Vada Box', 'Chutney Container', 'Sambhar Container', 'Carry Bag'];
        } else if (name.includes('uttapam')) {
          return ['Uttapam Box', 'Chutney Container', 'Sambhar Container', 'Carry Bag'];
        } else if (name.includes('biryani') || name.includes('mandi')) {
          return ['Container', 'Spoon', 'Carry Bag'];
        }
        return ['Container', 'Spoon', 'Carry Bag']; // Default fallback
      };

      for (const item of items) {
        const dish = await Dish.findById(item.dishId);
        if (dish) {
          const packagingNames = getPackagingForDish(dish.name);
          for (const pkgName of packagingNames) {
            const pkgItem = await Packaging.findOne({
              userId: req.user?.userId,
              name: { $regex: new RegExp(`^${pkgName}$`, 'i') }
            });
            if (pkgItem && req.user?.userId) {
              await deductInventory('Packaging', pkgItem._id, item.quantity, req.user.userId);
            }
          }
        }
      }
    }

    if (orderItems.length > 0) {
      // Apply discount to total revenue and profit (simplified)
      const discountAmount = totalRevenue * ((discount || 0) / 100);
      const discountedRevenue = totalRevenue - discountAmount;
      
      const order = new Order({
        userId: req.user?.userId,
        items: orderItems,
        totalRevenue: discountedRevenue,
        totalProfit: totalProfit - discountAmount, // Profit reduces by discount amount
        customerName,
        customerPhone,
        discount: discount || 0,
        paymentMethod: paymentMethod || 'Cash',
        orderType
      });
      await order.save();

      // Manage customer for future offers
      if (customerPhone && customerName) {
        await Customer.findOneAndUpdate(
          { userId: req.user?.userId, phone: customerPhone },
          { name: customerName },
          { upsert: true, new: true }
        );
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

export const getSalesSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.userId);
    const now = new Date();
    
    const startOfDay = new Date(new Date(now).setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [daily, monthly, yearly] = await Promise.all([
      Order.aggregate([
        { $match: { userId, createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, revenue: { $sum: "$totalRevenue" }, profit: { $sum: "$totalProfit" }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { userId, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, revenue: { $sum: "$totalRevenue" }, profit: { $sum: "$totalProfit" }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { userId, createdAt: { $gte: startOfYear } } },
        { $group: { _id: null, revenue: { $sum: "$totalRevenue" }, profit: { $sum: "$totalProfit" }, count: { $sum: 1 } } }
      ])
    ]);

    // Top selling items (overall)
    const topItems = await Order.aggregate([
      { $match: { userId } },
      { $unwind: "$items" },
      { $group: { _id: "$items.dishId", totalQuantity: { $sum: "$items.quantity" } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'dishes', localField: '_id', foreignField: '_id', as: 'dish' } },
      { $unwind: "$dish" },
      { $project: { name: "$dish.name", totalQuantity: 1 } }
    ]);

    res.status(200).json({
      daily: daily[0] || { revenue: 0, profit: 0, count: 0 },
      monthly: monthly[0] || { revenue: 0, profit: 0, count: 0 },
      yearly: yearly[0] || { revenue: 0, profit: 0, count: 0 },
      topItems
    });
  } catch (error) {
    console.error('Sales Summary Error:', error);
    res.status(500).json({ error: 'Failed to fetch sales summary' });
  }
};
