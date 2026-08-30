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
    const orderStats: Record<string, { totalVisits: number; totalSpent: number; lastVisit: Date; latestOrderId?: string; latestPaymentMethod?: string; latestSplitPayments?: any }> = {};

    orders.forEach((order: any) => {
      const phone = order.customerPhone;
      if (!phone) return;

      if (!orderStats[phone]) {
        orderStats[phone] = {
          totalVisits: 0,
          totalSpent: 0,
          lastVisit: order.createdAt,
          latestOrderId: order._id.toString(),
          latestPaymentMethod: order.paymentMethod,
          latestSplitPayments: order.splitPayments
        };
      }

      orderStats[phone].totalVisits += 1;
      orderStats[phone].totalSpent += order.totalRevenue;
      
      if (new Date(order.createdAt) >= new Date(orderStats[phone].lastVisit)) {
        orderStats[phone].lastVisit = order.createdAt;
        orderStats[phone].latestOrderId = order._id.toString();
        orderStats[phone].latestPaymentMethod = order.paymentMethod;
        orderStats[phone].latestSplitPayments = order.splitPayments;
      }
    });

    // Map stats to customers
    const enrichedCustomers = customers.map(customer => {
      const stats = orderStats[customer.phone] || {
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: customer.createdAt,
        latestOrderId: undefined,
        latestPaymentMethod: undefined,
        latestSplitPayments: undefined
      };

      return {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        totalVisits: stats.totalVisits,
        totalSpent: stats.totalSpent,
        lastVisit: stats.lastVisit,
        latestOrderId: stats.latestOrderId,
        latestPaymentMethod: stats.latestPaymentMethod,
        latestSplitPayments: stats.latestSplitPayments,
        createdAt: customer.createdAt
      };
    });

    res.status(200).json(enrichedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Server error fetching customers' });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const userId = req.user?.userId;

    const customer = await Customer.findOne({ _id: id, userId });
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const today = new Date();
    const createdAt = new Date(customer.createdAt);
    if (createdAt.getDate() !== today.getDate() || 
        createdAt.getMonth() !== today.getMonth() || 
        createdAt.getFullYear() !== today.getFullYear()) {
      res.status(403).json({ error: 'Past records cannot be modified' });
      return;
    }

    customer.name = name;
    customer.phone = phone;
    await customer.save();

    res.status(200).json({ message: 'Customer updated successfully', customer });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Phone number already exists' });
    } else {
      res.status(500).json({ error: 'Server error updating customer' });
    }
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const customer = await Customer.findOne({ _id: id, userId });
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const today = new Date();
    const createdAt = new Date(customer.createdAt);
    if (createdAt.getDate() !== today.getDate() || 
        createdAt.getMonth() !== today.getMonth() || 
        createdAt.getFullYear() !== today.getFullYear()) {
      res.status(403).json({ error: 'Past records cannot be deleted' });
      return;
    }

    await Customer.deleteOne({ _id: id, userId });

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting customer' });
  }
};

export const bulkImportCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { customers } = req.body; // Array of { name, phone }
    
    if (!customers || !Array.isArray(customers)) {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const c of customers) {
      if (!c.name || !c.phone) {
        failCount++;
        continue;
      }
      try {
        await Customer.create({
          userId,
          name: c.name,
          phone: c.phone
        });
        successCount++;
      } catch (err: any) {
        // usually duplicate phone number
        failCount++;
      }
    }

    res.status(200).json({ message: `Import complete. Success: ${successCount}, Failed: ${failCount}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error importing customers' });
  }
};
