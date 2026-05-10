import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Notification from '../models/Notification';
import Inventory from '../models/Inventory';
import Subscription from '../models/Subscription';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch persistent notifications from DB
    const dbNotifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    // 2. Check for Low Stock (Dynamic)
    const lowStockItems = await Inventory.find({ 
      userId,
      $expr: { $lte: ["$totalPlates", { $multiply: ["$lowStockThreshold", "$platesPerPacket"] }] }
    }).populate('dishId');

    const inventoryNotifications = lowStockItems
      .filter(item => item.dishId) // Ensure dish exists
      .map(item => ({
        _id: `low-stock-${item._id}`,
        title: 'Low Stock Alert',
        message: `Your stock for ${(item.dishId as any).name} is below the threshold.`,
        type: 'warning',
        category: 'inventory',
        createdAt: new Date(),
        isRead: false
      }));

    // 3. Check for Subscription Expiry (Dynamic)
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    const subNotifications = [];
    
    if (subscription) {
      const daysUntilExpiry = Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        subNotifications.push({
          _id: `sub-expiry-${subscription._id}`,
          title: 'Subscription Ending Soon',
          message: `Your ${subscription.plan} plan expires in ${daysUntilExpiry} days. Upgrade now to avoid service interruption.`,
          type: 'error',
          category: 'subscription',
          createdAt: new Date(),
          isRead: false
        });
      }
    }

    // Combine all
    const allNotifications = [...inventoryNotifications, ...subNotifications, ...dbNotifications];
    
    res.status(200).json(allNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Only mark DB notifications as read
    if (id.startsWith('low-stock-') || id.startsWith('sub-expiry-')) {
      res.status(200).json({ message: 'Dynamic notification acknowledged' });
      return;
    }
    
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const clearAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
};
