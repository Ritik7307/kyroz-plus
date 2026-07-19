import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Dish from '../models/Dish';
import Recipe from '../models/Recipe';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Packaging from '../models/Packaging';
import PortionMaster from '../models/PortionMaster';
import PreparationMaster from '../models/PreparationMaster';

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
  } else if (itemModel === 'PreparationMaster') {
    const prep = await PreparationMaster.findOne({ _id: itemId, userId });
    return prep ? (prep.costPerOutputUnit || 0) : 0;
  } else if (itemModel === 'PortionMaster') {
    const portion = await PortionMaster.findOne({ _id: itemId, userId });
    if (!portion) return 0;
    let totalCost = 0;
    for (const ing of portion.ingredients) {
      const sfgCost = await resolveIngredientCost('PreparationMaster', ing.sfgId, userId);
      const sfgFallback = sfgCost > 0 ? sfgCost : await resolveIngredientCost('SemiFinishedGood', ing.sfgId, userId);
      const finalCost = sfgFallback > 0 ? sfgFallback : await resolveIngredientCost('RawMaterial', ing.sfgId, userId);
      totalCost += finalCost * ing.quantity;
    }
    return totalCost > 0 ? totalCost : (portion.costPerPortion || 0);
  } else if (itemModel === 'Packaging') {
    const pkg = await Packaging.findOne({ _id: itemId, userId });
    return pkg ? pkg.costPerUnit : 0;
  }
  return 0;
};

export const getRecipeDetailsRecursive = async (
  itemModel: string,
  itemId: any,
  quantityNeeded: number,
  userId: any,
  parentName?: string,
  parentId?: string,
  parentModel?: string
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
      parentSfgName: parentName,
      parentId,
      parentModel
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
        
        const ingredientPromises = sfgRecipe.ingredients.map(async (ing: any) => {
          const scaledSubQty = ing.quantity * (quantityNeeded / yieldQty);
          const resolved = await getRecipeDetailsRecursive(ing.itemModel, ing.itemId, scaledSubQty, userId, name, itemId.toString(), 'SemiFinishedGood');
          return { ing, resolved };
        });

        const results = await Promise.all(ingredientPromises);

        for (const { ing, resolved } of results) {
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
          parentSfgName: parentName,
          parentId,
          parentModel
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
          parentSfgName: parentName,
          parentId,
          parentModel
        });
      }
    }
  } else if (itemModel === 'PreparationMaster') {
    const prep = await PreparationMaster.findOne({ _id: itemId, userId });
    if (prep) {
      name = prep.name;
      unit = prep.outputUnit;
      rateUnit = prep.outputUnit;
      purchasePrice = prep.costPerOutputUnit;
      unitCost = prep.costPerOutputUnit;

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
        parentSfgName: parentName,
        parentId,
        parentModel
      });
    }
  } else if (itemModel === 'PortionMaster') {
    const portion = await PortionMaster.findOne({ _id: itemId, userId });
    if (portion) {
      name = portion.name;
      unit = portion.ingredients.length > 0 ? portion.ingredients[0].unit : 'unit'; // Approx unit based on first ingredient
      rateUnit = 'portion';
      
      let subDetails: any[] = [];
      let portionCost = 0;
      
      const ingredientPromises = portion.ingredients.map(async (ing: any) => {
        const scaledSubQty = ing.quantity * quantityNeeded;
        
        const [prep, sfg, rm] = await Promise.all([
          PreparationMaster.exists({ _id: ing.sfgId, userId }),
          SemiFinishedGood.exists({ _id: ing.sfgId, userId }),
          RawMaterial.exists({ _id: ing.sfgId, userId })
        ]);
        
        console.log(`PortionMaster Ing Check for ${ing.sfgId}: prep=${!!prep}, sfg=${!!sfg}, rm=${!!rm}`);
        
        let itemModel = 'RawMaterial';
        if (prep) itemModel = 'PreparationMaster';
        else if (sfg) itemModel = 'SemiFinishedGood';
        
        const resolved = await getRecipeDetailsRecursive(itemModel, ing.sfgId, scaledSubQty, userId, name, itemId.toString(), 'PortionMaster');
        return { ing, resolved };
      });
      
      const results = await Promise.all(ingredientPromises);
      
      for (const { ing, resolved } of results) {
        subDetails = subDetails.concat(resolved);
        const subUnitCost = resolved.length > 0 ? resolved[0].unitCost : 0;
        portionCost += subUnitCost * ing.quantity;
      }
      
      unitCost = portionCost;
      purchasePrice = portionCost;
      
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
        parentSfgName: parentName,
        parentId,
        parentModel
      });
      
      details = details.concat(subDetails);
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
      parentSfgName: parentName,
      parentId,
      parentModel
    });
  }

  return details;
};

export const getDishCosting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId } = req.params;
    const userId = req.user?.userId;
    console.log(`[DEBUG] getDishCosting called by userId: ${userId} for dishId: ${dishId}`);


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
      const ingredientPromises = recipe.ingredients.map(async (ingredient: any) => {
        const scaledQty = ingredient.quantity / dishYield;
        const resolved = await getRecipeDetailsRecursive(ingredient.itemModel, ingredient.itemId, scaledQty, userId, dish.name, dishId, 'Dish');
        return resolved;
      });
      
      const results = await Promise.all(ingredientPromises);
      for (const resolved of results) {
        ingredientsCostDetails = ingredientsCostDetails.concat(resolved);
        const topLevelCost = resolved.length > 0 ? resolved[0].totalCost : 0;
        totalFoodCost += topLevelCost;
      }
    }

    let maxPackagingCost = 0;
    if (dish.packagingLogic) {
      const getPkgCost = (pkgArr: any[]) => pkgArr.reduce((sum, pkg) => sum + (pkg?.costPerUnit || 0), 0);
      const dineInCost = getPkgCost(dish.packagingLogic.dineIn || []);
      const takeawayCost = getPkgCost(dish.packagingLogic.takeaway || []);
      const deliveryCost = getPkgCost(dish.packagingLogic.delivery || []);
      maxPackagingCost = Math.max(dineInCost, takeawayCost, deliveryCost);
      totalFoodCost += maxPackagingCost;
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

export const updateBulkRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bulkUpdates } = req.body;
    const userId = req.user?.userId;

    if (!bulkUpdates || !Array.isArray(bulkUpdates) || !userId) {
      res.status(400).json({ error: 'Missing required fields or invalid format' });
      return;
    }

    for (const update of bulkUpdates) {
      const { targetModel, targetId, ingredients } = update;
      
      if (targetModel === 'PortionMaster') {
        const portion = await PortionMaster.findOne({ _id: targetId, userId });
        if (portion) {
          portion.ingredients = ingredients.map((ing: any) => ({
            sfgId: ing.itemId,
            quantity: ing.quantity,
            unit: ing.unit || 'gm'
          }));
          await portion.save();
        }
      } else {
        let recipe = await Recipe.findOne({ targetModel, targetId, userId });
        if (recipe) {
          recipe.ingredients = ingredients;
          await recipe.save();
        } else {
          recipe = new Recipe({
            targetModel,
            targetId,
            targetYield: 1,
            operationalYield: 1,
            ingredients,
            userId
          });
          await recipe.save();
        }
      }
    }

    res.status(200).json({ message: 'Bulk recipes updated successfully' });
  } catch (error) {
    console.error('Update Bulk Recipe Error:', error);
    res.status(500).json({ error: 'Failed to update bulk recipes' });
  }
};
