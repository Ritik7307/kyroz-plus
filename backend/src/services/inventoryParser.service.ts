import mongoose from 'mongoose';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Premix from '../models/Premix';
import Packaging from '../models/Packaging';
import Dish from '../models/Dish';
import Recipe, { IRecipeIngredient } from '../models/Recipe';
import SopPacketStock from '../models/SopPacketStock';

export const parseInventoryDocument = async (text: string, userId: string): Promise<any> => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentSection = '';
  let currentItem: any = null;
  let currentRecipe: any = null;
  
  const stats = { rm: 0, sfg: 0, premix: 0, pkg: 0, dishes: 0, recipes: 0 };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('RAW MATERIAL MASTER')) { currentSection = 'RM'; continue; }
    if (line.includes('PREMIX MASTER')) { currentSection = 'PREMIX'; continue; }
    if (line.includes('SEMI FINISHED GOODS MASTER')) { currentSection = 'SFG'; continue; }
    if (line.includes('SEMI FINISHED GOODS RECIPE')) { currentSection = 'SFG_RECIPE'; continue; }
    if (line.includes('FINAL DISH MASTER')) { currentSection = 'DISH'; continue; }
    if (line.includes('FINAL DISH RECIPE')) { currentSection = 'DISH_RECIPE'; continue; }
    if (line.match(/^[=]+$/) || line.match(/^[-]+$/)) continue; // Separators

    // 1. Raw Materials
    if (currentSection === 'RM') {
      if (line.match(/^RM\d+/)) {
        if (currentItem) await saveRM(currentItem, userId);
        currentItem = { code: line, name: lines[++i] };
        stats.rm++;
      } else if (line.startsWith('Purchase Unit:')) currentItem.purchaseUnit = line.split(':')[1].trim();
      else if (line.startsWith('Consumption Unit:')) currentItem.consumptionUnit = line.split(':')[1].trim();
      else if (line.startsWith('Category:')) currentItem.category = line.split(':')[1].trim();
    }
    
    // 2. Premix
    else if (currentSection === 'PREMIX') {
      if (line.match(/^PM\d+/)) {
        if (currentItem && currentItem.type === 'premix') await savePremix(currentItem, userId);
        currentItem = { type: 'premix', code: line, name: lines[++i] };
        stats.premix++;
      } else if (line.startsWith('Consumption Type:')) currentItem.consumptionType = line.split(':')[1].trim();
    }

    // 3. SFG Master
    else if (currentSection === 'SFG') {
      if (line.match(/^SFG\d+/)) {
        if (currentItem && currentItem.type === 'sfg') await saveSFG(currentItem, userId);
        currentItem = { type: 'sfg', code: line, name: lines[++i] };
        stats.sfg++;
      } else if (line.startsWith('Yield:')) currentItem.batchYield = parseFloat(line.split(':')[1].trim());
    }

    // 4. SFG Recipe
    else if (currentSection === 'SFG_RECIPE') {
      if (line.match(/^SFG\d+\s+—/)) {
        if (currentRecipe) await saveRecipe(currentRecipe, userId);
        const code = line.split('—')[0].trim();
        const sfg = await SemiFinishedGood.findOne({ code, userId });
        if (sfg) {
          currentRecipe = { targetModel: 'SemiFinishedGood', targetId: sfg._id, ingredients: [] };
          stats.recipes++;
        }
      } else if (line.includes('→')) {
        if (currentRecipe) {
          const [ingName, qtyStr] = line.split('→').map(s => s.trim());
          const ingredient = await resolveIngredient(ingName, userId);
          if (ingredient) {
            currentRecipe.ingredients.push({
              itemModel: ingredient.model,
              itemId: ingredient.id,
              quantity: parseFloat(qtyStr)
            });
          }
        }
      } else if (line.startsWith('Target Yield:') || line.startsWith('Yield:')) {
        if (currentRecipe) {
          currentRecipe.targetYield = parseFloat(lines[++i].trim());
          currentRecipe.operationalYield = currentRecipe.targetYield;
        }
      }
    }
    
    // 5. Final Dish
    else if (currentSection === 'DISH') {
      if (line.match(/^D\d+/)) {
        if (currentItem && currentItem.type === 'dish') await saveDish(currentItem, userId);
        currentItem = { type: 'dish', code: line, name: lines[++i] };
        stats.dishes++;
      }
    }
    
    // 6. Dish Recipe
    else if (currentSection === 'DISH_RECIPE') {
      if (line === 'Batch Recipe:') {
        if (currentRecipe) await saveRecipe(currentRecipe, userId);
        // Find latest dish
        const dish = await Dish.findOne({ userId }).sort({ createdAt: -1 });
        if (dish) {
          currentRecipe = { targetModel: 'Dish', targetId: dish._id, ingredients: [] };
          stats.recipes++;
        }
      } else if (line.includes('→')) {
        if (currentRecipe) {
          const [ingName, qtyStr] = line.split('→').map(s => s.trim());
          const ingredient = await resolveIngredient(ingName, userId);
          if (ingredient) {
            currentRecipe.ingredients.push({
              itemModel: ingredient.model,
              itemId: ingredient.id,
              quantity: parseFloat(qtyStr)
            });
          }
        }
      }
    }
  }

  // Save trailing items
  if (currentSection === 'RM' && currentItem) await saveRM(currentItem, userId);
  if (currentSection === 'PREMIX' && currentItem && currentItem.type === 'premix') await savePremix(currentItem, userId);
  if (currentSection === 'SFG' && currentItem && currentItem.type === 'sfg') await saveSFG(currentItem, userId);
  if (currentSection === 'DISH' && currentItem && currentItem.type === 'dish') await saveDish(currentItem, userId);
  if (currentRecipe) await saveRecipe(currentRecipe, userId);

  return stats;
};

// --- Helpers ---
const saveRM = async (data: any, userId: string) => {
  if (data.category === 'Packaging') {
    await Packaging.findOneAndUpdate(
      { code: data.code, userId },
      { name: data.name, unit: data.consumptionUnit },
      { upsert: true }
    );
  } else {
    await RawMaterial.findOneAndUpdate(
      { code: data.code, userId },
      { 
        name: data.name, purchaseUnit: data.purchaseUnit, 
        consumptionUnit: data.consumptionUnit, category: data.category 
      },
      { upsert: true }
    );
  }
};

const savePremix = async (data: any, userId: string) => {
  await Premix.findOneAndUpdate(
    { code: data.code, userId },
    { name: data.name, consumptionType: data.consumptionType },
    { upsert: true }
  );
};

const saveSFG = async (data: any, userId: string) => {
  await SemiFinishedGood.findOneAndUpdate(
    { code: data.code, userId },
    { name: data.name, batchYield: data.batchYield, yieldUnit: 'gm' },
    { upsert: true }
  );
};

const saveDish = async (data: any, userId: string) => {
  await Dish.findOneAndUpdate(
    { name: data.name, userId }, // Assuming name match
    { name: data.name, category: 'Main Course', price: 0 },
    { upsert: true }
  );
};

const saveRecipe = async (data: any, userId: string) => {
  await Recipe.findOneAndUpdate(
    { targetModel: data.targetModel, targetId: data.targetId, userId },
    { targetYield: data.targetYield || 1, operationalYield: data.operationalYield || 1, ingredients: data.ingredients },
    { upsert: true }
  );
};

const resolveIngredient = async (name: string, userId: string): Promise<{ model: string, id: any } | null> => {
  // Try RM
  const rm = await RawMaterial.findOne({ name: { $regex: new RegExp(name.split(' ')[0], 'i') }, userId });
  if (rm) return { model: 'RawMaterial', id: rm._id };
  
  // Try SFG
  const sfg = await SemiFinishedGood.findOne({ name: { $regex: new RegExp(name.split(' ')[0], 'i') }, userId });
  if (sfg) return { model: 'SemiFinishedGood', id: sfg._id };

  // Try Premix
  const pm = await Premix.findOne({ name: { $regex: new RegExp(name.split(' ')[0], 'i') }, userId });
  if (pm) return { model: 'Premix', id: pm._id };

  // Try Packaging
  const pkg = await Packaging.findOne({ name: { $regex: new RegExp(name.split(' ')[0], 'i') }, userId });
  if (pkg) return { model: 'Packaging', id: pkg._id };

  return null;
};
