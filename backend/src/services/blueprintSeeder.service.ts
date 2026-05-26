import mongoose from 'mongoose';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Packaging from '../models/Packaging';
import Dish from '../models/Dish';
import Recipe from '../models/Recipe';

export const seedBlueprints = async (userId: string | mongoose.Types.ObjectId): Promise<void> => {
  // Raw Materials
  const rmData = [
    { code: 'RM_C506', name: 'C-506 Marinara Core', category: 'Sauce Core', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 250 },
    { code: 'RM_C505', name: 'C-505 Alfredo Core', category: 'Sauce Core', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 300 },
    { code: 'RM_C501', name: 'C-501 Dough Master', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 20, costPerPurchaseUnit: 180 },
    { code: 'RM_C504', name: 'C-504 Herb Infusion', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_BUTTER', name: 'Butter', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 500 },
    { code: 'RM_MILK', name: 'Milk', category: 'Dairy', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 60 },
    { code: 'RM_MAYO', name: 'Mayo', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 150 },
    { code: 'RM_C510', name: 'C-510 Zing Master', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_MAIDA', name: 'Maida', category: 'Flour', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 40 },
    { code: 'RM_FRYING_OIL', name: 'Frying Oil', category: 'Fat', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 120 },
    { code: 'RM_CHICKEN_LEG', name: 'Chicken Leg Pieces', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 220 },
    { code: 'RM_KETCHUP', name: 'Ketchup', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 100 },
    { code: 'RM_C503', name: 'C-503 Velvet Glaze', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_LIQUID_CHEESE', name: 'Liquid Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_BREAD', name: 'Bread', category: 'Bakery', purchaseUnit: 'loaf', consumptionUnit: 'slices', conversionFactor: 20, currentStock: 50, costPerPurchaseUnit: 40 },
    { code: 'RM_MAIN_FILLING', name: 'Main Filling', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CHEESE', name: 'Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'slice', conversionFactor: 50, currentStock: 10, costPerPurchaseUnit: 400 },
    { code: 'RM_C509', name: 'C-509 Fire Dust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_PATTY_MIX', name: 'Base Patty Mix', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_BREADCRUMBS', name: 'Breadcrumbs / Coating', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_COFFEE_PREMIX', name: 'Coffee Premix', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_CHOCO_SYRUP', name: 'Chocolate Syrup', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 240 },
    { code: 'RM_VANILLA_CORE', name: 'Vanilla Flavor Core', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_STRAWBERRY_CORE', name: 'Strawberry Flavor Core', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_SUGAR', name: 'Sugar', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 25000, costPerPurchaseUnit: 45 },
    { code: 'RM_COASTAL_CRUST', name: 'S-301 Coastal Crust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 90 },
    { code: 'RM_CHICKEN_RAW', name: 'Chicken Raw', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 220 },
    { code: 'RM_RICE_RAW', name: 'Rice Raw', category: 'Grain', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 80 },
    { code: 'RM_DAHI_RAW', name: 'Dahi Raw', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 60 },
    { code: 'RM_OIL_GHEE', name: 'Oil / Ghee', category: 'Fat', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 180 },
    { code: 'RM_B401_PREMIX', name: 'B-401 Premix', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_BURGER_BUN', name: 'Burger Bun', category: 'Bakery', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 6, currentStock: 100, costPerPurchaseUnit: 30 },
    { code: 'RM_WRAP_SHEET', name: 'Wrap Sheet', category: 'Bakery', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 10, currentStock: 50, costPerPurchaseUnit: 80 },
    
    // Additional Materials
    { code: 'RM_POTATO', name: 'Potato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 25000, costPerPurchaseUnit: 30 },
    { code: 'RM_S302_TEMPER', name: 'S-302 Yellow Temper', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 200 },
    { code: 'RM_S303_RAVA', name: 'S-303 Rava Pearl', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 120 },
    { code: 'RM_S304_CRUNCH', name: 'S-304 Crunch Core', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 160 },
    { code: 'RM_S305_STEAM', name: 'S-305 Steam Cloud', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 140 },
    { code: 'RM_S306_TANGY', name: 'S-306 Tangy Tropic', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 190 },
    { code: 'RM_S307_KERNEL', name: 'S-307 Kerala Kernel', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 220 },
    { code: 'RM_S308_LENTIL', name: 'S-308 Lentil Lava', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_MIXED_VEG', name: 'Mixed Veggies', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 60 },
    { code: 'RM_B404A_PREMIX', name: 'B-404 A Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 160 },
    { code: 'RM_B404B_PREMIX', name: 'B-404 B Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 140 },
    { code: 'RM_MUTTON_RAW', name: 'Mutton Raw', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 600 }
  ];

  const rmIds: any = {};
  for (const rm of rmData) {
    const doc = await RawMaterial.findOneAndUpdate({ code: rm.code, userId }, { $setOnInsert: { ...rm, userId } }, { upsert: true, new: true });
    rmIds[rm.code] = doc._id;
  }

  // Packaging
  const pkgData = [
    { code: 'PKG_PIZZA_BOX', name: 'Pizza Box', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_PASTA_BOWL', name: 'Pasta Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_DIP_CUP', name: 'Dip Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_WING_BOX', name: 'Wing Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_STRIP_BOX', name: 'Strip Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_POPCORN_BOX', name: 'Popcorn Box', unit: 'pcs', currentStock: 500, costPerUnit: 6 },
    { code: 'PKG_TISSUE', name: 'Tissue', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_CHICKEN_BOX', name: 'Chicken Box', unit: 'pcs', currentStock: 500, costPerUnit: 12 },
    { code: 'PKG_SAUCE_CUP', name: 'Sauce Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_SANDWICH_PAPER', name: 'Sandwich Paper', unit: 'pcs', currentStock: 1000, costPerUnit: 1 },
    { code: 'PKG_SANDWICH_BOX', name: 'Sandwich Box', unit: 'pcs', currentStock: 500, costPerUnit: 6 },
    { code: 'PKG_SEASONING_SACHET', name: 'Seasoning Sachet', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_BURGER_BOX', name: 'Burger Box', unit: 'pcs', currentStock: 500, costPerUnit: 5 },
    { code: 'PKG_WRAP_PAPER', name: 'Wrap Paper', unit: 'pcs', currentStock: 500, costPerUnit: 2 },
    { code: 'PKG_CARRY_BAG', name: 'Carry Bag', unit: 'pcs', currentStock: 500, costPerUnit: 3 },
    { code: 'PKG_SHAKE_CUP', name: 'Shake Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 5 },
    { code: 'PKG_LID', name: 'Lid', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_STRAW', name: 'Straw', unit: 'pcs', currentStock: 1000, costPerUnit: 0.5 },
    { code: 'PKG_UTTAPAM_BOX', name: 'Uttapam Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_CHUTNEY_CONT', name: 'Chutney Container', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_SAMBHAR_CONT', name: 'Sambhar Container', unit: 'pcs', currentStock: 1000, costPerUnit: 3 },
    { code: 'PKG_SPOON', name: 'Spoon', unit: 'pcs', currentStock: 1000, costPerUnit: 1 },
    { code: 'PKG_BIRYANI_CONT', name: 'Biryani Container', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_FOIL', name: 'Foil', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 }
  ];

  const pkgIds: any = {};
  for (const pkg of pkgData) {
    const doc = await Packaging.findOneAndUpdate({ code: pkg.code, userId }, { $setOnInsert: { ...pkg, userId } }, { upsert: true, new: true });
    pkgIds[pkg.code] = doc._id;
  }

  // SFGs
  const sfgData = [
    { code: 'SFG_RED_SAUCE', name: 'Red Sauce Base', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_WHITE_SAUCE', name: 'White Sauce Base', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.30 },
    { code: 'SFG_PIZZA_DOUGH', name: 'Pizza Dough', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.18 },
    { code: 'SFG_GARLIC_BUTTER', name: 'Garlic Butter Spread', batchYield: 240, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.40 },
    { code: 'SFG_MARINATED_CHICK', name: 'Marinated Chicken', batchYield: 24, yieldUnit: 'portions', currentStock: 100, costPerUnit: 12 },
    { code: 'SFG_DRY_COATING', name: 'Dry Coating Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_MARINATED_CHICKEN_LEG', name: 'Marinated Chicken Leg Pieces', batchYield: 4, yieldUnit: 'portions', currentStock: 50, costPerUnit: 25 },
    { code: 'SFG_CLASSIC_BURGER_SAUCE', name: 'Classic Burger Sauce', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce', batchYield: 350, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.22 },
    { code: 'SFG_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.35 },
    { code: 'SFG_CORN_FILLING', name: 'Corn Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.15 },
    { code: 'SFG_CHICKEN_FILLING', name: 'Chicken Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.30 },
    { code: 'SFG_BOILED_PASTA', name: 'Boiled Pasta', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.05 },
    { code: 'SFG_PERI_PERI_SEASONING', name: 'Peri Peri Seasoning Portions', batchYield: 200, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 1.75 },
    { code: 'SFG_ONION_RAVA_BATTER', name: 'Onion Rava Dosa Batter', batchYield: 3500, yieldUnit: 'gm', currentStock: 7000, costPerUnit: 0.08 },
    { code: 'SFG_VEG_PATTY', name: 'Veg Patty', batchYield: 12, yieldUnit: 'pieces', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_PANEER_PATTY', name: 'Paneer Patty', batchYield: 10, yieldUnit: 'pieces', currentStock: 100, costPerUnit: 25 },
    { code: 'SFG_CHICKEN_PATTY', name: 'Chicken Patty', batchYield: 11, yieldUnit: 'pieces', currentStock: 100, costPerUnit: 30 },
    { code: 'SFG_COLD_COFFEE_BASE', name: 'Cold Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 15 },
    { code: 'SFG_SHAKE_BASE', name: 'Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 12 },
    { code: 'SFG_HOT_COFFEE_BASE', name: 'Hot Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_UTTAPAM_BATTER_NEW', name: 'Uttapam Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_UTTAPAM_TOPPING', name: 'Uttapam Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_COCONUT_CHUTNEY', name: 'Coconut Chutney', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.08 },
    { code: 'SFG_RED_KARA_CHUTNEY', name: 'Red Kara Chutney', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.06 },
    { code: 'SFG_PREMIUM_SAMBHAR', name: 'Premium Sambhar', batchYield: 5000, yieldUnit: 'ml', currentStock: 10000, costPerUnit: 0.04 },
    { code: 'SFG_BIRYANI_BATCH', name: 'Shahi Lucknowi Biryani Batch', batchYield: 9, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    
    // Additional SFGs for Mandi, Idlis, and Masala Dosas
    { code: 'SFG_MANDI_BATCH', name: 'White Mandi Batch', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    { code: 'SFG_IDLI_BATTER', name: 'Idli Batter', batchYield: 2200, yieldUnit: 'gm', currentStock: 4400, costPerUnit: 0.07 },
    { code: 'SFG_DOSA_BATTER', name: 'Dosa Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_ALOO_MASALA', name: 'Aloo Masala Stuffing', batchYield: 1270, yieldUnit: 'gm', currentStock: 2540, costPerUnit: 0.05 },
    { code: 'SFG_VADA_BATTER', name: 'Medu Vada Batter', batchYield: 18, yieldUnit: 'portions', currentStock: 36, costPerUnit: 9 }
  ];

  const sfgIds: any = {};
  for (const sfg of sfgData) {
    const doc = await SemiFinishedGood.findOneAndUpdate({ code: sfg.code, userId }, { $setOnInsert: { ...sfg, userId } }, { upsert: true, new: true });
    sfgIds[sfg.code] = doc._id;
  }

  // SFG Recipes Mappings (for recursive costing)
  const sfgRecipeMappings: Record<string, { itemModel: 'RawMaterial' | 'SemiFinishedGood'; code: string; quantity: number }[]> = {
    'SFG_VEG_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_PATTY_MIX', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BREADCRUMBS', quantity: 200 }
    ],
    'SFG_PANEER_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_PATTY_MIX', quantity: 800 },
      { itemModel: 'RawMaterial', code: 'RM_BREADCRUMBS', quantity: 200 }
    ],
    'SFG_CHICKEN_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_PATTY_MIX', quantity: 900 },
      { itemModel: 'RawMaterial', code: 'RM_BREADCRUMBS', quantity: 150 }
    ],
    'SFG_UTTAPAM_BATTER_NEW': [
      { itemModel: 'RawMaterial', code: 'RM_COASTAL_CRUST', quantity: 1000 }
    ],
    'SFG_DOSA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_COASTAL_CRUST', quantity: 1000 }
    ],
    'SFG_VADA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S304_CRUNCH', quantity: 1000 }
    ],
    'SFG_COCONUT_CHUTNEY': [
      { itemModel: 'RawMaterial', code: 'RM_S307_KERNEL', quantity: 1000 }
    ],
    'SFG_RED_KARA_CHUTNEY': [
      { itemModel: 'RawMaterial', code: 'RM_S306_TANGY', quantity: 1000 }
    ],
    'SFG_PREMIUM_SAMBHAR': [
      { itemModel: 'RawMaterial', code: 'RM_S308_LENTIL', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 1500 }
    ],
    'SFG_ALOO_MASALA': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_S302_TEMPER', quantity: 120 }
    ],
    'SFG_ONION_RAVA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S303_RAVA', quantity: 1000 }
    ],
    'SFG_BIRYANI_BATCH': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_RICE_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_DAHI_RAW', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_B401_PREMIX', quantity: 150 }
    ],
    'SFG_MANDI_BATCH': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_RICE_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_B404A_PREMIX', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_B404B_PREMIX', quantity: 150 }
    ],
    'SFG_IDLI_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S305_STEAM', quantity: 1000 }
    ],
    // SFG cores mappings
    'SFG_RED_SAUCE': [{ itemModel: 'RawMaterial', code: 'RM_C506', quantity: 1000 }],
    'SFG_WHITE_SAUCE': [{ itemModel: 'RawMaterial', code: 'RM_C505', quantity: 1000 }],
    'SFG_PIZZA_DOUGH': [{ itemModel: 'RawMaterial', code: 'RM_C501', quantity: 1000 }],
    'SFG_GARLIC_BUTTER': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C504', quantity: 40 }
    ],
    'SFG_MARINATED_CHICK': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 100 }
    ],
    'SFG_DRY_COATING': [
      { itemModel: 'RawMaterial', code: 'RM_MAIDA', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 100 }
    ],
    'SFG_MARINATED_CHICKEN_LEG': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_LEG', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 100 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings)) {
    const sfgId = sfgIds[sfgCode];
    if (!sfgId) continue;
    
    const sfgItem = sfgData.find(s => s.code === sfgCode);
    const yieldQty = sfgItem ? sfgItem.batchYield : 1;

    const mapping = sfgRecipeMappings[sfgCode];
    const ingredients = mapping.map(m => {
      const id = m.itemModel === 'RawMaterial' ? rmIds[m.code] : sfgIds[m.code];
      return {
        itemModel: m.itemModel,
        itemId: id,
        quantity: m.quantity
      };
    }).filter(ing => ing.itemId !== undefined);

    await Recipe.findOneAndUpdate(
      { targetModel: 'SemiFinishedGood', targetId: sfgId, userId },
      {
        $set: {
          targetYield: yieldQty,
          operationalYield: yieldQty,
          ingredients
        },
        $setOnInsert: {
          userId
        }
      },
      { upsert: true }
    );
  }

  // Dishes
  const dishData = [
    { name: 'Red Sauce Pasta', price: 250, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL']], delivery: [pkgIds['PKG_PASTA_BOWL']], dineIn: [] } },
    { name: 'Large Farmhouse Pizza', price: 450, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX']], delivery: [pkgIds['PKG_PIZZA_BOX']], dineIn: [] } },
    { name: 'Garlic Bread', price: 150, category: 'Sides', packagingLogic: { takeaway: [], delivery: [], dineIn: [] } },
    { name: 'Chicken Wings', price: 199, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_WING_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_WING_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'Chicken Strips', price: 219, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_STRIP_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_STRIP_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'Chicken Popcorn', price: 179, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_POPCORN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_POPCORN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'Chicken Leg Piece', price: 149, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_CHICKEN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'Zinger Burger', price: 180, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_SAUCE_CUP']], delivery: [pkgIds['PKG_SAUCE_CUP']], dineIn: [] } },
    { name: 'Tandoori Burger', price: 190, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_SAUCE_CUP']], delivery: [pkgIds['PKG_SAUCE_CUP']], dineIn: [] } },
    { name: 'Crispy Chicken Sandwich', price: 220, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'Classic Corn Cheese Sandwich', price: 180, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'White Sauce Pasta', price: 260, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'Single Medu Vada', price: 60, category: 'South Indian', packagingLogic: { takeaway: [], delivery: [], dineIn: [] } },
    { name: 'Double Medu Vada', price: 110, category: 'South Indian', packagingLogic: { takeaway: [], delivery: [], dineIn: [] } },
    { name: 'Peri Peri Fries', price: 120, category: 'Sides', packagingLogic: { takeaway: [pkgIds['PKG_SEASONING_SACHET']], delivery: [pkgIds['PKG_SEASONING_SACHET']], dineIn: [] } },
    { name: 'Onion Rava Dosa', price: 140, category: 'South Indian', packagingLogic: { takeaway: [], delivery: [], dineIn: [] } },
    { name: 'Veg Burger', price: 120, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Paneer Burger', price: 150, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Burger', price: 160, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Veg Wrap', price: 110, category: 'Wraps', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Wrap', price: 140, category: 'Wraps', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Club Sandwich', price: 150, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE']], dineIn: [] } },
    { name: 'Cold Coffee', price: 120, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chocolate Shake', price: 140, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Vanilla Shake', price: 130, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Strawberry Shake', price: 130, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Hot Coffee', price: 90, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mocha Frappe', price: 160, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mini Uttapam', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Uttapam', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Uttapam', price: 150, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Shahi Lucknowi Biryani', price: 280, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Additional Dishes (Mandi, Idli, Dosa)
    { name: 'Kyroz Indo Arabic White Mandi', price: 260, category: 'Mandi', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mini Rice Idli', price: 60, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Rice Idli', price: 80, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Rice Idli', price: 100, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medu Vada Portion', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Small Masala Dosa', price: 80, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Masala Dosa', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Masala Dosa', price: 160, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } }
  ];

  const recipeMappings: Record<string, { itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Packaging'; code: string; quantity: number }[]> = {
    'Red Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 150 },
      { itemModel: 'Packaging', code: 'PKG_PASTA_BOWL', quantity: 1 }
    ],
    'White Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SAUCE', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 150 },
      { itemModel: 'Packaging', code: 'PKG_PASTA_BOWL', quantity: 1 }
    ],
    'Large Farmhouse Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 300 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 150 },
      { itemModel: 'Packaging', code: 'PKG_PIZZA_BOX', quantity: 1 }
    ],
    'Garlic Bread': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_GARLIC_BUTTER', quantity: 30 }
    ],
    'Chicken Wings': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 },
      { itemModel: 'Packaging', code: 'PKG_WING_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_DIP_CUP', quantity: 1 }
    ],
    'Chicken Strips': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 },
      { itemModel: 'Packaging', code: 'PKG_STRIP_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_DIP_CUP', quantity: 1 }
    ],
    'Chicken Popcorn': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 },
      { itemModel: 'Packaging', code: 'PKG_POPCORN_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_DIP_CUP', quantity: 1 }
    ],
    'Chicken Leg Piece': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_LEG', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 },
      { itemModel: 'Packaging', code: 'PKG_CHICKEN_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_DIP_CUP', quantity: 1 }
    ],
    'Zinger Burger': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_BURGER_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Tandoori Burger': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TANDOORI_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_BURGER_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Crispy Chicken Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_FILLING', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_SANDWICH_PAPER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_SANDWICH_BOX', quantity: 1 }
    ],
    'Classic Corn Cheese Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_SANDWICH_PAPER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_SANDWICH_BOX', quantity: 1 }
    ],
    'Veg Burger': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_BURGER_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Paneer Burger': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_BURGER_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Chicken Burger': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_BURGER_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Veg Wrap': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_WRAP_PAPER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Chicken Wrap': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_WRAP_PAPER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Club Sandwich': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 3 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SANDWICH_PAPER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_SANDWICH_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_TISSUE', quantity: 1 }
    ],
    'Cold Coffee': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_COLD_COFFEE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_PREMIX', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SHAKE_CUP', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_LID', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_STRAW', quantity: 1 }
    ],
    'Chocolate Shake': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_CHOCO_SYRUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SHAKE_CUP', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_LID', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_STRAW', quantity: 1 }
    ],
    'Vanilla Shake': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_VANILLA_CORE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SHAKE_CUP', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_LID', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_STRAW', quantity: 1 }
    ],
    'Strawberry Shake': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_STRAWBERRY_CORE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SHAKE_CUP', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_LID', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_STRAW', quantity: 1 }
    ],
    'Hot Coffee': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_HOT_COFFEE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_PREMIX', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 },
      { itemModel: 'Packaging', code: 'PKG_SHAKE_CUP', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_LID', quantity: 1 }
    ],
    'Mocha Frappe': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_CHOCO_SYRUP', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_PREMIX', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SHAKE_CUP', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_LID', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_STRAW', quantity: 1 }
    ],
    'Mini Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Regular Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 150 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Large Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 170 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 200 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Shahi Lucknowi Biryani': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BIRYANI_BATCH', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_BIRYANI_CONT', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_FOIL', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_SPOON', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CARRY_BAG', quantity: 1 }
    ],
    'Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_ONION_RAVA_BATTER', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 15 }
    ],
    'Single Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Double Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 150 }
    ],
    'Medu Vada Portion': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 80 }
    ],
    'Kyroz Indo Arabic White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_BATCH', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_BIRYANI_CONT', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_FOIL', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_SPOON', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CARRY_BAG', quantity: 1 }
    ],
    'Mini Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Regular Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 150 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Large Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 170 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 200 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Small Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 75 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 80 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Regular Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 95 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 80 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ],
    'Large Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 115 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 80 },
      { itemModel: 'Packaging', code: 'PKG_UTTAPAM_BOX', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_CHUTNEY_CONT', quantity: 2 },
      { itemModel: 'Packaging', code: 'PKG_SAMBHAR_CONT', quantity: 1 }
    ]
  };

  for (const dish of dishData) {
    const doc = await Dish.findOneAndUpdate({ name: dish.name, userId }, { $setOnInsert: { ...dish, userId } }, { upsert: true, new: true });
    
    // Create recipe mapping
    const mapping = recipeMappings[dish.name];
    if (mapping) {
      const ingredients = mapping.map(m => {
        let id;
        if (m.itemModel === 'RawMaterial') {
          id = rmIds[m.code];
        } else if (m.itemModel === 'SemiFinishedGood') {
          id = sfgIds[m.code];
        } else if (m.itemModel === 'Packaging') {
          id = pkgIds[m.code];
        }
        return {
          itemModel: m.itemModel,
          itemId: id,
          quantity: m.quantity
        };
      }).filter(ing => ing.itemId !== undefined);

      await Recipe.findOneAndUpdate(
        { targetModel: 'Dish', targetId: doc._id, userId },
        {
          $set: {
            targetYield: 1,
            operationalYield: 1,
            ingredients
          },
          $setOnInsert: {
            userId
          }
        },
        { upsert: true }
      );
    }
  }
};
