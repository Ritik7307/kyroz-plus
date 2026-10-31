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

    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate as string) : new Date();
    
    const pipeline: any[] = [
      {
        $match: {
          userId: userId,
          createdAt: { $gte: start, $lte: end }
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

    // Anomaly 2: Low Margin items with high order volume
    const dishes = await Dish.find({ userId }).lean();
    const lowMarginDishes = dishes.filter((d: any) => {
      const margin = d.price > 0 ? ((d.price - (d.ingredientPrice || 0)) / d.price) * 100 : 0;
      return margin < 25;
    });

    if (lowMarginDishes.length > 0) {
      anomalies.push({
        type: 'Low Margin Dishes',
        message: `${lowMarginDishes.length} menu items have gross margin below 25%.`,
        severity: 'Medium',
        action: 'Review recipe costing or adjust selling prices in Menu Engineering.'
      });
    }

    res.status(200).json({ anomalies });
  } catch (error) {
    console.error('BI getAnomalies error:', error);
    res.status(500).json({ error: 'Failed to fetch anomalies' });
  }
};

export const getPredictionsAndAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Forecast Revenue (Simple Linear Moving Average & Growth Momentum)
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    const orders = await Order.find({ userId, createdAt: { $gte: last30Days } }).lean();

    // Group sales by day
    const dayMap = new Map<string, number>();
    orders.forEach(o => {
      const day = new Date(o.createdAt).toISOString().split('T')[0];
      dayMap.set(day, (dayMap.get(day) || 0) + (o.totalRevenue || 0));
    });

    const dayRevenues = Array.from(dayMap.values());
    const avgDailyRevenue = dayRevenues.length > 0 
      ? dayRevenues.reduce((a, b) => a + b, 0) / Math.max(1, dayRevenues.length)
      : 0;

    // Recent 7 days vs older 7 days trend
    const recent7Days = new Date(today);
    recent7Days.setDate(today.getDate() - 7);
    const prev7Days = new Date(today);
    prev7Days.setDate(today.getDate() - 14);

    const revRecent7 = orders
      .filter(o => new Date(o.createdAt) >= recent7Days)
      .reduce((s, o) => s + (o.totalRevenue || 0), 0);
    const revPrev7 = orders
      .filter(o => new Date(o.createdAt) >= prev7Days && new Date(o.createdAt) < recent7Days)
      .reduce((s, o) => s + (o.totalRevenue || 0), 0);

    const growthRate = revPrev7 > 0 ? ((revRecent7 - revPrev7) / revPrev7) : 0;
    const projectedNext7Days = Math.round(revRecent7 * (1 + Math.max(-0.5, Math.min(0.5, growthRate))));
    const projectedNext30Days = Math.round(avgDailyRevenue * 30 * (1 + (growthRate * 0.5)));

    // 2. Inventory Stockout Alerts
    const RawMaterial = (await import('../models/RawMaterial')).default;
    const rawMaterials = await RawMaterial.find({ userId }).lean();

    const lowStockItems = rawMaterials
      .filter((rm: any) => (rm.reorderLevel && rm.currentStock <= rm.reorderLevel) || rm.currentStock <= 5)
      .map((rm: any) => ({
        _id: rm._id,
        name: rm.name,
        category: rm.category,
        currentStock: rm.currentStock,
        reorderLevel: rm.reorderLevel || 5,
        unit: rm.consumptionUnit || rm.purchaseUnit || 'units'
      }));

    // 3. Automated Action Recommendations
    const actionRecommendations = [];
    if (growthRate < -0.05) {
      actionRecommendations.push({
        title: 'Sales Velocity Dip Detected',
        description: `Revenue contracted by ${(Math.abs(growthRate) * 100).toFixed(1)}% compared to the prior week. Consider launching a weekend campaign or combo deal.`,
        urgency: 'High',
        tag: 'Marketing'
      });
    } else if (growthRate > 0.1) {
      actionRecommendations.push({
        title: 'Strong Growth Momentum (+ ' + (growthRate * 100).toFixed(1) + '%)',
        description: 'Orders are accelerating. Ensure peak shift staffing and prep stocks are reinforced.',
        urgency: 'Medium',
        tag: 'Operations'
      });
    }

    if (lowStockItems.length > 0) {
      actionRecommendations.push({
        title: `${lowStockItems.length} Ingredients Approaching Stockout`,
        description: `Critical items: ${lowStockItems.slice(0, 3).map(i => i.name).join(', ')}. Generate purchase order to prevent menu stockouts.`,
        urgency: 'High',
        tag: 'Inventory'
      });
    }

    res.status(200).json({
      forecast: {
        avgDailyRevenue: Math.round(avgDailyRevenue),
        growthRate: (growthRate * 100).toFixed(1),
        projectedNext7Days,
        projectedNext30Days,
      },
      stockoutAlerts: lowStockItems,
      actionRecommendations
    });
  } catch (error) {
    console.error('BI getPredictionsAndAlerts error:', error);
    res.status(500).json({ error: 'Failed to generate predictions and alerts' });
  }
};

export const getCategoryBreakdown = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate as string) : new Date();

    const dishes = await Dish.find({ userId }).lean();
    const dishCategoryMap = new Map<string, string>();
    dishes.forEach((d: any) => {
      dishCategoryMap.set(d._id.toString(), d.category || 'General');
    });

    const orders = await Order.find({ userId, createdAt: { $gte: start, $lte: end } }).lean();

    const categoryStats = new Map<string, { category: string; revenue: number; itemsSold: number; cost: number }>();

    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const cat = dishCategoryMap.get(item.dishId.toString()) || 'General';
        const curr = categoryStats.get(cat) || { category: cat, revenue: 0, itemsSold: 0, cost: 0 };
        curr.revenue += (item.price || 0) * (item.quantity || 1);
        curr.itemsSold += (item.quantity || 1);
        curr.cost += (item.ingredientPrice || 0) * (item.quantity || 1);
        categoryStats.set(cat, curr);
      });
    });

    const breakdown = Array.from(categoryStats.values()).map(cat => ({
      ...cat,
      profit: cat.revenue - cat.cost,
      margin: cat.revenue > 0 ? (((cat.revenue - cat.cost) / cat.revenue) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({ breakdown });
  } catch (error) {
    console.error('BI getCategoryBreakdown error:', error);
    res.status(500).json({ error: 'Failed to fetch category breakdown' });
  }
};

