import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Dish from '../models/Dish';
import Recipe from '../models/Recipe';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Packaging from '../models/Packaging';

const resolveIngredientCost = async (itemModel: string, itemId: any, userId: any): Promise<number> => {
  if (itemModel === 'RawMaterial') {
    const rm = await RawMaterial.findOne({ _id: itemId, userId });
    if (!rm) return 0;
    const factor = rm.conversionFactor || 1;
    return rm.costPerPurchaseUnit / factor;
  } else if (itemModel === 'SemiFinishedGood') {
    const sfg = await SemiFinishedGood.findOne({ _id: itemId, userId });
    if (!sfg) return 0;
    
    // Recursive lookup if recipe exists
    const recipe = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: itemId, userId });
    if (recipe) {
      let totalCost = 0;
      for (const ing of recipe.ingredients) {
        const cost = await resolveIngredientCost(ing.itemModel, ing.itemId, userId);
        totalCost += cost * ing.quantity;
      }
      const yieldQty = recipe.operationalYield || sfg.batchYield || 1;
      return totalCost / yieldQty;
    }
    return sfg.costPerUnit || 0;
  } else if (itemModel === 'Packaging') {
    const pkg = await Packaging.findOne({ _id: itemId, userId });
    return pkg ? pkg.costPerUnit : 0;
  }
  return 0;
};

const getRecipeDetailsRecursive = async (
  itemModel: string,
  itemId: any,
  quantityNeeded: number,
  userId: any,
  parentName?: string
): Promise<any[]> => {
  let details: any[] = [];

  let name = 'Unknown Ingredient';
  let unit = '';
  let rateUnit = '';
  let purchasePrice = 0;
  let unitCost = 0;

  if (itemModel === 'RawMaterial') {
    const rm = await RawMaterial.findOne({ _id: itemId, userId });
    if (rm) {
      name = rm.name;
      unit = rm.consumptionUnit;
      rateUnit = rm.purchaseUnit;
      purchasePrice = rm.costPerPurchaseUnit;
      const factor = rm.conversionFactor || 1;
      unitCost = rm.costPerPurchaseUnit / factor;
    }
    details.push({
      itemModel,
      itemId: itemId.toString(),
      name,
      quantity: quantityNeeded,
      unit,
      rateUnit,
      purchasePrice,
      unitCost,
      totalCost: unitCost * quantityNeeded,
      isSubIngredient: !!parentName,
      parentSfgName: parentName
    });
  } else if (itemModel === 'SemiFinishedGood') {
    const sfg = await SemiFinishedGood.findOne({ _id: itemId, userId });
    if (sfg) {
      name = sfg.name;
      unit = sfg.yieldUnit;
      rateUnit = sfg.yieldUnit;
      purchasePrice = sfg.costPerUnit;

      const sfgRecipe = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: itemId, userId });
      if (sfgRecipe) {
        let subDetails: any[] = [];
        let batchCost = 0;
        const yieldQty = sfgRecipe.operationalYield || sfg.batchYield || 1;
        
        for (const ing of sfgRecipe.ingredients) {
          const scaledSubQty = ing.quantity * (quantityNeeded / yieldQty);
          const resolved = await getRecipeDetailsRecursive(ing.itemModel, ing.itemId, scaledSubQty, userId, name);
          subDetails = subDetails.concat(resolved);
          const subUnitCost = resolved.length > 0 ? resolved[0].unitCost : 0;
          batchCost += subUnitCost * ing.quantity;
        }

        unitCost = batchCost / yieldQty;
        purchasePrice = unitCost;

        details.push({
          itemModel,
          itemId: itemId.toString(),
          name,
          quantity: quantityNeeded,
          unit,
          rateUnit,
          purchasePrice,
          unitCost,
          totalCost: unitCost * quantityNeeded,
          isSubIngredient: !!parentName,
          parentSfgName: parentName
        });

        details = details.concat(subDetails);
      } else {
        unitCost = sfg.costPerUnit || 0;
        details.push({
          itemModel,
          itemId: itemId.toString(),
          name,
          quantity: quantityNeeded,
          unit,
          rateUnit,
          purchasePrice,
          unitCost,
          totalCost: unitCost * quantityNeeded,
          isSubIngredient: !!parentName,
          parentSfgName: parentName
        });
      }
    }
  } else if (itemModel === 'Packaging') {
    const pkg = await Packaging.findOne({ _id: itemId, userId });
    if (pkg) {
      name = pkg.name;
      unit = pkg.unit;
      rateUnit = pkg.unit;
      purchasePrice = pkg.costPerUnit;
      unitCost = pkg.costPerUnit;
    }
    details.push({
      itemModel,
      itemId: itemId.toString(),
      name,
      quantity: quantityNeeded,
      unit,
      rateUnit,
      purchasePrice,
      unitCost,
      totalCost: unitCost * quantityNeeded,
      isSubIngredient: !!parentName,
      parentSfgName: parentName
    });
  }

  return details;
};

export const getDishCosting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId } = req.params;
    const userId = req.user?.userId;

    const dish = await Dish.findOne({ _id: dishId, userId }).populate('packagingLogic.dineIn packagingLogic.takeaway packagingLogic.delivery');
    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
      return;
    }

    const recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dishId, userId });
    
    let totalFoodCost = 0;
    let ingredientsCostDetails: any[] = [];

    if (recipe) {
      const dishYield = recipe.operationalYield || recipe.targetYield || 1;
      for (const ingredient of recipe.ingredients) {
        const scaledQty = ingredient.quantity / dishYield;
        const resolved = await getRecipeDetailsRecursive(ingredient.itemModel, ingredient.itemId, scaledQty, userId);
        ingredientsCostDetails = ingredientsCostDetails.concat(resolved);
        
        const topLevelCost = resolved.length > 0 ? resolved[0].totalCost : 0;
        totalFoodCost += topLevelCost;
      }
    }

    // Costing master rules: Minimum Selling Price is 2.5x food cost, Max is 5x.
    const minSellingPrice = totalFoodCost * 2.5;
    const maxSellingPrice = totalFoodCost * 5;

    res.status(200).json({
      dishId: dish._id,
      dishName: dish.name,
      totalFoodCost,
      ingredientsCostDetails,
      suggestedPricing: {
        minimumSellingPrice: minSellingPrice,
        maximumSellingPrice: maxSellingPrice
      },
      currentPrice: dish.price,
      packagingLogic: dish.packagingLogic
    });
  } catch (error) {
    console.error('Costing Engine Error:', error);
    res.status(500).json({ error: 'Failed to calculate dish costing' });
  }
};

export const updateIngredientPrice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemModel, itemId, price } = req.body;
    const userId = req.user?.userId;

    if (!itemModel || !itemId || price === undefined || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    let updatedItem = null;
    if (itemModel === 'RawMaterial') {
      updatedItem = await RawMaterial.findOneAndUpdate(
        { _id: itemId, userId },
        { costPerPurchaseUnit: price },
        { new: true }
      );
    } else if (itemModel === 'SemiFinishedGood') {
      updatedItem = await SemiFinishedGood.findOneAndUpdate(
        { _id: itemId, userId },
        { costPerUnit: price },
        { new: true }
      );
    } else if (itemModel === 'Packaging') {
      updatedItem = await Packaging.findOneAndUpdate(
        { _id: itemId, userId },
        { costPerUnit: price },
        { new: true }
      );
    } else {
      res.status(400).json({ error: 'Invalid item model type' });
      return;
    }

    if (!updatedItem) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    res.status(200).json({ message: 'Price updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Update Price Error:', error);
    res.status(500).json({ error: 'Failed to update ingredient price' });
  }
};

export const updateDishRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId } = req.params;
    const { ingredients } = req.body;
    const userId = req.user?.userId;

    if (!dishId || !ingredients || !Array.isArray(ingredients) || !userId) {
      res.status(400).json({ error: 'Missing required fields or invalid format' });
      return;
    }

    // Verify dish exists
    const dish = await Dish.findOne({ _id: dishId, userId });
    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
      return;
    }

    let recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dishId, userId });
    
    if (recipe) {
      recipe.ingredients = ingredients;
      await recipe.save();
    } else {
      recipe = new Recipe({
        targetModel: 'Dish',
        targetId: dishId,
        targetYield: 1,
        operationalYield: 1,
        ingredients,
        userId
      });
      await recipe.save();
    }

    res.status(200).json({ message: 'Recipe updated successfully', recipe });
  } catch (error) {
    console.error('Update Recipe Error:', error);
    res.status(500).json({ error: 'Failed to update dish recipe' });
  }
};
