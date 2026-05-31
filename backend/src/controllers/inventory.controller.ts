import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Inventory from '../models/Inventory';
import Dish from '../models/Dish';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Premix from '../models/Premix';
import Packaging from '../models/Packaging';
import Recipe from '../models/Recipe';
import Wastage from '../models/Wastage';
import { sendManualStockRequest } from '../services/whatsapp.service';
import { parseInventoryDocument } from '../services/inventoryParser.service';
import mammoth from 'mammoth';
import { deductInventory } from '../services/inventory.service';
import { seedBlueprints } from '../services/blueprintSeeder.service';
const { PDFParse } = require('pdf-parse');

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Only run the massive blueprint seeder if the user has absolutely no dishes.
    const existingDishesCount = await Dish.countDocuments({ userId });
    if (existingDishesCount === 0) {
      await seedBlueprints(userId);
    }

    const inventory = await Inventory.find({ userId }).populate('dishId');
    const rawMaterials = await RawMaterial.find({ userId });
    const semiFinishedGoods = await SemiFinishedGood.find({ userId });
    const premixes = await Premix.find({ userId });
    const packaging = await Packaging.find({ userId });
    const recipes = await Recipe.find({ userId });

    res.status(200).json({
      dishes: inventory,
      rawMaterials,
      semiFinishedGoods,
      premixes,
      packaging,
      recipes
    });
  } catch (error) {
    console.error('getInventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const updateInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId, platesPerPacket, totalPackets } = req.body;
    
    // Convert packets to total plates
    const totalPlates = totalPackets * platesPerPacket;

    const inventory = await Inventory.findOneAndUpdate(
      { dishId, userId: req.user?.userId },
      { 
        platesPerPacket, 
        totalPlates,
        $setOnInsert: { userId: req.user?.userId, dishId } 
      },
      { upsert: true, new: true }
    );

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
};

export const deleteInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Inventory.findOneAndDelete({ _id: id, userId: req.user?.userId });
    res.status(200).json({ message: 'Item removed from inventory' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove inventory item' });
  }
};

export const notifyAdminAboutStock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id).populate('dishId');
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const packets = Math.floor(item.totalPlates / item.platesPerPacket);
    const dishName = (item.dishId as any).name;

    await sendManualStockRequest(dishName, packets);
    res.status(200).json({ message: 'Admin notified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to notify admin' });
  }
};

export const uploadInventoryConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const userId = req.user?.userId;
    if (!file || !userId) {
      res.status(400).json({ error: 'File and authentication required' });
      return;
    }

    let extractedText = '';
    if (file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: file.buffer });
      const data = await parser.getText();
      extractedText = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else if (file.mimetype === 'text/plain' || file.mimetype === 'text/csv') {
      extractedText = file.buffer.toString('utf-8');
    } else {
      res.status(400).json({ error: 'Unsupported format' });
      return;
    }

    const stats = await parseInventoryDocument(extractedText, userId);
    res.status(200).json({ message: 'Inventory configured successfully', stats });
  } catch (error: any) {
    console.error('Inventory config upload error:', error);
    res.status(500).json({ error: 'Failed to process inventory document' });
  }
};

export const updateStock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { model, id, currentStock } = req.body;
    const userId = req.user?.userId;

    if (!model || !id || currentStock === undefined || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    let oldStock = 0;
    let costPerUnit = 0;
    let conversionFactor = 1;
    let purchasePrice = 0;

    // Find the item first to get its current stock before updating
    if (model === 'RawMaterial') {
      const item = await RawMaterial.findOne({ _id: id, userId });
      if (item) {
        oldStock = item.currentStock || 0;
        conversionFactor = item.conversionFactor || 1;
        purchasePrice = item.costPerPurchaseUnit || 0;
        costPerUnit = purchasePrice / conversionFactor;
      }
    } else if (model === 'SemiFinishedGood') {
      const item = await SemiFinishedGood.findOne({ _id: id, userId });
      if (item) {
        oldStock = item.currentStock || 0;
        costPerUnit = item.costPerUnit || 0;
      }
    } else if (model === 'Premix') {
      const item = await Premix.findOne({ _id: id, userId });
      if (item) {
        oldStock = item.currentStock || 0;
      }
    } else if (model === 'Packaging') {
      const item = await Packaging.findOne({ _id: id, userId });
      if (item) {
        oldStock = item.currentStock || 0;
        costPerUnit = item.costPerUnit || 0;
      }
    }

    let updatedItem = null;
    if (model === 'RawMaterial') {
      updatedItem = await RawMaterial.findOneAndUpdate({ _id: id, userId }, { currentStock }, { new: true });
    } else if (model === 'SemiFinishedGood') {
      updatedItem = await SemiFinishedGood.findOneAndUpdate({ _id: id, userId }, { currentStock }, { new: true });
    } else if (model === 'Premix') {
      updatedItem = await Premix.findOneAndUpdate({ _id: id, userId }, { currentStock }, { new: true });
    } else if (model === 'Packaging') {
      updatedItem = await Packaging.findOneAndUpdate({ _id: id, userId }, { currentStock }, { new: true });
    } else {
      res.status(400).json({ error: 'Invalid model type' });
      return;
    }

    if (!updatedItem) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // If new stock is less than old stock, log the difference as wastage (overuse / audit loss)
    const newStock = Number(currentStock);
    if (newStock < oldStock && (model === 'RawMaterial' || model === 'SemiFinishedGood' || model === 'Packaging')) {
      const diff = oldStock - newStock;
      const costLost = costPerUnit * diff;

      await Wastage.create({
        itemModel: model,
        itemId: id,
        quantity: diff,
        reason: 'Inventory Audit Variance (Overuse)',
        costLost,
        userId
      });
      console.log(`Auto logged audit wastage of ${diff} for item ${id} (Loss: ₹${costLost.toFixed(2)})`);
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

export const addPurchaseEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { itemId, itemModel, quantity, cost } = req.body;

    if (!userId || !itemId || !itemModel || quantity === undefined || cost === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (itemModel === 'RawMaterial') {
      const rm = await RawMaterial.findOne({ _id: itemId, userId });
      if (!rm) {
        res.status(404).json({ error: 'Raw material not found' });
        return;
      }
      const conversion = rm.conversionFactor || 1;
      const consumptionQty = quantity * conversion;
      rm.currentStock += consumptionQty;
      rm.costPerPurchaseUnit = cost / quantity;
      await rm.save();
      res.status(200).json({ message: 'Purchase registered successfully', item: rm });
    } else if (itemModel === 'Packaging') {
      const pkg = await Packaging.findOne({ _id: itemId, userId });
      if (!pkg) {
        res.status(404).json({ error: 'Packaging item not found' });
        return;
      }
      pkg.currentStock += quantity;
      pkg.costPerUnit = cost / quantity;
      await pkg.save();
      res.status(200).json({ message: 'Purchase registered successfully', item: pkg });
    } else {
      res.status(400).json({ error: 'Invalid item model type' });
    }
  } catch (error) {
    console.error('Purchase entry error:', error);
    res.status(500).json({ error: 'Failed to process purchase entry' });
  }
};

export const addProductionEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    // Support both old { dishId, batches } and new { itemId, itemModel, batches } structure
    const { dishId, itemId, itemModel = 'Dish', batches } = req.body;
    const targetId = itemId || dishId;

    if (!userId || !targetId || !batches || batches <= 0) {
      res.status(400).json({ error: 'Missing or invalid fields' });
      return;
    }

    let targetName = '';
    if (itemModel === 'Dish') {
      const dish = await Dish.findOne({ _id: targetId, userId });
      if (!dish) {
        res.status(404).json({ error: 'Dish not found' });
        return;
      }
      targetName = dish.name;
    } else if (itemModel === 'SemiFinishedGood') {
      const sfg = await SemiFinishedGood.findOne({ _id: targetId, userId });
      if (!sfg) {
        res.status(404).json({ error: 'Semi-finished good not found' });
        return;
      }
      targetName = sfg.name;
    } else {
      res.status(400).json({ error: 'Unsupported item model for production' });
      return;
    }

    const recipe = await Recipe.findOne({ targetModel: itemModel, targetId, userId });
    if (!recipe) {
      res.status(404).json({ error: `Recipe not found for ${targetName}. Please define a recipe first.` });
      return;
    }

    // 1. Deduct ingredients only for Semi-Finished Goods production to prevent double deduction
    if (itemModel === 'SemiFinishedGood') {
      for (const ingredient of recipe.ingredients) {
        const deductionQty = ingredient.quantity * batches;
        await deductInventory(ingredient.itemModel, ingredient.itemId, deductionQty, userId);
      }
    }

    const yieldQty = recipe.operationalYield * batches;

    // 2. Add portions to target stock
    if (itemModel === 'Dish') {
      const inventory = await Inventory.findOneAndUpdate(
        { dishId: targetId, userId },
        { $inc: { totalPlates: yieldQty } },
        { upsert: true, new: true }
      );
      res.status(200).json({
        message: `Successfully produced ${batches} batch(es) (${yieldQty} portion(s)) of ${targetName}`,
        inventory
      });
    } else {
      const sfg = await SemiFinishedGood.findOneAndUpdate(
        { _id: targetId, userId },
        { $inc: { currentStock: yieldQty } },
        { new: true }
      );
      res.status(200).json({
        message: `Successfully produced ${batches} batch(es) (${yieldQty} ${sfg?.yieldUnit || 'units'}) of ${targetName}`,
        semiFinishedGood: sfg
      });
    }
  } catch (error) {
    console.error('Production entry error:', error);
    res.status(500).json({ error: 'Failed to process production entry' });
  }
};
