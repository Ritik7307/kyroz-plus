import { Request, Response } from 'express';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Dish from '../models/Dish';
import Packaging from '../models/Packaging';
import User from '../models/User';

export const injectFastFood = async (req: Request, res: Response): Promise<void> => {
  try {
    let userId = req.body.userId || (req as any).user?.userId;
    if (!userId) {
      const user = await User.findOne({ email: 'vijayshankarprajapati29@gmail.com' });
      if (!user) {
        res.status(400).json({ error: 'userId required' });
        return;
      }
      userId = user._id;
    }

    const rms = [
      { code: 'RM_C501_DOUGH_MASTER', name: 'C-501 DOUGH MASTER', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 120, conversionFactor: 1000 },
      { code: 'RM_LUKEWARM_WATER', name: 'Lukewarm Water', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 0, conversionFactor: 1000 },
      { code: 'RM_DUSTING_FLOUR', name: 'Dusting Flour', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 40, conversionFactor: 1000 },
      { code: 'RM_C502_GRILL_DUST', name: 'C-502 GRILL DUST', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 250, conversionFactor: 1000 },
      { code: 'RM_BOILED_POTATO', name: 'Boiled Potato', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 30, conversionFactor: 1000 },
      { code: 'RM_CHICKEN_MINCE', name: 'Chicken Mince', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 300, conversionFactor: 1000 },
      { code: 'RM_BREADCRUMBS', name: 'Breadcrumbs', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_C503_VELVET_GLAZE', name: 'C-503 VELVET GLAZE', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 180, conversionFactor: 1000 },
      { code: 'RM_VEG_EXTRA_THICK_MAYO', name: 'Veg Extra Thick Mayonnaise', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 150, conversionFactor: 1000 },
      { code: 'RM_TOMATO_KETCHUP', name: 'Tomato Ketchup', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_LIQUID_CHEESE', name: 'Liquid Cheese', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 300, conversionFactor: 1000 },
      { code: 'RM_RED_CHILLI_POWDER', name: 'Red Chilli Powder', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 },
      { code: 'RM_C504_HERB_INFUSION', name: 'C-504 HERB INFUSION', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 220, conversionFactor: 1000 },
      { code: 'RM_SOFT_BUTTER', name: 'Soft Butter', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 450, conversionFactor: 1000 },
      { code: 'RM_VEG_MAYO', name: 'Veg Mayonnaise', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 120, conversionFactor: 1000 },
      { code: 'RM_C509_FIRE_DUST', name: 'C-509 FIRE DUST', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 300, conversionFactor: 1000 },
      { code: 'RM_FRENCH_FRIES', name: 'French Fries', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 120, conversionFactor: 1000 },
      { code: 'RM_CHICKEN_NUGGETS', name: 'Chicken Nuggets', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 250, conversionFactor: 1000 },
      { code: 'RM_CHICKEN_RAW', name: 'Chicken (Raw)', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 250, conversionFactor: 1000 },
      { code: 'RM_C510_ZING_MASTER', name: 'C-510 ZING MASTER', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 280, conversionFactor: 1000 },
      { code: 'RM_REFINED_FLOUR_MAIDA', name: 'Refined Flour (Maida)', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 40, conversionFactor: 1000 },
      { code: 'RM_ICE_COLD_WATER', name: 'Ice Cold Water', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 0, conversionFactor: 1000 },
      { code: 'RM_REFINED_FRYING_OIL', name: 'Refined Frying Oil', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_BURGER_BUN', name: 'Burger Bun', consumptionUnit: 'pcs', purchaseUnit: 'pcs', costPerPurchaseUnit: 10, conversionFactor: 1 },
      { code: 'RM_LETTUCE_CABBAGE', name: 'Lettuce/Cabbage', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_TOMATO', name: 'Tomato', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 40, conversionFactor: 1000 },
      { code: 'RM_ONION', name: 'Onion', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 30, conversionFactor: 1000 },
      { code: 'RM_CHEESE_SLICE', name: 'Cheese Slice', consumptionUnit: 'pcs', purchaseUnit: 'pcs', costPerPurchaseUnit: 15, conversionFactor: 1 }
    ];

    for (const rm of rms) {
      await RawMaterial.findOneAndUpdate({ code: rm.code, userId }, { ...rm, userId }, { upsert: true });
    }

    const sfgs = [
      { code: 'SFG_PREPARED_PIZZA_DOUGH', name: 'Prepared Pizza Dough', batchYield: 1700, yieldUnit: 'gm' },
      { code: 'SFG_200GM_PIZZA_DOUGH_BALL', name: '200 gm Pizza Dough Ball', batchYield: 200, yieldUnit: 'gm' },
      { code: 'SFG_300GM_PIZZA_DOUGH_BALL', name: '300 gm Pizza Dough Ball', batchYield: 300, yieldUnit: 'gm' },
      { code: 'SFG_PREPARED_VEG_PATTY', name: 'Prepared Veg Patty', batchYield: 1000, yieldUnit: 'gm' },
      { code: 'SFG_PREPARED_CHICKEN_PATTY', name: 'Prepared Chicken Patty', batchYield: 1000, yieldUnit: 'gm' },
      { code: 'SFG_PREPARED_PANEER_PATTY', name: 'Prepared Paneer Patty', batchYield: 1000, yieldUnit: 'gm' },
      { code: 'SFG_CLASSIC_BURGER_SAUCE', name: 'Classic Burger Sauce', batchYield: 330, yieldUnit: 'gm' },
      { code: 'SFG_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce', batchYield: 360, yieldUnit: 'gm' },
      { code: 'SFG_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip', batchYield: 330, yieldUnit: 'gm' },
      { code: 'SFG_HERB_GARLIC_BUTTER', name: 'Herb Garlic Butter', batchYield: 240, yieldUnit: 'gm' },
      { code: 'SFG_HERB_GARLIC_MAYO', name: 'Herb Garlic Mayo', batchYield: 330, yieldUnit: 'gm' },
      { code: 'SFG_24_HOUR_MARINATED_CHICKEN', name: '24-Hour Marinated Chicken', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_DOUBLE_COATED_CHICKEN', name: 'Double Coated Chicken', batchYield: 5000, yieldUnit: 'gm' }
    ];

    for (const sfg of sfgs) {
      await SemiFinishedGood.findOneAndUpdate({ code: sfg.code, userId }, { ...sfg, userId }, { upsert: true });
    }

    const pkgs = [
      { code: 'PKG_FOOD_GRADE_DOUGH_TRAY', name: 'Food Grade Dough Tray', unit: 'pc', costPerUnit: 15 },
      { code: 'PKG_PLASTIC_WRAP', name: 'Plastic Wrap', unit: 'pc', costPerUnit: 2 },
      { code: 'PKG_BATCH_LABEL', name: 'Batch Label', unit: 'pc', costPerUnit: 1 },
      { code: 'PKG_1L_SAUCE_BOTTLE', name: '1 L Sauce Bottle', unit: 'pc', costPerUnit: 10 },
      { code: 'PKG_DIP_CUP', name: 'Dip Cup', unit: 'pc', costPerUnit: 2 },
      { code: 'PKG_FOOD_GRADE_CONTAINER', name: 'Food Grade Container', unit: 'pc', costPerUnit: 10 },
      { code: 'PKG_SEASONING_SHAKER', name: 'Seasoning Shaker', unit: 'pc', costPerUnit: 15 },
      { code: 'PKG_SEASONING_SACHET', name: 'Seasoning Sachet', unit: 'pc', costPerUnit: 2 },
      { code: 'PKG_CHICKEN_BOX_BUCKET', name: 'Chicken Box/Bucket', unit: 'pc', costPerUnit: 20 },
      { code: 'PKG_FOOD_PAPER', name: 'Food Paper', unit: 'pc', costPerUnit: 2 },
      { code: 'PKG_BURGER_WRAP_BOX', name: 'Burger Wrap/Box', unit: 'pc', costPerUnit: 10 },
      { code: 'PKG_CARRY_BAG', name: 'Carry Bag', unit: 'pc', costPerUnit: 5 }
    ];

    for (const pkg of pkgs) {
      await Packaging.findOneAndUpdate({ code: pkg.code, userId }, { ...pkg, userId }, { upsert: true });
    }

    const resolveIng = async (name: string) => {
      let r = await RawMaterial.findOne({ name, userId });
      if (r) return { id: r._id, model: 'RawMaterial' };
      let s = await SemiFinishedGood.findOne({ name, userId });
      if (s) return { id: s._id, model: 'SemiFinishedGood' };
      let p = await PortionMaster.findOne({ name, userId });
      if (p) return { id: p._id, model: 'PortionMaster' };
      let pkg = await Packaging.findOne({ name, userId });
      if (pkg) return { id: pkg._id, model: 'Packaging' };
      return null;
    };

    const sfgRecipesData = [
      {
        name: 'Prepared Pizza Dough',
        ingredients: [
          { name: 'C-501 DOUGH MASTER', quantity: 1000 },
          { name: 'Lukewarm Water', quantity: 650 },
          { name: 'Refined Frying Oil', quantity: 50 }
        ],
        targetYield: 1700,
        operationalYield: 1700
      },
      {
        name: '200 gm Pizza Dough Ball',
        ingredients: [
          { name: 'Prepared Pizza Dough', quantity: 200 }
        ],
        targetYield: 200,
        operationalYield: 200
      },
      {
        name: '300 gm Pizza Dough Ball',
        ingredients: [
          { name: 'Prepared Pizza Dough', quantity: 300 }
        ],
        targetYield: 300,
        operationalYield: 300
      },
      {
        name: 'Prepared Veg Patty',
        ingredients: [
          { name: 'Boiled Potato', quantity: 1000 },
          { name: 'C-502 GRILL DUST', quantity: 100 },
          { name: 'Breadcrumbs', quantity: 100 }
        ],
        targetYield: 1000,
        operationalYield: 1000
      },
      {
        name: 'Prepared Chicken Patty',
        ingredients: [
          { name: 'Chicken Mince', quantity: 1000 },
          { name: 'C-502 GRILL DUST', quantity: 100 },
          { name: 'Breadcrumbs', quantity: 100 }
        ],
        targetYield: 1000,
        operationalYield: 1000
      },
      {
        name: 'Prepared Paneer Patty',
        ingredients: [
          { name: 'Paneer Cubes', quantity: 1000 }, // Assume Paneer Cubes exist from previous
          { name: 'C-502 GRILL DUST', quantity: 100 },
          { name: 'Breadcrumbs', quantity: 100 }
        ],
        targetYield: 1000,
        operationalYield: 1000
      },
      {
        name: 'Classic Burger Sauce',
        ingredients: [
          { name: 'Veg Extra Thick Mayonnaise', quantity: 300 },
          { name: 'C-503 VELVET GLAZE', quantity: 30 }
        ],
        targetYield: 330,
        operationalYield: 330
      },
      {
        name: 'Tandoori Burger Sauce',
        ingredients: [
          { name: 'Veg Extra Thick Mayonnaise', quantity: 300 },
          { name: 'C-503 VELVET GLAZE', quantity: 30 },
          { name: 'Red Chilli Powder', quantity: 30 }
        ],
        targetYield: 360,
        operationalYield: 360
      },
      {
        name: 'Cheesy Garlic Dip',
        ingredients: [
          { name: 'Veg Extra Thick Mayonnaise', quantity: 300 },
          { name: 'C-503 VELVET GLAZE', quantity: 30 } // Simplified
        ],
        targetYield: 330,
        operationalYield: 330
      },
      {
        name: 'Herb Garlic Butter',
        ingredients: [
          { name: 'Soft Butter', quantity: 200 },
          { name: 'C-504 HERB INFUSION', quantity: 40 }
        ],
        targetYield: 240,
        operationalYield: 240
      },
      {
        name: 'Herb Garlic Mayo',
        ingredients: [
          { name: 'Veg Mayonnaise', quantity: 300 },
          { name: 'C-504 HERB INFUSION', quantity: 30 }
        ],
        targetYield: 330,
        operationalYield: 330
      },
      {
        name: '24-Hour Marinated Chicken',
        ingredients: [
          { name: 'Chicken (Raw)', quantity: 4000 },
          { name: 'C-510 ZING MASTER', quantity: 1000 }
        ],
        targetYield: 5000,
        operationalYield: 5000
      },
      {
        name: 'Double Coated Chicken',
        ingredients: [
          { name: '24-Hour Marinated Chicken', quantity: 4000 },
          { name: 'Refined Flour (Maida)', quantity: 1000 },
          { name: 'Ice Cold Water', quantity: 500 } // Approx
        ],
        targetYield: 5000,
        operationalYield: 5000
      }
    ];

    for (const rd of sfgRecipesData) {
      const target = await SemiFinishedGood.findOne({ name: rd.name, userId });
      if (!target) continue;

      const ings = [];
      for (const i of rd.ingredients) {
        const resolved = await resolveIng(i.name);
        if (resolved) {
          ings.push({ itemModel: resolved.model, itemId: resolved.id, quantity: i.quantity });
        }
      }

      await Recipe.findOneAndUpdate(
        { targetModel: 'SemiFinishedGood', targetId: target._id, userId },
        { targetYield: rd.targetYield, operationalYield: rd.operationalYield, ingredients: ings },
        { upsert: true }
      );
    }

    const portionsData = [
      { code: 'PT_10_INCH_PIZZA', name: '10 Inch Pizza Portion', sfgName: '200 gm Pizza Dough Ball', quantity: 1, unit: 'pc' },
      { code: 'PT_12_INCH_PIZZA', name: '12 Inch Pizza Portion', sfgName: '300 gm Pizza Dough Ball', quantity: 1, unit: 'pc' },
      { code: 'PT_VEG_BURGER', name: 'Veg Burger Portion', sfgName: 'Prepared Veg Patty', quantity: 80, unit: 'gm' },
      { code: 'PT_CHICKEN_BURGER', name: 'Chicken Burger Portion', sfgName: 'Prepared Chicken Patty', quantity: 80, unit: 'gm' },
      { code: 'PT_POPCORN', name: 'Popcorn Chicken Portion', sfgName: 'Double Coated Chicken', quantity: 250, unit: 'gm' },
      { code: 'PT_STRIPS', name: 'Chicken Strips Portion', sfgName: 'Double Coated Chicken', quantity: 250, unit: 'gm' },
      { code: 'PT_WINGS', name: 'Chicken Wings Portion', sfgName: 'Double Coated Chicken', quantity: 277, unit: 'gm' },
      { code: 'PT_LEG_PIECE', name: 'Chicken Leg Piece Portion', sfgName: 'Double Coated Chicken', quantity: 345, unit: 'gm' }
    ];

    for (const pt of portionsData) {
      const sfg = await SemiFinishedGood.findOne({ name: pt.sfgName, userId });
      if (sfg) {
        let ptDoc = await PortionMaster.findOne({ code: pt.code, userId });
        if (!ptDoc) {
          ptDoc = new PortionMaster({ code: pt.code, name: pt.name, userId, ingredients: [] });
        }
        ptDoc.ingredients = [{ sfgId: sfg._id as any, quantity: pt.quantity, unit: pt.unit }];
        await ptDoc.save();
      }
    }

    const dishesToCreate = [
      { name: '10 Inch Pizza', category: 'Pizza', price: 299 },
      { name: '12 Inch Pizza', category: 'Pizza', price: 399 },
      { name: 'Veg Burger', category: 'Burger', price: 149 },
      { name: 'Chicken Burger', category: 'Burger', price: 199 },
      { name: 'Popcorn Chicken', category: 'Snacks', price: 199 },
      { name: 'Chicken Strips', category: 'Snacks', price: 249 },
      { name: 'Chicken Wings', category: 'Snacks', price: 299 },
      { name: 'Chicken Leg Piece', category: 'Snacks', price: 159 }
    ];

    for (const d of dishesToCreate) {
      let dish = await Dish.findOne({ name: d.name, userId });
      if (!dish) {
        dish = new Dish({ name: d.name, category: d.category, price: d.price, userId, packagingLogic: { dineIn: [], takeaway: [], delivery: [] } });
        await dish.save();
      }
      
      const dishRecipeIngs = [];
      let ptName = d.name + ' Portion';
      const pt = await resolveIng(ptName);
      if (pt) dishRecipeIngs.push({ itemModel: pt.model, itemId: pt.id, quantity: 1 });

      if (d.name.includes('Burger')) {
        const bun = await resolveIng('Burger Bun');
        if (bun) dishRecipeIngs.push({ itemModel: bun.model, itemId: bun.id, quantity: 1 });
        const sauce = await resolveIng(d.name === 'Veg Burger' ? 'Classic Burger Sauce' : 'Tandoori Burger Sauce');
        if (sauce) dishRecipeIngs.push({ itemModel: sauce.model, itemId: sauce.id, quantity: 30 });
        const lettuce = await resolveIng('Lettuce/Cabbage');
        if (lettuce) dishRecipeIngs.push({ itemModel: lettuce.model, itemId: lettuce.id, quantity: 10 });
        const tomato = await resolveIng('Tomato');
        if (tomato) dishRecipeIngs.push({ itemModel: tomato.model, itemId: tomato.id, quantity: 20 });
        const onion = await resolveIng('Onion');
        if (onion) dishRecipeIngs.push({ itemModel: onion.model, itemId: onion.id, quantity: 15 });
        const butter = await resolveIng('Soft Butter');
        if (butter) dishRecipeIngs.push({ itemModel: butter.model, itemId: butter.id, quantity: 5 });
        const fireDust = await resolveIng('C-509 FIRE DUST');
        if (fireDust) dishRecipeIngs.push({ itemModel: fireDust.model, itemId: fireDust.id, quantity: 1 });
      }

      if (d.category === 'Snacks') {
        const fireDust = await resolveIng('C-509 FIRE DUST');
        if (fireDust) dishRecipeIngs.push({ itemModel: fireDust.model, itemId: fireDust.id, quantity: 1 });
        const oil = await resolveIng('Refined Frying Oil');
        if (oil) dishRecipeIngs.push({ itemModel: oil.model, itemId: oil.id, quantity: 15 });
      }

      await Recipe.findOneAndUpdate(
        { targetModel: 'Dish', targetId: dish._id, userId },
        { targetYield: 1, operationalYield: 1, ingredients: dishRecipeIngs },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'Fast food items injected successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
