import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Customer from '../models/Customer';
import Order from '../models/Order';

export const getCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Fetch all customers for this shop owner
    const customers = await Customer.find({ userId }).lean();

    // Fetch all orders for this shop owner where a customer phone is recorded
    const orders = await Order.find({ 
      userId, 
      customerPhone: { $exists: true, $ne: '' } 
    }).lean();

    // Group orders by phone
    const orderStats: Record<string, { totalVisits: number; totalSpent: number; lastVisit: Date }> = {};

    orders.forEach(order => {
      const phone = order.customerPhone;
      if (!phone) return;

      if (!orderStats[phone]) {
        orderStats[phone] = {
          totalVisits: 0,
          totalSpent: 0,
          lastVisit: order.createdAt
        };
      }

      orderStats[phone].totalVisits += 1;
      orderStats[phone].totalSpent += order.totalRevenue;
      
      if (new Date(order.createdAt) > new Date(orderStats[phone].lastVisit)) {
        orderStats[phone].lastVisit = order.createdAt;
      }
    });

    // Map stats to customers
    const enrichedCustomers = customers.map(customer => {
      const stats = orderStats[customer.phone] || {
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: customer.createdAt
      };

      return {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        totalVisits: stats.totalVisits,
        totalSpent: stats.totalSpent,
        lastVisit: stats.lastVisit
      };
    });

    res.status(200).json(enrichedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Server error fetching customers' });
  }
};
