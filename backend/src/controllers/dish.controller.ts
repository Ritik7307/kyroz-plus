import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Dish from '../models/Dish';
import { seedBlueprints } from '../services/blueprintSeeder.service';

export const getDishes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      // Only run the massive blueprint seeder if the user has absolutely no dishes.
      const existingDishesCount = await Dish.countDocuments({ userId });
      if (existingDishesCount === 0) {
        await seedBlueprints(userId);
      }
    }
    const dishes = await Dish.find({ userId })
      .populate('packagingLogic.dineIn')
      .populate('packagingLogic.takeaway')
      .populate('packagingLogic.delivery');
    res.status(200).json(dishes);
  } catch (error) {
    console.error('getDishes error:', error);
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};

export const createDish = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, price, ingredientPrice, category, imageUrl } = req.body;
    const newDish = new Dish({
      name,
      price,
      ingredientPrice,
      category,
      imageUrl,
      userId: req.user?.userId
    });
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dish' });
  }
};

export const updateDish = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, ingredientPrice, category, imageUrl } = req.body;
    
    const dish = await Dish.findOneAndUpdate(
      { _id: id, userId: req.user?.userId },
      { name, price, ingredientPrice, category, imageUrl },
      { new: true }
    );

    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
      return;
    }

    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dish' });
  }
};

export const deleteDish = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dish = await Dish.findOneAndDelete({ _id: id, userId: req.user?.userId });

    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
      return;
    }

    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dish' });
  }
};

export const getPublicDishes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Shop ID is required' });
      return;
    }
    
    // Using userId to find dishes since dishes are tied to userId
    const dishes = await Dish.find({ userId })
      .populate('packagingLogic.dineIn')
      .populate('packagingLogic.takeaway')
      .populate('packagingLogic.delivery');
      
    // Cache the response to prevent DB overload (60 seconds locally, 120 on CDN)
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120');
    
    res.status(200).json(dishes);
  } catch (error) {
    console.error('getPublicDishes error:', error);
    res.status(500).json({ error: 'Failed to fetch public menu' });
  }
};
