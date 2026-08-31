
import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';
import Order from '../models/Order';
import User from '../models/User';
import Customer from '../models/Customer';
import Packaging from '../models/Packaging';
import Notification from '../models/Notification';
import MarketingSettings from '../models/MarketingSettings';
import { sendLowStockAlert, sendCustomerFeedbackWhatsApp, sendAutomatedOrderConfirmation } from '../services/whatsapp.service';
import { deductInventory, calculateDishCost } from '../services/inventory.service';
import SyncQueue from '../models/SyncQueue';


export const processCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      items,
      customerName,
      customerPhone,
      discount,
      discountType = 'percentage',
      discountValue,
      additionalCharge = 0,
      tableNumber,
      paymentMethod,
      orderType = 'DineIn',
      offline_id,
      applyGst
    } = req.body; // Array of { dishId, quantity }

    if (!items || !Array.isArray(items)) {
      res.status(400).json({ error: 'Invalid items format' });
      return;
    } 

    if (offline_id) {
      const existingOrder = await Order.findOne({ offline_id });
      if (existingOrder) {
        res.status(200).json({
          message: 'Checkout successful (idempotent)',
          order: existingOrder,
          updates: [],
          alerts: []
        });
        return;
      }
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
        const ingredientPrice = await calculateDishCost(dishId, req.user?.userId || '', orderType);

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

    // Auto deduct packaging based on Dish's packagingLogic
    for (const item of items) {
      const dish = await Dish.findById(item.dishId);
      if (dish && dish.packagingLogic) {
        let packagingIdsToDeduct: mongoose.Types.ObjectId[] = [];

        if (orderType === 'Takeaway' && dish.packagingLogic.takeaway) {
          packagingIdsToDeduct = dish.packagingLogic.takeaway;
        } else if (orderType === 'Delivery' && dish.packagingLogic.delivery) {
          packagingIdsToDeduct = dish.packagingLogic.delivery;
        } else if (orderType === 'DineIn' && dish.packagingLogic.dineIn) {
          packagingIdsToDeduct = dish.packagingLogic.dineIn;
        }

        for (const pkgId of packagingIdsToDeduct) {
          if (req.user?.userId) {
            await deductInventory('Packaging', pkgId, item.quantity, req.user.userId);
          }
        }
      }
    }

      let order: any;
      if (orderItems.length > 0) {
        // Calculate discount amount based on type
        let discountAmount = 0;
      const dValue = discountValue !== undefined ? discountValue : (discount || 0);
      if (discountType === 'flat') {
        discountAmount = dValue;
      } else {
        discountAmount = totalRevenue * (dValue / 100);
      }

      const charge = additionalCharge || 0;
      const afterDiscount = Math.max(0, totalRevenue - discountAmount);
      
      let gstAmount = 0;
      if (applyGst) {
        const user = await User.findById(req.user?.userId);
        const gstRate = user?.gstPercentage || 0;
        gstAmount = afterDiscount * (gstRate / 100);
      }

      const discountedRevenue = Math.round(afterDiscount + gstAmount + charge);

      // Generate bill number (resets daily per user/restaurant in IST timezone)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const currentIST = new Date(now.getTime() + istOffset);
      const startOfDayIST = Date.UTC(currentIST.getUTCFullYear(), currentIST.getUTCMonth(), currentIST.getUTCDate(), 0, 0, 0, 0);
      const startOfDay = new Date(startOfDayIST - istOffset);

      const lastOrderToday = await Order.findOne({ userId: req.user?.userId, createdAt: { $gte: startOfDay } }).sort({ billNumber: -1 });
      const billNumber = lastOrderToday && lastOrderToday.billNumber ? lastOrderToday.billNumber + 1 : 1;

      const newOrder = new Order({
        userId: req.user?.userId,
        items: orderItems,
        totalRevenue: discountedRevenue,
        totalProfit: totalProfit - discountAmount + charge, // Profit increases by charges, reduces by discount
        customerName,
        customerPhone,
        discount: discountType === 'percentage' ? dValue : 0, // Legacy support for % discount
        discountType,
        discountValue: dValue,
        additionalCharge: charge,
        tableNumber,
        paymentMethod: paymentMethod || 'Cash',
        orderType,
        offline_id,
        billNumber
      });
      order = await newOrder.save();

      if (process.env.IS_LOCAL_SERVER === 'true') {
        const syncId = offline_id || new mongoose.Types.ObjectId().toString();
        await SyncQueue.create({
          operation_id: syncId,
          entity_type: 'Order',
          entity_id: order._id.toString(),
          operation: 'CREATE',
          payload: { ...req.body, offline_id: syncId }
        });
      }


      // Manage customer for future offers
      if (customerPhone && customerName) {
        await Customer.findOneAndUpdate(
          { userId: req.user?.userId, phone: customerPhone },
          { name: customerName },
          { upsert: true, new: true }
        );
      }

      if (customerPhone) {
        // Run in background without blocking response
        const user = await User.findById(req.user?.userId);
        const shopName = user?.shopName || 'our restaurant';
        
        // Automated Order Confirmation
        MarketingSettings.findOne({ userId: req.user?.userId }).then(settings => {
          if (settings?.whatsappConnected && settings?.automationSettings?.orderConfirmation) {
            sendAutomatedOrderConfirmation(
              customerPhone, 
              order._id.toString().substring(18), // Short order ID
              shopName,
              { phoneNumberId: settings.phoneNumberId, accessToken: settings.accessToken }
            ).catch(err => console.error('Auto Order Conf Error:', err));
          }
        }).catch(err => console.error('Marketing Settings Error:', err));

        // Auto-send WhatsApp Feedback if phone is provided
        sendCustomerFeedbackWhatsApp(customerPhone, customerName || '', shopName).catch(err => console.error('Feedback send error:', err));
      }
    }

    try {
      const { getIo } = require('../socket');
      const io = getIo();
      if (req.user?.userId) {
        io.to(req.user.userId).emit('NEW_ORDER', order);
      }
    } catch (e) {
      console.error('Socket.io error emitting NEW_ORDER', e);
    }

    res.status(200).json({
      message: 'Checkout successful and inventory updated',
      order,
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
    }).lean();

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
      .sort({ createdAt: -1 })
      .limit(500) // Added limit to reduce latency and payload size
      .lean();

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
    
    // Calculate boundaries strictly in IST (UTC+5:30) to avoid server timezone discrepancies
    const istOffset = 5.5 * 60 * 60 * 1000;
    const currentIST = new Date(now.getTime() + istOffset);
    
    const startOfDayIST = Date.UTC(currentIST.getUTCFullYear(), currentIST.getUTCMonth(), currentIST.getUTCDate(), 0, 0, 0, 0);
    const startOfDay = new Date(startOfDayIST - istOffset);
    
    const startOfMonthIST = Date.UTC(currentIST.getUTCFullYear(), currentIST.getUTCMonth(), 1, 0, 0, 0, 0);
    const startOfMonth = new Date(startOfMonthIST - istOffset);
    
    const startOfYearIST = Date.UTC(currentIST.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    const startOfYear = new Date(startOfYearIST - istOffset);

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

    // Comprehensive Item Analytics (Limited to this year to prevent huge latency)
    const itemAnalytics = await Order.aggregate([
      { $match: { userId, createdAt: { $gte: startOfYear } } },
      {
        $addFields: {
          baseOrderRevenue: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: { $multiply: ["$$item.price", "$$item.quantity"] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          orderMultiplier: {
            $cond: [
              { $gt: ["$baseOrderRevenue", 0] },
              { $divide: ["$totalRevenue", "$baseOrderRevenue"] },
              1
            ]
          }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.dishId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity", "$orderMultiplier"] } },
          totalCost: { $sum: { $multiply: ["$items.ingredientPrice", "$items.quantity"] } },
          totalProfit: { $sum: { $subtract: [{ $multiply: ["$items.price", "$items.quantity", "$orderMultiplier"] }, { $multiply: ["$items.ingredientPrice", "$items.quantity"] }] } }
        }
      },
      { $lookup: { from: 'dishes', localField: '_id', foreignField: '_id', as: 'dish' } },
      { $unwind: "$dish" },
      {
        $project: {
          name: "$dish.name",
          totalQuantity: 1,
          totalRevenue: 1,
          totalCost: 1,
          totalProfit: 1,
          profitMargin: {
            $cond: [
              { $gt: ["$totalRevenue", 0] },
              { $multiply: [{ $divide: ["$totalProfit", "$totalRevenue"] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    res.status(200).json({
      daily: daily[0] || { revenue: 0, profit: 0, count: 0 },
      monthly: monthly[0] || { revenue: 0, profit: 0, count: 0 },
      yearly: yearly[0] || { revenue: 0, profit: 0, count: 0 },
      itemAnalytics
    });
  } catch (error) {
    console.error('Sales Summary Error:', error);
    res.status(500).json({ error: 'Failed to fetch sales summary' });
  }
};

export const getEliteAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.userId;

    const owner = await User.findById(ownerId);
    if (!owner || owner.subscriptionPlan !== 'Scale') {
      res.status(403).json({ error: 'Only Scale members can access this' });
      return;
    }

    // Find all location IDs
    const locations = await User.find({ ownerId, isLocation: true }).lean();
    const locationIds = locations.map(l => l._id);

    const now = new Date();
    const startOfDay = new Date(new Date(now).setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [daily, monthly, locationBreakdown] = await Promise.all([
      Order.aggregate([
        { $match: { userId: { $in: locationIds }, createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, revenue: { $sum: "$totalRevenue" }, profit: { $sum: "$totalProfit" }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { userId: { $in: locationIds }, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, revenue: { $sum: "$totalRevenue" }, profit: { $sum: "$totalProfit" }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { userId: { $in: locationIds }, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: "$userId", revenue: { $sum: "$totalRevenue" }, profit: { $sum: "$totalProfit" }, count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'location' } },
        { $unwind: "$location" },
        { $project: { name: "$location.shopName", revenue: 1, profit: 1, count: 1 } }
      ])
    ]);

    res.status(200).json({
      daily: daily[0] || { revenue: 0, profit: 0, count: 0 },
      monthly: monthly[0] || { revenue: 0, profit: 0, count: 0 },
      locationBreakdown
    });
  } catch (error) {
    console.error('Elite Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch elite analytics' });
  }
};

export const updateOrderPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentMethod, splitPayments } = req.body;
    const userId = req.user?.userId;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (!['Cash', 'Online', 'Split'].includes(paymentMethod)) {
      res.status(400).json({ error: 'Invalid payment method' });
      return;
    }

    if (paymentMethod === 'Split') {
      if (!splitPayments || typeof splitPayments.cash !== 'number' || typeof splitPayments.online !== 'number') {
        res.status(400).json({ error: 'Invalid split payments payload' });
        return;
      }
      // Optional check if they exactly match totalRevenue:
      // if (Math.abs((splitPayments.cash + splitPayments.online) - order.totalRevenue) > 1) {
      //   return res.status(400).json({ error: 'Split amounts must equal total revenue' });
      // }
      order.splitPayments = splitPayments;
    } else {
      order.splitPayments = undefined;
    }

    order.paymentMethod = paymentMethod;
    await order.save();

    res.status(200).json({ message: 'Payment method updated successfully', order });
  } catch (error) {
    console.error('Update Order Payment Error:', error);
    res.status(500).json({ error: 'Failed to update order payment' });
  }
};
