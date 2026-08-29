import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Dish from '../models/Dish';
import Recipe from '../models/Recipe';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Packaging from '../models/Packaging';
import PortionMaster from '../models/PortionMaster';
import PreparationMaster from '../models/PreparationMaster';

const getCachedDoc = async (model: any, id: string, userId: string, cache: Map<string, any>) => {
  const key = `${model.modelName}_${id}`;
  if (cache.has(key)) return cache.get(key);
  const doc = await model.findOne({ _id: id, userId }).lean();
  cache.set(key, doc);
  return doc;
};

export const getRecipeDetailsRecursive = async (
  cache: Map<string, any>,
  itemModel: string,
  itemId: any,
  quantityNeeded: number,
  userId: any,
  parentName?: string,
  parentId?: string,
  parentModel?: string,
  rawRecipeQuantity: number = quantityNeeded,
  recipeYield: number = 1,
  parentYieldRatio: number = 1,
  visited: Set<string> = new Set()
): Promise<any[]> => {
  if (!itemId || itemId === 'undefined' || itemId === 'null') {
    console.warn(`[WARNING] Invalid itemId (${itemId}) encountered for model ${itemModel} in recipe`);
    return [];
  }
  const visitKey = `${itemModel}_${itemId}`;
  if (visited.has(visitKey)) {
    console.warn(`[WARNING] Circular dependency detected for ${visitKey}`);
    return [];
  }
  const newVisited = new Set(visited);
  newVisited.add(visitKey);
  let details: any[] = [];

  let name = 'Unknown Ingredient';
  let unit = '';
  let rateUnit = '';
  let purchasePrice = 0;
  let unitCost = 0;

  if (itemModel === 'RawMaterial') {
    const rm = await getCachedDoc(RawMaterial, itemId, userId, cache);
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
      conversionFactor: itemModel === 'RawMaterial' && rm ? (rm.conversionFactor || 1) : 1,
      totalCost: unitCost * quantityNeeded,
      isSubIngredient: !!parentName,
      parentSfgName: parentName,
      parentId,
      parentModel,
      rawRecipeQuantity,
      recipeYield,
      parentYieldRatio
    });
  } else if (itemModel === 'SemiFinishedGood') {
    const sfg = await getCachedDoc(SemiFinishedGood, itemId, userId, cache);
    if (sfg) {
      name = sfg.name;
      unit = sfg.yieldUnit;
      rateUnit = sfg.yieldUnit;
      purchasePrice = sfg.costPerUnit;

      // We need a helper for recipe
      const recipeKey = `Recipe_target_${itemId}`;
      let sfgRecipeDoc = cache.get(recipeKey);
      if (sfgRecipeDoc === undefined) {
        sfgRecipeDoc = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: itemId, userId }).lean();
        cache.set(recipeKey, sfgRecipeDoc || null);
      }

      if (sfgRecipeDoc) {
        let subDetails: any[] = [];
        let batchCost = 0;
        const yieldQty = sfgRecipeDoc.operationalYield || sfg.batchYield || 1;
        const currentParentYieldRatio = quantityNeeded / yieldQty;
        
        const promises = sfgRecipeDoc.ingredients.map(async (ing: any) => {
          const scaledSubQty = ing.quantity * currentParentYieldRatio;
          const resolved = await getRecipeDetailsRecursive(cache, ing.itemModel, ing.itemId, scaledSubQty, userId, name, itemId.toString(), 'SemiFinishedGood', ing.quantity, yieldQty, currentParentYieldRatio, newVisited);
          return { resolved, ing };
        });
        const results = await Promise.all(promises);
        for (const res of results) {
          subDetails = subDetails.concat(res.resolved);
          const subUnitCost = res.resolved.length > 0 ? res.resolved[0].unitCost : 0;
          batchCost += subUnitCost * res.ing.quantity;
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
          conversionFactor: 1,
          totalCost: unitCost * quantityNeeded,
          isSubIngredient: !!parentName,
          parentSfgName: parentName,
          parentId,
          parentModel,
          rawRecipeQuantity,
          recipeYield,
          parentYieldRatio
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
          conversionFactor: 1,
          totalCost: unitCost * quantityNeeded,
          isSubIngredient: !!parentName,
          parentSfgName: parentName,
          parentId,
          parentModel,
          rawRecipeQuantity,
          recipeYield,
          parentYieldRatio
        });
      }
    }
  } else if (itemModel === 'PreparationMaster') {
    const prep = await getCachedDoc(PreparationMaster, itemId, userId, cache);
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
        conversionFactor: 1,
        totalCost: unitCost * quantityNeeded,
        isSubIngredient: !!parentName,
        parentSfgName: parentName,
        parentId,
        parentModel,
        rawRecipeQuantity,
        recipeYield,
        parentYieldRatio
      });
    }
  } else if (itemModel === 'PortionMaster') {
    const portion = await getCachedDoc(PortionMaster, itemId, userId, cache);
    if (portion) {
      name = portion.name;
      unit = portion.ingredients.length > 0 ? portion.ingredients[0].unit : 'unit';
      rateUnit = 'portion';
      
      let subDetails: any[] = [];
      let portionCost = 0;
      
      const promises = portion.ingredients.map(async (ing: any) => {
        const scaledSubQty = ing.quantity * quantityNeeded;
        
        const sfgIdStr = ing.sfgId.toString();
        let childModel = cache.get(`model_of_${sfgIdStr}`);
        if (!childModel) {
            const [prep, sfg, rm] = await Promise.all([
              PreparationMaster.exists({ _id: ing.sfgId, userId }),
              SemiFinishedGood.exists({ _id: ing.sfgId, userId }),
              RawMaterial.exists({ _id: ing.sfgId, userId })
            ]);
            if (prep) childModel = 'PreparationMaster';
            else if (sfg) childModel = 'SemiFinishedGood';
            else childModel = 'RawMaterial';
            cache.set(`model_of_${sfgIdStr}`, childModel);
        }

        const resolved = await getRecipeDetailsRecursive(cache, childModel, ing.sfgId, scaledSubQty, userId, name, itemId.toString(), 'PortionMaster', ing.quantity, 1, quantityNeeded, newVisited);
        return { resolved, ing };
      });
      
      const results = await Promise.all(promises);
      for (const res of results) {
        subDetails = subDetails.concat(res.resolved);
        const subUnitCost = res.resolved.length > 0 ? res.resolved[0].unitCost : 0;
        portionCost += subUnitCost * res.ing.quantity;
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
        conversionFactor: 1,
        totalCost: unitCost * quantityNeeded,
        isSubIngredient: !!parentName,
        parentSfgName: parentName,
        parentId,
        parentModel,
        rawRecipeQuantity,
        recipeYield,
        parentYieldRatio
      });
      
      details = details.concat(subDetails);
    }
  } else if (itemModel === 'Packaging') {
    const pkg = await getCachedDoc(Packaging, itemId, userId, cache);
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
      conversionFactor: 1,
      totalCost: unitCost * quantityNeeded,
      isSubIngredient: !!parentName,
      parentSfgName: parentName,
      parentId,
      parentModel,
      rawRecipeQuantity,
      recipeYield,
      parentYieldRatio
    });
  }

  return details;
};

export const getDishCosting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId } = req.params;
    const userId = req.user?.userId;
    console.log(`[DEBUG] getDishCosting called by userId: ${userId} for dishId: ${dishId}`);

    const cache = new Map<string, any>();

    const dish: any = await Dish.findOne({ _id: dishId, userId }).populate('packagingLogic.dineIn packagingLogic.takeaway packagingLogic.delivery').lean();
    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
      return;
    }

    const recipe: any = await Recipe.findOne({ targetModel: 'Dish', targetId: dishId, userId }).lean();
    
    let totalFoodCost = 0;
    let ingredientsCostDetails: any[] = [];

    if (recipe) {
      const dishYield = recipe.operationalYield || recipe.targetYield || 1;
      const currentParentYieldRatio = 1 / dishYield;
      const promises = recipe.ingredients.map(async (ingredient: any) => {
        const scaledQty = ingredient.quantity * currentParentYieldRatio;
        const resolved = await getRecipeDetailsRecursive(cache, ingredient.itemModel, ingredient.itemId, scaledQty, userId, dish.name, dishId, 'Dish', ingredient.quantity, dishYield, currentParentYieldRatio, new Set([`Dish_${dishId}`]));
        return { resolved };
      });
      const results = await Promise.all(promises);
      for (const res of results) {
        ingredientsCostDetails = ingredientsCostDetails.concat(res.resolved);
        const topLevelCost = res.resolved.length > 0 ? res.resolved[0].totalCost : 0;
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

export const deleteDishRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId } = req.params;
    const userId = req.user?.userId;

    if (!dishId || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const result = await Recipe.findOneAndDelete({ targetModel: 'Dish', targetId: dishId, userId });
    if (!result) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete Recipe Error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
