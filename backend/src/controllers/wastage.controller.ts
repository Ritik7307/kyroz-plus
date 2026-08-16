import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Wastage from '../models/Wastage';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Packaging from '../models/Packaging';
import { getIngredientUnitCost } from '../services/inventory.service';

export const logWastage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemModel, itemId, quantity, reason } = req.body;
    const userId = req.user?.userId;

    if (!itemModel || !itemId || !quantity || !reason || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    let costLost = 0;
    let targetItem = null;

    if (itemModel === 'RawMaterial') {
      targetItem = await RawMaterial.findOne({ _id: itemId, userId });
      if (targetItem) {
        const factor = targetItem.conversionFactor || 1;
        costLost = (targetItem.costPerPurchaseUnit / factor) * quantity;
        targetItem.currentStock -= quantity;
        await targetItem.save();
      }
    } else if (itemModel === 'SemiFinishedGood') {
      targetItem = await SemiFinishedGood.findOne({ _id: itemId, userId });
      if (targetItem) {
        const dynamicCost = await getIngredientUnitCost('SemiFinishedGood', itemId, userId);
        costLost = dynamicCost * quantity;
        targetItem.currentStock -= quantity;
        await targetItem.save();
      }
    } else if (itemModel === 'Packaging') {
      targetItem = await Packaging.findOne({ _id: itemId, userId });
      if (targetItem) {
        costLost = targetItem.costPerUnit * quantity;
        targetItem.currentStock -= quantity;
        await targetItem.save();
      }
    } else {
      res.status(400).json({ error: 'Invalid item model for wastage' });
      return;
    }

    if (!targetItem) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const wastageRecord = new Wastage({
      itemModel,
      itemId,
      quantity,
      reason,
      costLost,
      userId
    });

    await wastageRecord.save();

    res.status(201).json({ message: 'Wastage logged and stock updated', wastage: wastageRecord });
  } catch (error) {
    console.error('Wastage Log Error:', error);
    res.status(500).json({ error: 'Failed to log wastage' });
  }
};

export const getWastageHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wastage = await Wastage.find({ userId: req.user?.userId }).sort({ createdAt: -1 }).lean();
    
    const populatedWastage = await Promise.all(wastage.map(async (w) => {
      let name = 'Unknown Item';
      let unit = '';
      if (w.itemModel === 'RawMaterial') {
        const item = await RawMaterial.findOne({ _id: w.itemId, userId: req.user?.userId });
        if (item) {
          name = item.name;
          unit = item.consumptionUnit;
        }
      } else if (w.itemModel === 'SemiFinishedGood') {
        const item = await SemiFinishedGood.findOne({ _id: w.itemId, userId: req.user?.userId });
        if (item) {
          name = item.name;
          unit = item.yieldUnit;
        }
      } else if (w.itemModel === 'Packaging') {
        const item = await Packaging.findOne({ _id: w.itemId, userId: req.user?.userId });
        if (item) {
          name = item.name;
          unit = item.unit;
        }
      }
      return {
        ...w.toObject(),
        itemName: name,
        unit
      };
    }));

    res.status(200).json(populatedWastage);
  } catch (error) {
    console.error('Fetch Wastage Error:', error);
    res.status(500).json({ error: 'Failed to fetch wastage history' });
  }
};
