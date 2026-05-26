import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Dish from '../models/Dish';
import { seedBlueprints } from '../services/blueprintSeeder.service';

export const getDishes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await seedBlueprints(userId);
    }
    const dishes = await Dish.find({ userId });
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
