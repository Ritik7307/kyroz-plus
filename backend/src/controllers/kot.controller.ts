import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Kot from '../models/Kot';
import Dish from '../models/Dish';
import Packaging from '../models/Packaging';
import Inventory from '../models/Inventory';
import SyncQueue from '../models/SyncQueue';


// Create a new Kitchen Order Ticket (KOT)
export const createKot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, tableNumber = 'Quick Bill', orderType = 'DineIn', customerName = '', customerPhone = '', offline_id } = req.body;
    const userId = req.user?.userId;


    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Invalid or empty items list' });
      return;
    }

    if (offline_id) {
      const existingKot = await Kot.findOne({ offline_id });
      if (existingKot) {
        const populatedKot = await Kot.findById(existingKot._id).populate('items.dishId', 'name category price');
        res.status(200).json({
          message: 'KOT sent to kitchen successfully (idempotent)',
          kot: populatedKot
        });
        return;
      }
    }

    // Generate KOT number (resets daily per user/restaurant in IST timezone)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const currentIST = new Date(now.getTime() + istOffset);
    const startOfDayIST = Date.UTC(currentIST.getUTCFullYear(), currentIST.getUTCMonth(), currentIST.getUTCDate(), 0, 0, 0, 0);
    const startOfDay = new Date(startOfDayIST - istOffset);

    const lastKotToday = await Kot.findOne({ userId, createdAt: { $gte: startOfDay } }).sort({ kotNumber: -1 });
    const kotNumber = lastKotToday ? lastKotToday.kotNumber + 1 : 1;

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
      items: items.map((item: any) => ({
        dishId: item.dishId,
        name: item.dishName || 'Unknown Dish',
        quantity: item.quantity,
        note: item.note || ''
      })),
      status: 'Pending',
      packaging: Object.keys(resolvedPackaging).map(name => ({
        name,
        quantity: resolvedPackaging[name]
      })),
      offline_id
    });

    try {
      await newKot.save();
    } catch (saveError: any) {
      if (saveError.code === 11000 && saveError.keyPattern?.kotNumber) {
        // Find highest kotNumber again and retry once
        const latestKotRetry = await Kot.findOne({ userId, createdAt: { $gte: startOfDay } }).sort({ kotNumber: -1 });
        newKot.kotNumber = latestKotRetry ? latestKotRetry.kotNumber + 1 : 1;
        await newKot.save();
      } else {
        throw saveError;
      }
    }
    
    if (process.env.IS_LOCAL_SERVER === 'true') {
      const syncId = offline_id || new mongoose.Types.ObjectId().toString();
      await SyncQueue.create({
        operation_id: syncId,
        entity_type: 'KOT',
        entity_id: newKot._id.toString(),
        operation: 'CREATE',
        payload: { ...req.body, offline_id: syncId }
      });
    }

    
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

    try {
      const { getIo } = require('../socket');
      const io = getIo();
      io.to(userId).emit('KOT_CREATED', populatedKot);
    } catch (e) {
      console.error('Socket.io error emitting KOT_CREATED', e);
    }

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
      .sort({ createdAt: 1 })
      .lean(); // Oldest first so kitchen prepares in sequence

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
      .sort({ createdAt: -1 })
      .lean();

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

    if (process.env.IS_LOCAL_SERVER === 'true') {
      await SyncQueue.create({
        operation_id: new mongoose.Types.ObjectId().toString(),
        entity_type: 'KOT',
        entity_id: kot._id.toString(),
        operation: 'UPDATE',
        payload: { id, status }
      });
    }

    const populatedKot = await Kot.findById(kot._id).populate('items.dishId', 'name category price');

    try {
      const { getIo } = require('../socket');
      const io = getIo();
      io.to(userId).emit('KOT_UPDATED', populatedKot);
    } catch (e) {
      console.error('Socket.io error emitting KOT_UPDATED', e);
    }

    res.status(200).json({
      message: `KOT status updated to ${status}`,
      kot: populatedKot
    });
  } catch (error) {
    console.error('Update KOT Status Error:', error);
    res.status(500).json({ error: 'Failed to update KOT status' });
  }
};
