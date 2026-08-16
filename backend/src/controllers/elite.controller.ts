import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Order from '../models/Order';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.userId;

    const owner = await User.findById(ownerId);
    if (!owner || owner.subscriptionPlan !== 'Elite') {
      res.status(403).json({ error: 'Only Elite members can view this dashboard' });
      return;
    }

    const locations: any[] = await User.find({ ownerId, isLocation: true }).lean();
    const locationIds = locations.map(loc => loc._id);

    if (locationIds.length === 0) {
      res.status(200).json({
        totalRevenue: 0,
        totalProfit: 0,
        totalOrders: 0,
        totalLocations: 0,
        locationsData: []
      });
      return;
    }

    // 1. Fetch Orders for all locations
    const orders: any[] = await Order.find({ userId: { $in: locationIds } }).lean();
    
    // 2. Fetch Inventory for all locations
    const inventoryItems: any[] = await Inventory.find({ userId: { $in: locationIds } }).lean();

    // Aggregate Stats
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalOrders = orders.length;

    // Location specific data
    const locationStatsMap = new Map();
    locations.forEach(loc => {
      locationStatsMap.set(loc._id.toString(), {
        id: loc._id,
        name: loc.shopName || 'Unnamed Outlet',
        address: loc.shopAddress,
        revenue: 0,
        profit: 0,
        orderCount: 0,
        inventoryValue: 0
      });
    });

    orders.forEach(order => {
      totalRevenue += order.totalRevenue || 0;
      totalProfit += order.totalProfit || 0;

      const locId = order.userId.toString();
      if (locationStatsMap.has(locId)) {
        const stats = locationStatsMap.get(locId);
        stats.revenue += order.totalRevenue || 0;
        stats.profit += order.totalProfit || 0;
        stats.orderCount += 1;
      }
    });

    inventoryItems.forEach(item => {
      const locId = item.userId.toString();
      if (locationStatsMap.has(locId)) {
        const stats = locationStatsMap.get(locId);
        stats.inventoryValue += (item.price * item.quantity);
      }
    });

    const locationsData = Array.from(locationStatsMap.values());

    res.status(200).json({
      totalRevenue,
      totalProfit,
      totalOrders,
      totalLocations: locations.length,
      locationsData
    });
  } catch (error) {
    console.error('Error fetching elite dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
