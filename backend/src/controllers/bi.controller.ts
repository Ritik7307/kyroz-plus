import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Order from '../models/Order';
import WasteRecord from '../models/WasteRecord';
import Dish from '../models/Dish';
import PurchaseEntry from '../models/PurchaseEntry';

export const getBusinessSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Date range (default to last 30 days if not provided)
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate as string) : new Date();

    // 1. Revenue & Orders
    const orders = await Order.find({
      userId,
      createdAt: { $gte: start, $lte: end }
    }).lean();

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalRevenue || 0), 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // 2. Food Cost & Gross Margin
    // Calculate total ingredient cost from all orders
    let totalFoodCost = 0;
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        totalFoodCost += (item.ingredientPrice || 0) * (item.quantity || 1);
      });
    });

    const foodCostPercentage = totalRevenue > 0 ? (totalFoodCost / totalRevenue) * 100 : 0;
    const grossProfit = totalRevenue - totalFoodCost;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // 3. Wastage
    const wastageRecords = await WasteRecord.find({
      userId,
      date: { $gte: start, $lte: end }
    }).lean();
    const totalWastageCost = wastageRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

    res.status(200).json({
      revenue: totalRevenue,
      orders: totalOrders,
      aov: Math.round(aov),
      foodCostPercentage: foodCostPercentage.toFixed(1),
      grossProfit,
      grossMargin: grossMargin.toFixed(1),
      totalWastageCost
    });
  } catch (error) {
    console.error('BI getBusinessSummary error:', error);
    res.status(500).json({ error: 'Failed to fetch business summary' });
  }
};

export const getSalesTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) return;

    // Aggregate orders by day for the last 30 days
    const start = new Date(new Date().setDate(new Date().getDate() - 30));
    
    const pipeline: any[] = [
      {
        $match: {
          userId: userId,
          createdAt: { $gte: start }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalRevenue" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const trends = await Order.aggregate(pipeline);
    res.status(200).json(trends);
  } catch (error) {
    console.error('BI getSalesTrend error:', error);
    res.status(500).json({ error: 'Failed to fetch sales trend' });
  }
};

export const getMultiOutletSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parentUserId = req.user?.userId;
    if (!parentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { start = new Date(new Date().setDate(new Date().getDate() - 30)), end = new Date() } = req.query;

    // Fetch all users that belong to this owner
    const User = (await import('../models/User')).default;
    const outlets = (await User.find({ ownerId: parentUserId }).select('_id shopName shopAddress').lean()) as any[];
    
    // Also include the parent user if they operate a store themselves
    const parentUser = (await User.findById(parentUserId).select('_id shopName shopAddress').lean()) as any;
    if (parentUser) outlets.push(parentUser);

    const outletIds = outlets.map((o: any) => o._id.toString());
    if (outletIds.length === 0) {
      res.status(200).json({ outlets: [] });
      return;
    }

    const orders = await Order.find({
      userId: { $in: outletIds },
      createdAt: { $gte: start, $lte: end }
    }).lean();

    const outletStats = new Map();
    outlets.forEach((o: any) => {
      outletStats.set(o._id.toString(), {
        _id: o._id,
        shopName: o.shopName || 'Unknown Outlet',
        shopAddress: o.shopAddress || '',
        revenue: 0,
        orders: 0,
        foodCost: 0
      });
    });

    orders.forEach(order => {
      const uId = order.userId.toString();
      if (outletStats.has(uId)) {
        const stats = outletStats.get(uId);
        stats.revenue += order.totalRevenue || 0;
        stats.orders += 1;
        
        order.items.forEach((item: any) => {
          stats.foodCost += (item.ingredientPrice || 0) * (item.quantity || 1);
        });
      }
    });

    // Calculate margins
    const results = Array.from(outletStats.values()).map(stat => ({
      ...stat,
      foodCostPercentage: stat.revenue > 0 ? ((stat.foodCost / stat.revenue) * 100).toFixed(1) : '0',
      grossMargin: stat.revenue > 0 ? (((stat.revenue - stat.foodCost) / stat.revenue) * 100).toFixed(1) : '0'
    }));

    res.status(200).json({ outlets: results });
  } catch (error) {
    console.error('BI getMultiOutletSummary error:', error);
    res.status(500).json({ error: 'Failed to fetch multi-outlet summary' });
  }
};

export const getAnomalies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) return;

    const anomalies = [];
    
    // Simple Anomaly 1: High Food Cost Warning
    // Get last 7 days vs previous 7 days
    const today = new Date();
    const last7Days = new Date(today); last7Days.setDate(today.getDate() - 7);
    const prev7Days = new Date(today); prev7Days.setDate(today.getDate() - 14);

    const recentOrders = await Order.find({ userId, createdAt: { $gte: last7Days } }).lean();
    const olderOrders = await Order.find({ userId, createdAt: { $gte: prev7Days, $lt: last7Days } }).lean();

    const calcFoodCost = (orders: any[]) => {
      let rev = 0; let cost = 0;
      orders.forEach(o => {
        rev += o.totalRevenue || 0;
        o.items.forEach((i: any) => cost += (i.ingredientPrice || 0) * (i.quantity || 1));
      });
      return rev > 0 ? (cost / rev) * 100 : 0;
    };

    const recentFC = calcFoodCost(recentOrders);
    const olderFC = calcFoodCost(olderOrders);

    if (recentFC > olderFC + 3) { // 3% sudden increase
      anomalies.push({
        type: 'Food Cost Spike',
        message: `Food cost increased from ${olderFC.toFixed(1)}% to ${recentFC.toFixed(1)}% in the last 7 days.`,
        severity: 'High',
        action: 'Review recent purchase prices and portion sizes.'
      });
    }

    res.status(200).json({ anomalies });
  } catch (error) {
    console.error('BI getAnomalies error:', error);
    res.status(500).json({ error: 'Failed to fetch anomalies' });
  }
};
