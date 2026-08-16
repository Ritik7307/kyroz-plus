import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Kot from '../models/Kot';
import Dish from '../models/Dish';
import Packaging from '../models/Packaging';
import Inventory from '../models/Inventory';

// Create a new Kitchen Order Ticket (KOT)
export const createKot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, tableNumber = 'Quick Bill', orderType = 'DineIn', customerName = '', customerPhone = '' } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Invalid or empty items list' });
      return;
    }

    // Generate KOT number (sequential per user/restaurant)
    const lastKot = await Kot.findOne({ userId }).sort({ kotNumber: -1 });
    const kotNumber = lastKot ? lastKot.kotNumber + 1 : 1;

    // Resolve packaging requirements for items based on orderType
    const resolvedPackaging: { [name: string]: number } = {};
    for (const item of items) {
      const dish = await Dish.findById(item.dishId);
      if (dish && dish.packagingLogic) {
        let packagingIds: mongoose.Types.ObjectId[] = [];
        if (orderType === 'Takeaway') {
          packagingIds = dish.packagingLogic.takeaway || [];
        } else if (orderType === 'Delivery') {
          packagingIds = dish.packagingLogic.delivery || [];
        } else if (orderType === 'DineIn') {
          packagingIds = dish.packagingLogic.dineIn || [];
        }

        for (const pkgId of packagingIds) {
          const pkg = await Packaging.findById(pkgId);
          if (pkg) {
            resolvedPackaging[pkg.name] = (resolvedPackaging[pkg.name] || 0) + item.quantity;
          }
        }
      }
    }

    const newKot = new Kot({
      userId,
      kotNumber,
      tableNumber,
      orderType,
      customerName,
      customerPhone,
      items: items.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        note: item.note || ''
      })),
      status: 'Pending',
      packaging: Object.keys(resolvedPackaging).map(name => ({
        name,
        quantity: resolvedPackaging[name]
      }))
    });

    await newKot.save();
    
    // Deduct inventory for each item
    for (const item of items) {
      const inventory = await Inventory.findOne({ dishId: item.dishId, userId });
      if (inventory) {
        inventory.totalPlates -= item.quantity;
        await inventory.save();
      }
    }

    // Populate dishId in response items for UI benefit
    const populatedKot = await Kot.findById(newKot._id).populate('items.dishId', 'name category price');

    res.status(201).json({
      message: 'KOT sent to kitchen successfully',
      kot: populatedKot
    });
  } catch (error) {
    console.error('Create KOT Error:', error);
    res.status(500).json({ error: 'Failed to create KOT' });
  }
};

// Retrieve active KOTs for the kitchen staff
export const getActiveKots = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Retrieve pending, preparing, and ready KOTs (not Served/Cancelled yet, which are considered historical)
    const kots = await Kot.find({
      userId,
      status: { $in: ['Pending', 'Preparing', 'Ready'] }
    })
      .populate('items.dishId', 'name category price')
      .sort({ createdAt: 1 }); // Oldest first so kitchen prepares in sequence

    res.status(200).json(kots);
  } catch (error) {
    console.error('Get Active KOTs Error:', error);
    res.status(500).json({ error: 'Failed to fetch active KOTs' });
  }
};

// Retrieve historical/all KOTs
export const getKotHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const kots = await Kot.find({ userId })
      .populate('items.dishId', 'name category price')
      .sort({ createdAt: -1 });

    res.status(200).json(kots);
  } catch (error) {
    console.error('Get KOT History Error:', error);
    res.status(500).json({ error: 'Failed to fetch KOT history' });
  }
};

// Update status of a KOT
export const updateKotStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const kot = await Kot.findOne({ _id: id, userId });

    if (!kot) {
      res.status(404).json({ error: 'KOT not found or unauthorized' });
      return;
    }
    
    const oldStatus = kot.status;
    kot.status = status;
    await kot.save();

    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      // Refund inventory
      for (const item of kot.items) {
        const inventory = await Inventory.findOne({ dishId: item.dishId, userId });
        if (inventory) {
          inventory.totalPlates += item.quantity;
          await inventory.save();
        }
      }
    }

    const populatedKot = await Kot.findById(kot._id).populate('items.dishId', 'name category price');

    res.status(200).json({
      message: `KOT status updated to ${status}`,
      kot: populatedKot
    });
  } catch (error) {
    console.error('Update KOT Status Error:', error);
    res.status(500).json({ error: 'Failed to update KOT status' });
  }
};
