import { Request, Response } from 'express';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Dish from '../models/Dish';
import Packaging from '../models/Packaging';
import User from '../models/User';

export const injectBiryani = async (req: Request, res: Response): Promise<void> => {
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
      { code: 'RM_B401_PREMIX', name: 'B-401 ROYAL AWADH Premix', consumptionUnit: 'pkt', purchaseUnit: 'pkt', costPerPurchaseUnit: 150, conversionFactor: 1 },
      { code: 'RM_CHICKEN', name: 'Chicken', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 250, conversionFactor: 1000 },
      { code: 'RM_LONG_GRAIN_BASMATI_RICE', name: 'Long Grain Basmati Rice', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 110, conversionFactor: 1000 },
      { code: 'RM_CURD', name: 'Curd', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 80, conversionFactor: 1000 },
      { code: 'RM_GHEE_OIL', name: 'Ghee/Oil', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 150, conversionFactor: 1000 },
      { code: 'RM_BROWN_ONION', name: 'Brown Onion (Birista)', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 },
      { code: 'RM_GINGER_GARLIC_PASTE', name: 'Ginger Garlic Paste', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 120, conversionFactor: 1000 },
      { code: 'RM_MILK', name: 'Milk', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_KEWRA_ATTAR', name: 'Kewra + Attar', consumptionUnit: 'ml', purchaseUnit: 'ml', costPerPurchaseUnit: 50, conversionFactor: 1 },
      { code: 'RM_FOOD_COLOUR', name: 'Food Colour', consumptionUnit: 'ml', purchaseUnit: 'ml', costPerPurchaseUnit: 20, conversionFactor: 1 }
    ];

    for (const rm of rms) {
      await RawMaterial.findOneAndUpdate({ code: rm.code, userId }, { ...rm, userId }, { upsert: true });
    }

    const sfgs = [
      { code: 'SFG_80_COOKED_YAKHNI_CHICKEN', name: '80% Cooked Yakhni Chicken', batchYield: 1000, yieldUnit: 'gm' },
      { code: 'SFG_70_BOILED_RICE', name: '70% Boiled Rice', batchYield: 2200, yieldUnit: 'gm' },
      { code: 'SFG_EXTRACTED_ROGAN', name: 'Extracted Rogan', batchYield: 100, yieldUnit: 'ml' },
      { code: 'SFG_BROWN_ONION', name: 'Brown Onion', batchYield: 70, yieldUnit: 'gm' }
    ];

    for (const sfg of sfgs) {
      await SemiFinishedGood.findOneAndUpdate({ code: sfg.code, userId }, { ...sfg, userId }, { upsert: true });
    }

    const pkgs = [
      { code: 'PKG_BIRYANI_CONTAINER', name: 'Biryani Container', unit: 'pc', costPerUnit: 15 },
      { code: 'PKG_LID', name: 'Lid', unit: 'pc', costPerUnit: 5 },
      { code: 'PKG_CARRY_BAG', name: 'Carry Bag', unit: 'pc', costPerUnit: 10 }
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
        name: '80% Cooked Yakhni Chicken',
        ingredients: [
          { name: 'Chicken', quantity: 1000 },
          { name: 'B-401 ROYAL AWADH Premix', quantity: 1 },
          { name: 'Curd', quantity: 200 },
          { name: 'Ginger Garlic Paste', quantity: 50 },
          { name: 'Ghee/Oil', quantity: 100 }
        ],
        targetYield: 1000,
        operationalYield: 1000
      },
      {
        name: '70% Boiled Rice',
        ingredients: [
          { name: 'Long Grain Basmati Rice', quantity: 1000 }
        ],
        targetYield: 2200,
        operationalYield: 2200
      },
      {
        name: 'Extracted Rogan',
        ingredients: [
          { name: 'Ghee/Oil', quantity: 100 }
        ],
        targetYield: 100,
        operationalYield: 100
      },
      {
        name: 'Brown Onion',
        ingredients: [
          { name: 'Brown Onion (Birista)', quantity: 70 }
        ],
        targetYield: 70,
        operationalYield: 70
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
      { code: 'PT_COOKED_BIRYANI', name: 'Cooked Biryani Portion', sfgName: '70% Boiled Rice', quantity: 270, unit: 'gm' },
      { code: 'PT_CHICKEN_PIECES', name: 'Chicken Pieces Portion', sfgName: '80% Cooked Yakhni Chicken', quantity: 80, unit: 'gm' },
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

    let dish = await Dish.findOne({ name: 'Shahi Lucknowi Biryani', userId });
    if (!dish) {
      dish = new Dish({ name: 'Shahi Lucknowi Biryani', category: 'Biryani', price: 299, userId, packagingLogic: { dineIn: [], takeaway: [], delivery: [] } });
      await dish.save();
    }

    const dishRecipeIngs = [];
    const pt1 = await resolveIng('Cooked Biryani Portion');
    if (pt1) dishRecipeIngs.push({ itemModel: pt1.model, itemId: pt1.id, quantity: 1 });
    
    const pt2 = await resolveIng('Chicken Pieces Portion');
    if (pt2) dishRecipeIngs.push({ itemModel: pt2.model, itemId: pt2.id, quantity: 1 });
    
    const sfgRogan = await resolveIng('Extracted Rogan');
    if (sfgRogan) dishRecipeIngs.push({ itemModel: sfgRogan.model, itemId: sfgRogan.id, quantity: 10 }); // 10 ml rogan per portion (guess)

    const sfgOnion = await resolveIng('Brown Onion');
    if (sfgOnion) dishRecipeIngs.push({ itemModel: sfgOnion.model, itemId: sfgOnion.id, quantity: 5 }); // 5 gm onion per portion (guess)

    const rmMilk = await resolveIng('Milk');
    if (rmMilk) dishRecipeIngs.push({ itemModel: rmMilk.model, itemId: rmMilk.id, quantity: 10 }); // 10 ml milk per portion

    const rmKewra = await resolveIng('Kewra + Attar');
    if (rmKewra) dishRecipeIngs.push({ itemModel: rmKewra.model, itemId: rmKewra.id, quantity: 1 }); // 1 ml kewra per portion

    const rmColour = await resolveIng('Food Colour');
    if (rmColour) dishRecipeIngs.push({ itemModel: rmColour.model, itemId: rmColour.id, quantity: 1 }); // 1 ml colour per portion

    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish._id, userId },
      { targetYield: 1, operationalYield: 1, ingredients: dishRecipeIngs },
      { upsert: true }
    );

    res.json({ success: true, message: 'Shahi Lucknowi Biryani injected successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
