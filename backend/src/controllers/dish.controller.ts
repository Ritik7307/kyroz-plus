import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Dish from '../models/Dish';
import User from '../models/User';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';
import { seedBlueprints } from '../services/blueprintSeeder.service';


export const deleteAllDishes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await (Recipe as any).deleteMany({ userId, entityModel: 'Dish' });
    await (Dish as any).deleteMany({ userId });
    res.status(200).json({ message: 'All dishes and their recipes have been deleted successfully.' });
  } catch (error) {
    console.error('deleteAllDishes error:', error);
    res.status(500).json({ error: 'Failed to delete dishes' });
  }
};

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
    const { name, price, ingredientPrice, category, imageUrl, allowedWastagePercentage } = req.body;
    const newDish = new Dish({
      name,
      price,
      ingredientPrice,
      category,
      imageUrl,
      allowedWastagePercentage,
      userId: req.user?.userId
    });
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dish' });
  }
};

export const createDishAdvancedSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishDetails, recipeDetails, inventoryDetails } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Create Dish
    const newDish = new Dish({
      name: dishDetails.name,
      price: dishDetails.price,
      ingredientPrice: dishDetails.ingredientPrice || 0,
      category: dishDetails.category,
      imageUrl: dishDetails.imageUrl,
      allowedWastagePercentage: dishDetails.allowedWastagePercentage || 0,
      packagingLogic: inventoryDetails?.packagingLogic || undefined,
      userId
    });
    const savedDish = await newDish.save();

    // 2. Create Recipe if ingredients are provided
    if (recipeDetails && recipeDetails.ingredients && recipeDetails.ingredients.length > 0) {
      const newRecipe = new Recipe({
        targetModel: 'Dish',
        targetId: savedDish._id,
        targetYield: 1,
        operationalYield: 1,
        ingredients: recipeDetails.ingredients,
        userId
      });
      await newRecipe.save();
    }

    // 3. Initialize Inventory
    if (inventoryDetails) {
      const newInventory = new Inventory({
        dishId: savedDish._id,
        platesPerPacket: inventoryDetails.platesPerPacket || 10,
        totalPlates: inventoryDetails.totalPlates || 0,
        lowStockThreshold: inventoryDetails.lowStockThreshold || 5,
        baseUnitName: inventoryDetails.baseUnitName || 'Packet',
        subUnitName: inventoryDetails.subUnitName || 'Plate',
        userId
      });
      await newInventory.save();
    }

    res.status(201).json({ message: 'Dish setup completed successfully', dish: savedDish });
  } catch (error) {
    console.error('Advanced Setup Error:', error);
    res.status(500).json({ error: 'Failed to complete advanced dish setup' });
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
      
    const user = await User.findById(userId);
    
    // Cache the response to prevent DB overload (60 seconds locally, 120 on CDN)
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120');
    
    res.status(200).json({
      shopName: user?.shopName || 'Digital Menu',
      dishes
    });
  } catch (error) {
    console.error('getPublicDishes error:', error);
    res.status(500).json({ error: 'Failed to fetch public menu' });
  }
};
