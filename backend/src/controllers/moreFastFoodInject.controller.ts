import { Request, Response } from 'express';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Dish from '../models/Dish';
import Packaging from '../models/Packaging';
import User from '../models/User';

export const injectMoreFastFood = async (req: Request, res: Response): Promise<void> => {
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
      { code: 'RM_C506_MARINARA_CORE', name: 'C-506 MARINARA CORE', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 180, conversionFactor: 1000 },
      { code: 'RM_MOZZARELLA_CHEDDAR_BLEND', name: 'Mozzarella + Cheddar Blend', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 350, conversionFactor: 1000 },
      { code: 'RM_MIXED_PIZZA_VEG', name: 'Mixed Pizza Vegetables', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_BREAD_SLICES', name: 'Bread Slices', consumptionUnit: 'pcs', purchaseUnit: 'pcs', costPerPurchaseUnit: 2, conversionFactor: 1 },
      { code: 'RM_TORTILLA_PARATHA', name: '8/10 inch Tortilla / Lacha Paratha', consumptionUnit: 'pcs', purchaseUnit: 'pcs', costPerPurchaseUnit: 12, conversionFactor: 1 },
      { code: 'RM_C505_ALFREDO_CORE', name: 'C-505 ALFREDO CORE', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 200, conversionFactor: 1000 },
      { code: 'RM_BOILED_PASTA_RAW', name: 'Boiled Pasta (Raw Base)', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 80, conversionFactor: 1000 },
      { code: 'RM_FULL_CREAM_MILK', name: 'Full Cream Milk', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_WATER_TOMATO_STOCK', name: 'Water / Tomato Stock', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 10, conversionFactor: 1000 },
      { code: 'RM_GARLIC', name: 'Garlic', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 150, conversionFactor: 1000 },
      { code: 'RM_CAPSICUM', name: 'Capsicum', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_SWEET_CORN', name: 'Sweet Corn', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 80, conversionFactor: 1000 },
      { code: 'RM_GRATED_CHEESE_OREGANO', name: 'Grated Cheese / Oregano / Chilli Flakes', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 },
      { code: 'RM_C507_SNOW_BASE', name: 'C-507 SNOW BASE', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 180, conversionFactor: 1000 },
      { code: 'RM_C508_COCOA_BASE', name: 'C-508 COCOA BASE', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 250, conversionFactor: 1000 },
      { code: 'RM_FRUIT_SYRUPS', name: 'Fruit Syrups', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 150, conversionFactor: 1000 },
      { code: 'RM_INSTANT_COFFEE', name: 'Instant Coffee', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 600, conversionFactor: 1000 },
      { code: 'RM_OREO_KITKAT', name: 'Oreo / KitKat', consumptionUnit: 'pcs', purchaseUnit: 'pcs', costPerPurchaseUnit: 5, conversionFactor: 1 },
      { code: 'RM_HAZELNUT_SYRUP', name: 'Hazelnut Syrup', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 350, conversionFactor: 1000 },
      { code: 'RM_ICE_CUBES', name: 'Ice Cubes', consumptionUnit: 'pcs', purchaseUnit: 'kg', costPerPurchaseUnit: 10, conversionFactor: 50 },
      { code: 'RM_MUSHROOM', name: 'Mushroom', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 150, conversionFactor: 1000 }
    ];

    for (const rm of rms) {
      await RawMaterial.findOneAndUpdate({ code: rm.code, userId }, { ...rm, userId }, { upsert: true });
    }

    const sfgs = [
      { code: 'SFG_10_INCH_PIZZA_BASE', name: '10 inch Pizza Base', batchYield: 1, yieldUnit: 'pc' },
      { code: 'SFG_PREPARED_PIZZA_SAUCE', name: 'Prepared Pizza Sauce', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_80_BOILED_PASTA', name: '80% Boiled Pasta', batchYield: 5000, yieldUnit: 'gm' }
    ];

    for (const sfg of sfgs) {
      await SemiFinishedGood.findOneAndUpdate({ code: sfg.code, userId }, { ...sfg, userId }, { upsert: true });
    }

    const pkgs = [
      { code: 'PKG_PIZZA_BOX', name: 'Pizza Box', unit: 'pc', costPerUnit: 15 },
      { code: 'PKG_SANDWICH_BOX', name: 'Sandwich Box', unit: 'pc', costPerUnit: 10 },
      { code: 'PKG_BUTTER_PAPER', name: 'Butter Paper', unit: 'pc', costPerUnit: 2 },
      { code: 'PKG_WRAP_SLEEVE_BOX', name: 'Wrap Sleeve / Box', unit: 'pc', costPerUnit: 8 },
      { code: 'PKG_PASTA_BOWL', name: 'Pasta Bowl', unit: 'pc', costPerUnit: 12 },
      { code: 'PKG_PASTA_LID', name: 'Lid (Pasta)', unit: 'pc', costPerUnit: 4 },
      { code: 'PKG_500ML_BEVERAGE_CUP', name: '500 ml Beverage Cup', unit: 'pc', costPerUnit: 8 },
      { code: 'PKG_DOME_FLAT_LID', name: 'Dome/Flat Lid', unit: 'pc', costPerUnit: 3 },
      { code: 'PKG_PAPER_STRAW', name: 'Paper Straw', unit: 'pc', costPerUnit: 1 }
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
        name: '10 inch Pizza Base',
        ingredients: [
          { name: '200 gm Pizza Dough Ball', quantity: 200 }
        ],
        targetYield: 1,
        operationalYield: 1
      },
      {
        name: 'Prepared Pizza Sauce',
        ingredients: [
          { name: 'C-506 MARINARA CORE', quantity: 1000 },
          { name: 'Water / Tomato Stock', quantity: 4000 }
        ],
        targetYield: 5000,
        operationalYield: 5000
      },
      {
        name: '80% Boiled Pasta',
        ingredients: [
          { name: 'Boiled Pasta (Raw Base)', quantity: 1000 }, // raw pasta
          { name: 'Water / Tomato Stock', quantity: 4000 }
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
      { code: 'PT_BOILED_PASTA_200GM', name: '200 gm Boiled Pasta Portion', sfgName: '80% Boiled Pasta', quantity: 200, unit: 'gm' }
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
      { name: 'Margherita Pizza', category: 'Pizza', price: 199 },
      { name: 'Veg Club Sandwich', category: 'Sandwich', price: 149 },
      { name: 'Classic Veg Wrap', category: 'Wrap', price: 159 },
      { name: 'Pink Sauce Pasta', category: 'Pasta', price: 249 },
      { name: 'Arrabbiata Pasta', category: 'Pasta', price: 219 },
      { name: 'White Sauce Pasta', category: 'Pasta', price: 229 },
      { name: 'Vanilla Shake', category: 'Beverage', price: 149 },
      { name: 'Chocolate Shake', category: 'Beverage', price: 179 },
      { name: 'Cold Coffee', category: 'Beverage', price: 129 }
    ];

    for (const d of dishesToCreate) {
      let dish = await Dish.findOne({ name: d.name, userId });
      if (!dish) {
        dish = new Dish({ name: d.name, category: d.category, price: d.price, userId, packagingLogic: { dineIn: [], takeaway: [], delivery: [] } });
        await dish.save();
      }
      
      const dishRecipeIngs = [];

      if (d.name.includes('Pizza')) {
        const base = await resolveIng('10 inch Pizza Base');
        if (base) dishRecipeIngs.push({ itemModel: base.model, itemId: base.id, quantity: 1 });
        const sauce = await resolveIng('Prepared Pizza Sauce');
        if (sauce) dishRecipeIngs.push({ itemModel: sauce.model, itemId: sauce.id, quantity: 50 });
        const cheese = await resolveIng('Mozzarella + Cheddar Blend');
        if (cheese) dishRecipeIngs.push({ itemModel: cheese.model, itemId: cheese.id, quantity: 90 });
        const veg = await resolveIng('Mixed Pizza Vegetables');
        if (veg) dishRecipeIngs.push({ itemModel: veg.model, itemId: veg.id, quantity: 40 });
        const butter = await resolveIng('Soft Butter');
        if (butter) dishRecipeIngs.push({ itemModel: butter.model, itemId: butter.id, quantity: 3 });
        const fd = await resolveIng('C-509 FIRE DUST');
        if (fd) dishRecipeIngs.push({ itemModel: fd.model, itemId: fd.id, quantity: 1 });
      } else if (d.name.includes('Sandwich')) {
        const bread = await resolveIng('Bread Slices');
        if (bread) dishRecipeIngs.push({ itemModel: bread.model, itemId: bread.id, quantity: 2 });
        const spread = await resolveIng('Herb Garlic Mayo');
        if (spread) dishRecipeIngs.push({ itemModel: spread.model, itemId: spread.id, quantity: 15 });
        const glaze = await resolveIng('Classic Burger Sauce');
        if (glaze) dishRecipeIngs.push({ itemModel: glaze.model, itemId: glaze.id, quantity: 20 });
        const veg = await resolveIng('Lettuce/Cabbage');
        if (veg) dishRecipeIngs.push({ itemModel: veg.model, itemId: veg.id, quantity: 40 });
        const cheese = await resolveIng('Cheese Slice');
        if (cheese) dishRecipeIngs.push({ itemModel: cheese.model, itemId: cheese.id, quantity: 1 }); // 20gm ~= 1 slice
        const butter = await resolveIng('Soft Butter');
        if (butter) dishRecipeIngs.push({ itemModel: butter.model, itemId: butter.id, quantity: 5 });
        const fd = await resolveIng('C-509 FIRE DUST');
        if (fd) dishRecipeIngs.push({ itemModel: fd.model, itemId: fd.id, quantity: 1 });
      } else if (d.name.includes('Wrap')) {
        const tort = await resolveIng('8/10 inch Tortilla / Lacha Paratha');
        if (tort) dishRecipeIngs.push({ itemModel: tort.model, itemId: tort.id, quantity: 1 });
        const patty = await resolveIng('Prepared Veg Patty');
        if (patty) dishRecipeIngs.push({ itemModel: patty.model, itemId: patty.id, quantity: 120 });
        const sauce = await resolveIng('Classic Burger Sauce');
        if (sauce) dishRecipeIngs.push({ itemModel: sauce.model, itemId: sauce.id, quantity: 30 });
        const veg = await resolveIng('Lettuce/Cabbage');
        if (veg) dishRecipeIngs.push({ itemModel: veg.model, itemId: veg.id, quantity: 15 });
        const onion = await resolveIng('Onion');
        if (onion) dishRecipeIngs.push({ itemModel: onion.model, itemId: onion.id, quantity: 30 });
        const fd = await resolveIng('C-509 FIRE DUST');
        if (fd) dishRecipeIngs.push({ itemModel: fd.model, itemId: fd.id, quantity: 1 });
        const butter = await resolveIng('Soft Butter');
        if (butter) dishRecipeIngs.push({ itemModel: butter.model, itemId: butter.id, quantity: 5 });
      } else if (d.name.includes('Pink Sauce Pasta')) {
        const pasta = await resolveIng('200 gm Boiled Pasta Portion');
        if (pasta) dishRecipeIngs.push({ itemModel: pasta.model, itemId: pasta.id, quantity: 1 });
        const milk = await resolveIng('Full Cream Milk');
        if (milk) dishRecipeIngs.push({ itemModel: milk.model, itemId: milk.id, quantity: 150 });
        const water = await resolveIng('Water / Tomato Stock');
        if (water) dishRecipeIngs.push({ itemModel: water.model, itemId: water.id, quantity: 50 });
        const alfredo = await resolveIng('C-505 ALFREDO CORE');
        if (alfredo) dishRecipeIngs.push({ itemModel: alfredo.model, itemId: alfredo.id, quantity: 30 });
        const marinara = await resolveIng('C-506 MARINARA CORE');
        if (marinara) dishRecipeIngs.push({ itemModel: marinara.model, itemId: marinara.id, quantity: 20 });
        const butter = await resolveIng('Soft Butter');
        if (butter) dishRecipeIngs.push({ itemModel: butter.model, itemId: butter.id, quantity: 10 });
        const veg = await resolveIng('Sweet Corn');
        if (veg) dishRecipeIngs.push({ itemModel: veg.model, itemId: veg.id, quantity: 40 });
        const fd = await resolveIng('C-509 FIRE DUST');
        if (fd) dishRecipeIngs.push({ itemModel: fd.model, itemId: fd.id, quantity: 1 });
      } else if (d.name.includes('Arrabbiata')) {
        const pasta = await resolveIng('200 gm Boiled Pasta Portion');
        if (pasta) dishRecipeIngs.push({ itemModel: pasta.model, itemId: pasta.id, quantity: 1 });
        const water = await resolveIng('Water / Tomato Stock');
        if (water) dishRecipeIngs.push({ itemModel: water.model, itemId: water.id, quantity: 200 });
        const marinara = await resolveIng('C-506 MARINARA CORE');
        if (marinara) dishRecipeIngs.push({ itemModel: marinara.model, itemId: marinara.id, quantity: 50 });
        const oil = await resolveIng('Refined Frying Oil');
        if (oil) dishRecipeIngs.push({ itemModel: oil.model, itemId: oil.id, quantity: 10 });
        const veg = await resolveIng('Capsicum');
        if (veg) dishRecipeIngs.push({ itemModel: veg.model, itemId: veg.id, quantity: 40 });
      } else if (d.name.includes('White Sauce')) {
        const pasta = await resolveIng('200 gm Boiled Pasta Portion');
        if (pasta) dishRecipeIngs.push({ itemModel: pasta.model, itemId: pasta.id, quantity: 1 });
        const milk = await resolveIng('Full Cream Milk');
        if (milk) dishRecipeIngs.push({ itemModel: milk.model, itemId: milk.id, quantity: 200 });
        const alfredo = await resolveIng('C-505 ALFREDO CORE');
        if (alfredo) dishRecipeIngs.push({ itemModel: alfredo.model, itemId: alfredo.id, quantity: 45 });
        const butter = await resolveIng('Soft Butter');
        if (butter) dishRecipeIngs.push({ itemModel: butter.model, itemId: butter.id, quantity: 10 });
        const veg = await resolveIng('Mushroom');
        if (veg) dishRecipeIngs.push({ itemModel: veg.model, itemId: veg.id, quantity: 40 });
      } else if (d.name === 'Vanilla Shake') {
        const milk = await resolveIng('Full Cream Milk');
        if (milk) dishRecipeIngs.push({ itemModel: milk.model, itemId: milk.id, quantity: 200 });
        const base = await resolveIng('C-507 SNOW BASE');
        if (base) dishRecipeIngs.push({ itemModel: base.model, itemId: base.id, quantity: 40 });
        const ice = await resolveIng('Ice Cubes');
        if (ice) dishRecipeIngs.push({ itemModel: ice.model, itemId: ice.id, quantity: 3 });
      } else if (d.name === 'Chocolate Shake') {
        const milk = await resolveIng('Full Cream Milk');
        if (milk) dishRecipeIngs.push({ itemModel: milk.model, itemId: milk.id, quantity: 200 });
        const base = await resolveIng('C-508 COCOA BASE');
        if (base) dishRecipeIngs.push({ itemModel: base.model, itemId: base.id, quantity: 45 });
        const ice = await resolveIng('Ice Cubes');
        if (ice) dishRecipeIngs.push({ itemModel: ice.model, itemId: ice.id, quantity: 3 });
      } else if (d.name === 'Cold Coffee') {
        const milk = await resolveIng('Full Cream Milk');
        if (milk) dishRecipeIngs.push({ itemModel: milk.model, itemId: milk.id, quantity: 200 });
        const base = await resolveIng('C-507 SNOW BASE');
        if (base) dishRecipeIngs.push({ itemModel: base.model, itemId: base.id, quantity: 35 });
        const coffee = await resolveIng('Instant Coffee');
        if (coffee) dishRecipeIngs.push({ itemModel: coffee.model, itemId: coffee.id, quantity: 5 });
        const ice = await resolveIng('Ice Cubes');
        if (ice) dishRecipeIngs.push({ itemModel: ice.model, itemId: ice.id, quantity: 3 });
      }

      await Recipe.findOneAndUpdate(
        { targetModel: 'Dish', targetId: dish._id, userId },
        { targetYield: 1, operationalYield: 1, ingredients: dishRecipeIngs },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'More fast food items injected successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
