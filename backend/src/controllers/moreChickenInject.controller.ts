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

    /*
    const dishesToCreate = [
      ... (Removed to prevent automatic dish creation in POS)
    ];
    */

    res.json({ success: true, message: 'More chicken items injected successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
