import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Dish from '../models/Dish';
import bcrypt from 'bcryptjs';

// 1. Create a Sub-Outlet
export const createOutlet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parentUserId = req.user?.userId;
    if (!parentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parentUser = await User.findById(parentUserId);
    if (!parentUser || parentUser.ownerId) {
      res.status(403).json({ error: 'Only primary restaurant owners can create branches.' });
      return;
    }

    const { shopName, shopAddress, email, phone, password } = req.body;
    
    if (!shopName || !email || !password) {
      res.status(400).json({ error: 'Shop Name, Email, and Password are required.' });
      return;
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already in use by another account.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const parentUser = await User.findById(parentUserId);
    const subscriptionPlan = parentUser?.subscriptionPlan || 'None';

    const newOutlet = new User({
      email,
      password: hashedPassword,
      name: 'Branch Manager',
      shopName,
      shopAddress,
      phone,
      role: 'manager', // Branch manager role
      ownerId: parentUserId,
      isLocation: true,
      subscriptionPlan: subscriptionPlan // inherit plan from HQ
    });

    await newOutlet.save();

    res.status(201).json({ message: 'Outlet created successfully', outlet: newOutlet });
  } catch (error: any) {
    console.error('Error creating outlet:', error);
    res.status(500).json({ error: 'Failed to create outlet' });
  }
};

// 2. Get Outlet Details (and its menu)
export const getOutletMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parentUserId = req.user?.userId;
    const { outletId } = req.params;

    if (!parentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Ensure the outlet belongs to the parent
    const outlet = await User.findOne({ _id: outletId, ownerId: parentUserId });
    if (!outlet) {
      res.status(404).json({ error: 'Outlet not found or unauthorized' });
      return;
    }

    const dishes = await Dish.find({ userId: outletId }).sort({ category: 1, name: 1 });
    
    res.status(200).json({ outlet, dishes });
  } catch (error: any) {
    console.error('Error fetching outlet menu:', error);
    res.status(500).json({ error: 'Failed to fetch outlet menu' });
  }
};

// 3. Sync Menu from HQ to Outlet
export const syncMenuToOutlet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parentUserId = req.user?.userId;
    const { outletId } = req.params;

    if (!parentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify ownership
    const outlet = await User.findOne({ _id: outletId, ownerId: parentUserId });
    if (!outlet) {
      res.status(403).json({ error: 'Unauthorized to manage this outlet' });
      return;
    }

    // Get HQ dishes
    const hqDishes = await Dish.find({ userId: parentUserId });
    if (!hqDishes.length) {
      res.status(400).json({ error: 'No dishes found in HQ menu to sync.' });
      return;
    }

    // Get current Outlet dishes to avoid full duplication if possible, 
    // but for simplicity in syncing, we will look for existing names.
    const outletDishes = await Dish.find({ userId: outletId });
    const outletDishMap = new Map(outletDishes.map(d => [d.name.toLowerCase(), d]));

    let addedCount = 0;
    let updatedCount = 0;

    for (const hqDish of hqDishes) {
      const existing = outletDishMap.get(hqDish.name.toLowerCase());
      if (existing) {
        // Update price and category but keep the dish ID
        existing.price = hqDish.price;
        existing.category = hqDish.category;
        existing.ingredientPrice = hqDish.ingredientPrice;
        existing.imageUrl = hqDish.imageUrl;
        await existing.save();
        updatedCount++;
      } else {
        // Create new dish for outlet
        const newDish = new Dish({
          name: hqDish.name,
          price: hqDish.price,
          ingredientPrice: hqDish.ingredientPrice,
          category: hqDish.category,
          imageUrl: hqDish.imageUrl,
          userId: outletId
        });
        await newDish.save();
        addedCount++;
      }
    }

    res.status(200).json({ 
      message: 'Menu synchronized successfully',
      stats: { added: addedCount, updated: updatedCount }
    });
  } catch (error: any) {
    console.error('Error syncing menu:', error);
    res.status(500).json({ error: 'Failed to sync menu to outlet' });
  }
};
