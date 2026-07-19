import { Request, Response } from 'express';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Dish from '../models/Dish';
import Packaging from '../models/Packaging';
import User from '../models/User';

export const injectMoreChicken = async (req: Request, res: Response): Promise<void> => {
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
      { code: 'RM_PRECOOKED_KEEMA', name: 'Pre-cooked Keema', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 },
      { code: 'RM_PRECOOKED_CHICKEN_KEEMA', name: 'Pre-cooked Chicken Keema', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 350, conversionFactor: 1000 },
      { code: 'RM_CHICKEN_BREAST_FILLET', name: 'Chicken Breast Fillet / Boneless Tikka', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 450, conversionFactor: 1000 },
      { code: 'RM_ALMOND_PASTE', name: 'Almond Paste', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 1200, conversionFactor: 1000 },
      { code: 'RM_WHITE_PEPPER', name: 'White Pepper', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 900, conversionFactor: 1000 },
      { code: 'RM_CAPSICUM_CUBES', name: 'Capsicum Cubes', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_ONION_CUBES', name: 'Onion Cubes', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 40, conversionFactor: 1000 },
      { code: 'RM_DRY_RED_CHILLI', name: 'Dry Red Chilli', consumptionUnit: 'pcs', purchaseUnit: 'kg', costPerPurchaseUnit: 200, conversionFactor: 500 },
      { code: 'RM_PRECOOKED_HARIYALI_TIKKA', name: 'Pre-cooked Hariyali Tikka / Roasted Chicken', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 },
      { code: 'RM_FRESH_MINT', name: 'Fresh Mint', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 80, conversionFactor: 1000 },
      { code: 'RM_CARDAMOM_POWDER', name: 'Cardamom Powder', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 2500, conversionFactor: 1000 },
      { code: 'RM_DRY_FRUITS_CASHEW_ALMOND', name: 'Dry Fruits (Cashew/Almond)', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 1000, conversionFactor: 1000 }
    ];

    for (const rm of rms) {
      await RawMaterial.findOneAndUpdate({ code: rm.code, userId }, { ...rm, userId }, { upsert: true });
    }

    const sfgs = [
      { code: 'SFG_PRECOOKED_KEEMA', name: 'Pre-cooked Keema', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_PRECOOKED_CHICKEN_KEEMA', name: 'Pre-cooked Chicken Keema', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_PRECOOKED_CHICKEN_FILLET', name: 'Pre-cooked Chicken Fillet', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_KADHAI_VEG_MIX', name: 'Kadhai Veg Mix', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_PRECOOKED_HARIYALI_TIKKA', name: 'Pre-cooked Hariyali Tikka', batchYield: 5000, yieldUnit: 'gm' }
    ];

    for (const sfg of sfgs) {
      await SemiFinishedGood.findOneAndUpdate({ code: sfg.code, userId }, { ...sfg, userId }, { upsert: true });
    }

    const pkgs = [
      { code: 'PKG_COPPER_KADHAI_ROUND_HANDI', name: 'Copper Kadhai / Round Handi', unit: 'pc', costPerUnit: 25 },
      { code: 'PKG_ROYAL_BOWL', name: 'Royal Bowl', unit: 'pc', costPerUnit: 20 }
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

    const portionsData = [
      { code: 'PT_PRECOOKED_KEEMA', name: 'Pre-cooked Keema Portion', sfgName: 'Pre-cooked Keema', quantity: 60, unit: 'gm' },
      { code: 'PT_PRECOOKED_CHICKEN_KEEMA', name: 'Pre-cooked Chicken Keema Portion', sfgName: 'Pre-cooked Chicken Keema', quantity: 60, unit: 'gm' },
      { code: 'PT_PRECOOKED_CHICKEN_FILLET', name: 'Chicken Fillet Portion', sfgName: 'Pre-cooked Chicken Fillet', quantity: 180, unit: 'gm' },
      { code: 'PT_PRECOOKED_HARIYALI_TIKKA', name: 'Pre-cooked Hariyali Tikka Portion', sfgName: 'Pre-cooked Hariyali Tikka', quantity: 200, unit: 'gm' }
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
      { name: 'Chicken / Mutton Rara', category: 'Indian Main Course', price: 399 },
      { name: 'Chicken Pasanda', category: 'Indian Main Course', price: 449 },
      { name: 'Chicken Rara', category: 'Indian Main Course', price: 399 },
      { name: 'Chicken Tikka Masala', category: 'Indian Main Course', price: 399 },
      { name: 'Kadhai Chicken', category: 'Indian Main Course', price: 349 },
      { name: 'Murg Hariyali', category: 'Indian Main Course', price: 349 },
      { name: 'Murg Mumtaz', category: 'Indian Main Course', price: 449 }
    ];

    for (const d of dishesToCreate) {
      let dish = await Dish.findOne({ name: d.name, userId });
      if (!dish) {
        dish = new Dish({ name: d.name, category: d.category, price: d.price, userId, packagingLogic: { dineIn: [], takeaway: [], delivery: [] } });
        await dish.save();
      }
      
      const dishRecipeIngs: any[] = [];

      const add = async (ingName: string, quantity: number) => {
        const item = await resolveIng(ingName);
        if (item) dishRecipeIngs.push({ itemModel: item.model, itemId: item.id, quantity });
      };

      if (d.name === 'Chicken / Mutton Rara') {
        await add('G-205 ROYAL ROGAN', 120);
        await add('G-204 ROASTED RUST', 80);
        await add('Pre-cooked Chicken/Mutton Portion', 1);
        await add('Pre-cooked Keema Portion', 1);
        await add('Refined Oil', 15);
        await add('Desi Ghee', 5);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('Ginger Juliennes', 3);
        await add('K-801 ROYAL PUNCH', 1);
        await add('K-802 WOK SPICE', 1);
        await add('Kashmiri Chilli', 1);
        await add('Curd', 15);
        await add('Kasoori Methi', 1);
        await add('Meat Stock', 45);
        await add('Fresh Coriander', 3);
      } else if (d.name === 'Chicken Pasanda') {
        await add('G-202 IVORY BASE', 140);
        await add('G-201 SUNSET BASE', 60);
        await add('Chicken Fillet Portion', 1);
        await add('Desi Ghee', 20);
        await add('Butter', 8);
        await add('Milk', 45);
        await add('Ginger Garlic Paste', 3);
        await add('Curd', 15);
        await add('Fresh Cream', 15);
        await add('Almond Paste', 10);
        await add('White Pepper', 0.5);
        await add('K-801 ROYAL PUNCH', 1);
        await add('K-806 ZESTFUL ZING', 0.5);
        await add('Sugar / Honey', 2);
      } else if (d.name === 'Chicken Rara') {
        await add('G-205 ROYAL ROGAN', 120);
        await add('G-204 ROASTED RUST', 80);
        await add('Pre-cooked Chicken Pieces Portion', 1); // Assuming reusing from earlier or matching name
        await add('Pre-cooked Chicken Keema Portion', 1);
        await add('Refined Oil', 15);
        await add('Desi Ghee', 5);
        await add('Jeera', 1);
        await add('Ginger Juliennes', 3);
        await add('K-801 ROYAL PUNCH', 0.5);
        await add('K-806 ZESTFUL ZING', 0.5);
        await add('Kashmiri Chilli', 1);
        await add('Kasoori Methi', 1);
        await add('Water/Chicken Stock', 40);
        await add('Fresh Coriander', 3);
      } else if (d.name === 'Chicken Tikka Masala') {
        await add('G-201 SUNSET BASE', 120);
        await add('G-205 ROYAL ROGAN', 80);
        await add('Pre-cooked Chicken Tikka Portion', 1);
        await add('Butter', 15);
        await add('Refined Oil', 3);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('K-802 WOK SPICE', 1);
        await add('K-801 ROYAL PUNCH', 0.5);
        await add('K-806 ZESTFUL ZING', 0.5);
        await add('Fresh Cream', 15);
        await add('Kasoori Methi', 1);
        await add('Water/Chicken Stock', 40);
        await add('Fresh Coriander', 2);
        await add('Ginger Juliennes', 3);
      } else if (d.name === 'Kadhai Chicken') {
        await add('G-204 ROASTED RUST', 200);
        await add('Pre-cooked Tandoori Chicken Portion', 1);
        await add('Capsicum Cubes', 20);
        await add('Onion Cubes', 20);
        await add('Chicken Stock', 40);
        await add('Refined Oil', 15);
        await add('Desi Ghee', 5);
        await add('Dry Red Chilli', 2);
        await add('Jeera', 1);
        await add('Ginger Garlic Paste', 3);
        await add('Curd', 5);
        await add('Kashmiri Chilli', 1);
        await add('K-801 ROYAL PUNCH', 0.5);
        await add('K-802 WOK SPICE', 1);
        await add('Kasoori Methi', 1);
        await add('Crushed Black Pepper', 0.5);
        await add('Fresh Coriander', 3);
        await add('Green Chilli', 5);
        await add('Ginger Juliennes', 5);
      } else if (d.name === 'Murg Hariyali') {
        await add('G-203 EMERALD MIX', 120);
        await add('G-202 IVORY BASE', 80);
        await add('Pre-cooked Hariyali Tikka Portion', 1);
        await add('Butter', 15);
        await add('Refined Oil', 3);
        await add('Ginger Garlic Paste', 2);
        await add('Green Chilli', 2);
        await add('Curd', 15);
        await add('Fresh Cream', 15);
        await add('Kasoori Methi', 1);
        await add('Fresh Coriander', 5);
        await add('Fresh Mint', 3);
        await add('White Pepper', 0.5);
        await add('K-801 ROYAL PUNCH', 1);
        await add('K-806 ZESTFUL ZING', 0.5);
        await add('Milk', 40);
        await add('Grated Paneer', 10);
      } else if (d.name === 'Murg Mumtaz') {
        await add('G-202 IVORY BASE', 100);
        await add('G-201 SUNSET BASE', 50);
        await add('G-205 ROYAL ROGAN', 50);
        await add('Pre-cooked Tandoori Chicken Portion', 1);
        await add('Butter', 15);
        await add('Desi Ghee', 5);
        await add('Milk', 45);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('Fresh Cream', 15);
        await add('Kasoori Methi', 1);
        await add('Cardamom Powder', 0.5);
        await add('White Pepper', 0.5);
        await add('K-801 ROYAL PUNCH', 1);
        await add('Dry Fruits (Cashew/Almond)', 5);
        await add('Ginger Juliennes', 3);
      }

      await Recipe.findOneAndUpdate(
        { targetModel: 'Dish', targetId: dish._id, userId },
        { targetYield: 1, operationalYield: 1, ingredients: dishRecipeIngs },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'More chicken items injected successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
