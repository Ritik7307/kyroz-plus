import { Request, Response } from 'express';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Dish from '../models/Dish';
import Packaging from '../models/Packaging';
import User from '../models/User';

export const injectChicken = async (req: Request, res: Response): Promise<void> => {
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
      { code: 'RM_PRECOOKED_CHICKEN_MUTTON', name: 'Pre-cooked Chicken/Mutton', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 350, conversionFactor: 1000 },
      { code: 'RM_SHAHI_JEERA', name: 'Shahi Jeera', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 },
      { code: 'RM_TEJ_PATTA', name: 'Tej Patta', consumptionUnit: 'pcs', purchaseUnit: 'kg', costPerPurchaseUnit: 150, conversionFactor: 500 }, // Approx
      { code: 'RM_BLACK_CARDAMOM', name: 'Black Cardamom', consumptionUnit: 'pcs', purchaseUnit: 'kg', costPerPurchaseUnit: 1200, conversionFactor: 500 }, // Approx
      { code: 'RM_CLOVES', name: 'Cloves', consumptionUnit: 'pcs', purchaseUnit: 'kg', costPerPurchaseUnit: 1000, conversionFactor: 10000 }, // Approx
      { code: 'RM_CHOPPED_GARLIC', name: 'Chopped Garlic', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 150, conversionFactor: 1000 },
      { code: 'RM_CHOPPED_ONION', name: 'Chopped Onion', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 40, conversionFactor: 1000 },
      { code: 'RM_BLACK_PEPPER', name: 'Black Pepper', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 800, conversionFactor: 1000 },
      { code: 'RM_CORIANDER_POWDER', name: 'Coriander Powder', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 250, conversionFactor: 1000 },
      { code: 'RM_MEAT_STOCK', name: 'Meat Stock', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 50, conversionFactor: 1000 },
      { code: 'RM_PRECOOKED_TANDOORI_BARRAH', name: 'Pre-cooked Tandoori Barrah', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 500, conversionFactor: 1000 },
      { code: 'RM_MUSTARD_OIL', name: 'Mustard Oil', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 180, conversionFactor: 1000 },
      { code: 'RM_LEMON_JUICE', name: 'Lemon Juice', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_MILK_CHICKEN_STOCK', name: 'Milk / Chicken Stock', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_SUGAR_HONEY', name: 'Sugar / Honey', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_PRECOOKED_TANDOORI_CHICKEN', name: 'Pre-cooked Tandoori Chicken', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 350, conversionFactor: 1000 },
      { code: 'RM_CHICKEN_STOCK', name: 'Chicken Stock', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 50, conversionFactor: 1000 },
      { code: 'RM_GREEN_CARDAMOM', name: 'Green Cardamom', consumptionUnit: 'pcs', purchaseUnit: 'kg', costPerPurchaseUnit: 1500, conversionFactor: 1000 }, // Approx
      { code: 'RM_WHOLE_GREEN_CHILLI', name: 'Whole Green Chilli', consumptionUnit: 'pcs', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 200 }, // Approx
      { code: 'RM_WHOLE_BLACK_PEPPER', name: 'Whole Black Pepper', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 800, conversionFactor: 1000 },
      { code: 'RM_CRUSHED_BLACK_PEPPER', name: 'Crushed Black Pepper', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 850, conversionFactor: 1000 },
      { code: 'RM_CHOPPED_CAPSICUM', name: 'Chopped Capsicum', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_GRATED_PANEER', name: 'Grated Paneer', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 350, conversionFactor: 1000 },
      { code: 'RM_KITCHEN_KING_MASALA', name: 'Kitchen King Masala', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 },
      { code: 'RM_WATER_CHICKEN_STOCK', name: 'Water/Chicken Stock', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 50, conversionFactor: 1000 },
      { code: 'RM_PRECOOKED_CHICKEN_TIKKA', name: 'Pre-cooked Chicken Tikka', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 400, conversionFactor: 1000 }
    ];

    for (const rm of rms) {
      await RawMaterial.findOneAndUpdate({ code: rm.code, userId }, { ...rm, userId }, { upsert: true });
    }

    const sfgs = [
      { code: 'SFG_PRECOOKED_CHICKEN_MUTTON', name: 'Pre-cooked Chicken/Mutton', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_PRECOOKED_TANDOORI_BARRAH', name: 'Pre-cooked Tandoori Barrah', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_PRECOOKED_TANDOORI_CHICKEN', name: 'Pre-cooked Tandoori Chicken', batchYield: 5000, yieldUnit: 'gm' },
      { code: 'SFG_PRECOOKED_CHICKEN_TIKKA', name: 'Pre-cooked Chicken Tikka', batchYield: 5000, yieldUnit: 'gm' }
    ];

    for (const sfg of sfgs) {
      await SemiFinishedGood.findOneAndUpdate({ code: sfg.code, userId }, { ...sfg, userId }, { upsert: true });
    }

    const pkgs = [
      { code: 'PKG_EARTHEN_HANDI_BOWL', name: 'Earthen Handi / Bowl', unit: 'pc', costPerUnit: 20 },
      { code: 'PKG_SERVING_PLATE_CONTAINER', name: 'Serving Plate/Container', unit: 'pc', costPerUnit: 10 },
      { code: 'PKG_PREMIUM_ROUND_HANDI', name: 'Premium Round Handi / Ceramic Bowl', unit: 'pc', costPerUnit: 25 },
      { code: 'PKG_500ML_HANDI_BOWL', name: '500 ml Handi/Bowl', unit: 'pc', costPerUnit: 15 },
      { code: 'PKG_CERAMIC_BOWL_DEEP_HANDI', name: 'Ceramic Bowl / Deep Handi', unit: 'pc', costPerUnit: 18 },
      { code: 'PKG_PREMIUM_WHITE_BOWL', name: 'Premium White Bowl / Royal Handi', unit: 'pc', costPerUnit: 25 }
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
      { code: 'PT_PRECOOKED_CHICKEN_MUTTON', name: 'Pre-cooked Chicken/Mutton Portion', sfgName: 'Pre-cooked Chicken/Mutton', quantity: 300, unit: 'gm' },
      { code: 'PT_PRECOOKED_TANDOORI_BARRAH', name: 'Pre-cooked Tandoori Barrah Portion', sfgName: 'Pre-cooked Tandoori Barrah', quantity: 200, unit: 'gm' },
      { code: 'PT_PRECOOKED_TANDOORI_CHICKEN', name: 'Pre-cooked Tandoori Chicken Portion', sfgName: 'Pre-cooked Tandoori Chicken', quantity: 200, unit: 'gm' },
      { code: 'PT_PRECOOKED_CHICKEN_TIKKA', name: 'Pre-cooked Chicken Tikka Portion', sfgName: 'Pre-cooked Chicken Tikka', quantity: 200, unit: 'gm' }
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
      { name: 'Authentic Desi Handi Chicken', category: 'Indian Main Course', price: 349 },
      { name: 'Chicken Barrah Masala', category: 'Indian Main Course', price: 399 },
      { name: 'Butter Chicken', category: 'Indian Main Course', price: 399 },
      { name: 'Chicken Changezi', category: 'Indian Main Course', price: 349 },
      { name: 'Chicken Curry', category: 'Indian Main Course', price: 299 },
      { name: 'Chicken Kali Mirch', category: 'Indian Main Course', price: 349 },
      { name: 'Chicken Lababdar', category: 'Indian Main Course', price: 399 }
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

      if (d.name.includes('Desi Handi')) {
        await add('G-205 ROYAL ROGAN', 140);
        await add('G-204 ROASTED RUST', 60);
        await add('Pre-cooked Chicken/Mutton Portion', 1);
        await add('Desi Ghee', 20);
        await add('Shahi Jeera', 2);
        await add('Tej Patta', 1);
        await add('Black Cardamom', 2);
        await add('Cloves', 4);
        await add('Chopped Garlic', 5);
        await add('Chopped Onion', 20);
        await add('Curd', 30);
        await add('Black Pepper', 1);
        await add('Coriander Powder', 2);
        await add('K-801 ROYAL PUNCH', 1);
        await add('Kashmiri Chilli', 1);
        await add('Fresh Coriander', 5);
        await add('Ginger Juliennes', 5);
        await add('Meat Stock', 50);
      } else if (d.name === 'Chicken Barrah Masala') {
        await add('G-205 ROYAL ROGAN', 120);
        await add('G-204 ROASTED RUST', 80);
        await add('Pre-cooked Tandoori Barrah Portion', 1);
        await add('Desi Ghee', 15);
        await add('Mustard Oil', 3);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('K-802 WOK SPICE', 2);
        await add('K-801 ROYAL PUNCH', 1);
        await add('Black Pepper', 1);
        await add('Curd', 15);
        await add('Lemon Juice', 5);
        await add('Meat Stock', 40);
        await add('Fresh Coriander', 3);
      } else if (d.name === 'Butter Chicken') {
        await add('G-201 SUNSET BASE', 200);
        await add('Pre-cooked Tandoori Chicken Portion', 1); // Or Tikka
        await add('Milk / Chicken Stock', 30);
        await add('Butter', 20);
        await add('Refined Oil', 3);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('Kashmiri Chilli', 1);
        await add('Fresh Cream', 22);
        await add('Kasoori Methi', 1);
        await add('Sugar / Honey', 2);
        await add('K-801 ROYAL PUNCH', 0.5);
        await add('K-806 ZESTFUL ZING', 0.5);
        await add('Fresh Coriander', 3);
        await add('Ginger Juliennes', 5);
      } else if (d.name === 'Chicken Changezi') {
        await add('G-205 ROYAL ROGAN', 100);
        await add('G-201 SUNSET BASE', 60);
        await add('G-202 IVORY BASE', 40);
        await add('Pre-cooked Tandoori Chicken Portion', 1);
        await add('Desi Ghee', 15);
        await add('Refined Oil', 3);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('Ginger Juliennes', 3);
        await add('Curd', 15);
        await add('Fresh Cream', 15);
        await add('K-801 ROYAL PUNCH', 1);
        await add('K-802 WOK SPICE', 1);
        await add('K-806 ZESTFUL ZING', 0.5);
        await add('Kasoori Methi', 1);
        await add('Milk', 50);
      } else if (d.name === 'Chicken Curry') {
        await add('G-205 ROYAL ROGAN', 200);
        await add('Pre-cooked Tandoori Chicken Portion', 1); // Using available precooked chicken
        await add('Chicken Stock', 50);
        await add('Refined Oil', 15);
        await add('Desi Ghee', 5);
        await add('Black Cardamom', 1);
        await add('Cloves', 2);
        await add('Shahi Jeera', 1);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('Kashmiri Chilli', 1);
        await add('K-801 ROYAL PUNCH', 1);
        await add('Kasoori Methi', 1);
        await add('Fresh Coriander', 3);
        await add('Ginger Juliennes', 5);
      } else if (d.name === 'Chicken Kali Mirch') {
        await add('G-202 IVORY BASE', 200);
        await add('Pre-cooked Tandoori Chicken Portion', 1);
        await add('Milk / White Chicken Stock', 40);
        await add('Desi Ghee', 15);
        await add('Refined Oil', 3);
        await add('Green Cardamom', 2);
        await add('Whole Green Chilli', 1);
        await add('Whole Black Pepper', 1);
        await add('Ginger Garlic Paste', 3);
        await add('Crushed Black Pepper', 1);
        await add('Fresh Cream', 22);
        await add('Kasoori Methi', 1);
        await add('K-801 ROYAL PUNCH', 0.5);
        await add('K-806 ZESTFUL ZING', 0.5);
        await add('Ginger Juliennes', 5);
      } else if (d.name === 'Chicken Lababdar') {
        await add('G-201 SUNSET BASE', 120);
        await add('G-205 ROYAL ROGAN', 40);
        await add('G-202 IVORY BASE', 40);
        await add('Pre-cooked Chicken Tikka Portion', 1);
        await add('Butter', 15);
        await add('Refined Oil', 3);
        await add('Ginger Garlic Paste', 3);
        await add('Green Chilli', 2);
        await add('Ginger Juliennes', 3);
        await add('Chopped Onion', 15);
        await add('Chopped Capsicum', 15);
        await add('Grated Paneer', 15);
        await add('Fresh Cream', 15);
        await add('Kasoori Methi', 1);
        await add('K-801 ROYAL PUNCH', 1);
        await add('Kitchen King Masala', 1);
        await add('Water/Chicken Stock', 40);
      }

      await Recipe.findOneAndUpdate(
        { targetModel: 'Dish', targetId: dish._id, userId },
        { targetYield: 1, operationalYield: 1, ingredients: dishRecipeIngs },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'Chicken items injected successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
