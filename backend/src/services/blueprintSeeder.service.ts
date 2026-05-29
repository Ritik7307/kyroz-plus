import mongoose from 'mongoose';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Packaging from '../models/Packaging';
import Dish from '../models/Dish';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

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
    { code: 'RM_CHICKEN_WINGS', name: 'Chicken Wings', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 200 },
    { code: 'RM_KETCHUP', name: 'Ketchup', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 100 },
    { code: 'RM_C503', name: 'C-503 Velvet Glaze', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_LIQUID_CHEESE', name: 'Liquid Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_BREAD', name: 'Bread', category: 'Bakery', purchaseUnit: 'loaf', consumptionUnit: 'slices', conversionFactor: 20, currentStock: 50, costPerPurchaseUnit: 40 },
    { code: 'RM_MAIN_FILLING', name: 'Main Filling', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CHEESE', name: 'Cheese Slice', category: 'Dairy', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 50, currentStock: 100, costPerPurchaseUnit: 400 },
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
    { code: 'RM_PASTA_RAW', name: 'Pasta Penne / Fusilli Raw', category: 'Grain', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 100 },
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
    { code: 'RM_MUTTON_RAW', name: 'Mutton Raw', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 600 },
    
    // New Raw Materials
    { code: 'RM_CHEESE_BLEND', name: 'Cheese Blend', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 450 },
    { code: 'RM_PANEER_RAW', name: 'Paneer Raw', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_CORN_RAW', name: 'Corn Raw', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 80 },
    { code: 'RM_FRIES_RAW', name: 'Fries Raw', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 150 },
    { code: 'RM_C502_GRILL_DUST', name: 'C-502 Grill Dust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_C507_SNOW_BASE', name: 'C-507 Snow Base', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 400 },
    { code: 'RM_C508_COCOA_BASE', name: 'C-508 Cocoa Base', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 450 },
    { code: 'RM_CHICKEN_MINCE', name: 'Chicken Mince', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 240 },
    { code: 'RM_MANGO_SYRUP', name: 'Mango Syrup', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_HAZELNUT_SYRUP', name: 'Hazelnut Syrup', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_COFFEE_POWDER', name: 'Coffee Powder', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_OREO_ADDON', name: 'Oreo', category: 'Premix', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 5, currentStock: 100, costPerPurchaseUnit: 20 },
    { code: 'RM_KITKAT_ADDON', name: 'KitKat', category: 'Premix', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 5, currentStock: 100, costPerPurchaseUnit: 30 },
    { code: 'RM_CHICKEN_BREAST', name: 'Chicken Breast', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 280 }
  ];

  const rmIds: any = {};
  for (const rm of rmData) {
    const doc = await RawMaterial.findOneAndUpdate(
      { code: rm.code, userId },
      { 
        $set: { 
          name: rm.name,
          category: rm.category,
          purchaseUnit: rm.purchaseUnit,
          consumptionUnit: rm.consumptionUnit,
          conversionFactor: rm.conversionFactor,
          costPerPurchaseUnit: rm.costPerPurchaseUnit
        },
        $setOnInsert: { currentStock: rm.currentStock, userId }
      },
      { upsert: true, new: true }
    );
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
    { code: 'PKG_FOIL', name: 'Foil', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_DOSA_BOX', name: 'Dosa Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    
    // New Packaging
    { code: 'PKG_CHILLI_SACHET', name: 'Chilli Flakes Sachet', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_OREGANO_SACHET', name: 'Oregano Sachet', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_FORK', name: 'Fork', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_VADA_BOX', name: 'Vada Box', unit: 'pcs', currentStock: 500, costPerUnit: 7 },
    { code: 'PKG_BUTTER_PAPER', name: 'Butter Paper', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_BURGER_WRAP', name: 'Burger Wrap Paper', unit: 'pcs', currentStock: 1000, costPerUnit: 1.0 }
  ];

  const pkgIds: any = {};
  for (const pkg of pkgData) {
    const doc = await Packaging.findOneAndUpdate(
      { code: pkg.code, userId },
      { 
        $set: { 
          name: pkg.name,
          unit: pkg.unit,
          costPerUnit: pkg.costPerUnit
        },
        $setOnInsert: { currentStock: pkg.currentStock, userId }
      },
      { upsert: true, new: true }
    );
    pkgIds[pkg.code] = doc._id;
  }

  // SFGs
  const sfgData = [
    { code: 'SFG_RED_SAUCE', name: 'Red Sauce Base', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_WHITE_SAUCE', name: 'White Sauce Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 15 },
    { code: 'SFG_PIZZA_DOUGH', name: 'Pizza Dough', batchYield: 1650, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.18 },
    { code: 'SFG_PIZZA_DOUGH_PERSONAL', name: 'Personal Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 25 },
    { code: 'SFG_PIZZA_DOUGH_MEDIUM', name: 'Medium Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 40 },
    { code: 'SFG_PIZZA_DOUGH_LARGE', name: 'Large Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 55 },
    { code: 'SFG_GARLIC_BUTTER', name: 'Garlic Butter Spread', batchYield: 12, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.40 },
    { code: 'SFG_HERB_GARLIC_MAYO', name: 'Herb Garlic Mayo', batchYield: 20, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_CREAMY_VELVET_SAUCE', name: 'Creamy Velvet Sauce', batchYield: 14, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_MARINATED_CHICK', name: 'Marinated Chicken', batchYield: 24, yieldUnit: 'portions', currentStock: 100, costPerUnit: 12 },
    { code: 'SFG_DRY_COATING', name: 'Dry Coating Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_MARINATED_CHICKEN_LEG', name: 'Marinated Chicken Leg Pieces', batchYield: 4, yieldUnit: 'portions', currentStock: 50, costPerUnit: 25 },
    { code: 'SFG_MARINATED_CHICKEN_WINGS', name: 'Marinated Chicken Wings', batchYield: 8, yieldUnit: 'portions', currentStock: 50, costPerUnit: 20 },
    { code: 'SFG_MARINATED_CHICKEN_STRIPS', name: 'Marinated Chicken for Strips', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 22 },
    { code: 'SFG_MARINATED_CHICKEN_POPCORN', name: 'Marinated Chicken for Popcorn', batchYield: 8, yieldUnit: 'portions', currentStock: 50, costPerUnit: 20 },
    { code: 'SFG_CLASSIC_BURGER_SAUCE', name: 'Classic Burger Sauce', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce', batchYield: 350, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.22 },
    { code: 'SFG_SPICY_BURGER_SAUCE', name: 'Spicy Burger Sauce', batchYield: 300, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.25 },
    { code: 'SFG_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip', batchYield: 12, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.35 },
    { code: 'SFG_CORN_FILLING', name: 'Corn Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.15 },
    { code: 'SFG_CHICKEN_FILLING', name: 'Chicken Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.30 },
    { code: 'SFG_BOILED_PASTA', name: 'Boiled Pasta', batchYield: 2500, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.05 },
    { code: 'SFG_PERI_PERI_SEASONING', name: 'Peri Peri Seasoning Portions', batchYield: 200, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 1.75 },
    { code: 'SFG_ONION_RAVA_BATTER', name: 'Onion Rava Dosa Batter', batchYield: 3000, yieldUnit: 'gm', currentStock: 7000, costPerUnit: 0.08 },
    { code: 'SFG_RAVA_BATTER_SMALL', name: 'Small Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_RAVA_BATTER_REGULAR', name: 'Regular Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 14 },
    { code: 'SFG_RAVA_BATTER_LARGE', name: 'Large Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 18 },
    { code: 'SFG_VEG_PATTY_MIX', name: 'Veg Patty Mix', batchYield: 1060, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_CHICKEN_PATTY_MIX', name: 'Chicken Patty Mix', batchYield: 1075, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_PATTY_MIX', name: 'Paneer Patty Mix', batchYield: 1065, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_ALOO_PATTY', name: 'Aloo Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 12 },
    { code: 'SFG_VEG_PATTY', name: 'Veg Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_PANEER_PATTY', name: 'Paneer Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 25 },
    { code: 'SFG_CHICKEN_PATTY', name: 'Chicken Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 30 },
    { code: 'SFG_ZINGER_PATTY', name: 'Zinger Patty', batchYield: 14, yieldUnit: 'pieces', currentStock: 100, costPerUnit: 35 },
    { code: 'SFG_COLD_COFFEE_BASE', name: 'Cold Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 15 },
    { code: 'SFG_SHAKE_BASE', name: 'Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 12 },
    { code: 'SFG_HOT_COFFEE_BASE', name: 'Hot Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_WHITE_SHAKE_BASE', name: 'White Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_DARK_SHAKE_BASE', name: 'Dark Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 18 },
    { code: 'SFG_UTTAPAM_BATTER_NEW', name: 'Uttapam Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_UTTAPAM_BATTER_SMALL', name: 'Small Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_UTTAPAM_BATTER_REGULAR', name: 'Regular Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 14 },
    { code: 'SFG_UTTAPAM_BATTER_LARGE', name: 'Large Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 18 },
    { code: 'SFG_UTTAPAM_TOPPING', name: 'Uttapam Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_COCONUT_CHUTNEY', name: 'Coconut Chutney', batchYield: 87, yieldUnit: 'portions', currentStock: 2000, costPerUnit: 0.08 },
    { code: 'SFG_RED_KARA_CHUTNEY', name: 'Red Kara Chutney Base', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_RED_CHUTNEY_PORTION', name: 'Red Chutney portion', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 2 },
    { code: 'SFG_PREMIUM_SAMBHAR', name: 'Premium Sambhar Base', batchYield: 10000, yieldUnit: 'ml', currentStock: 10000, costPerUnit: 0.04 },
    { code: 'SFG_SAMBHAR_PORTION', name: 'Sambhar portion', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 3 },
    { code: 'SFG_BIRYANI_BATCH', name: 'Shahi Lucknowi Biryani Batch', batchYield: 9, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    { code: 'SFG_MANDI_BATCH', name: 'White Mandi Batch (Chicken)', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    { code: 'SFG_MANDI_BATCH_MUTTON', name: 'White Mandi Batch (Mutton)', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 60 },
    { code: 'SFG_IDLI_BATTER', name: 'Idli Batter', batchYield: 2200, yieldUnit: 'gm', currentStock: 4400, costPerUnit: 0.07 },
    { code: 'SFG_DOSA_BATTER', name: 'Dosa Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_ALOO_MASALA', name: 'Aloo Masala Stuffing', batchYield: 1270, yieldUnit: 'gm', currentStock: 2540, costPerUnit: 0.05 },
    { code: 'SFG_VADA_BATTER', name: 'Medu Vada Batter', batchYield: 18, yieldUnit: 'portions', currentStock: 36, costPerUnit: 9 },
    
    // New SFGs
    { code: 'SFG_TOPPING_MIX', name: 'Pizza Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_TOPPING', name: 'Paneer Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_VEG_FILLING', name: 'Veg Sandwich Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_FILLING', name: 'Paneer Sandwich Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_FIRE_DUST_FRIES', name: 'Fire Dust portion for Fries', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 4.2 },
    { code: 'SFG_FIRE_DUST_GRILL', name: 'Fire Dust portion for Grills', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 3.5 },
    { code: 'SFG_FIRE_DUST_PIZZA', name: 'Fire Dust portion for Pizzas', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 0.9 },
    { code: 'SFG_FIRE_DUST_WRAP', name: 'Fire Dust portion for Wraps', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 1.25 }
  ];

  const sfgIds: any = {};
  for (const sfg of sfgData) {
    const doc = await SemiFinishedGood.findOneAndUpdate(
      { code: sfg.code, userId },
      { 
        $set: { 
          name: sfg.name,
          batchYield: sfg.batchYield, 
          yieldUnit: sfg.yieldUnit,
          costPerUnit: sfg.costPerUnit
        },
        $setOnInsert: { currentStock: sfg.currentStock, userId } 
      },
      { upsert: true, new: true }
    );
    sfgIds[sfg.code] = doc._id;
  }

  // SFG Recipes Mappings (for recursive costing)
  const sfgRecipeMappings: Record<string, { itemModel: 'RawMaterial' | 'SemiFinishedGood'; code: string; quantity: number }[]> = {
    'SFG_VEG_PATTY_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 60 }
    ],
    'SFG_CHICKEN_PATTY_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_MINCE', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 75 }
    ],
    'SFG_PANEER_PATTY_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 65 }
    ],
    'SFG_ALOO_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 5 }
    ],
    'SFG_VEG_PATTY': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY_MIX', quantity: 75 }
    ],
    'SFG_CHICKEN_PATTY': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY_MIX', quantity: 77 }
    ],
    'SFG_PANEER_PATTY': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_PATTY_MIX', quantity: 76 }
    ],
    'SFG_ZINGER_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_UTTAPAM_BATTER_NEW': [
      { itemModel: 'RawMaterial', code: 'RM_S305_STEAM', quantity: 1000 }
    ],
    'SFG_UTTAPAM_BATTER_SMALL': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 95 }
    ],
    'SFG_UTTAPAM_BATTER_REGULAR': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 130 }
    ],
    'SFG_UTTAPAM_BATTER_LARGE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 170 }
    ],
    'SFG_DOSA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_COASTAL_CRUST', quantity: 1000 }
    ],
    'SFG_VADA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S304_CRUNCH', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 200 }
    ],
    'SFG_COCONUT_CHUTNEY': [
      { itemModel: 'RawMaterial', code: 'RM_S307_KERNEL', quantity: 1000 }
    ],
    'SFG_RED_KARA_CHUTNEY': [
      { itemModel: 'RawMaterial', code: 'RM_S306_TANGY', quantity: 1000 }
    ],
    'SFG_RED_CHUTNEY_PORTION': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 40 }
    ],
    'SFG_PREMIUM_SAMBHAR': [
      { itemModel: 'RawMaterial', code: 'RM_S308_LENTIL', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 1500 }
    ],
    'SFG_SAMBHAR_PORTION': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 80 }
    ],
    'SFG_ALOO_MASALA': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_S302_TEMPER', quantity: 120 }
    ],
    'SFG_ONION_RAVA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S303_RAVA', quantity: 1000 }
    ],
    'SFG_RAVA_BATTER_SMALL': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_ONION_RAVA_BATTER', quantity: 85 }
    ],
    'SFG_RAVA_BATTER_REGULAR': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_ONION_RAVA_BATTER', quantity: 115 }
    ],
    'SFG_RAVA_BATTER_LARGE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_ONION_RAVA_BATTER', quantity: 140 }
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
    'SFG_MANDI_BATCH_MUTTON': [
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_RICE_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_B404A_PREMIX', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_B404B_PREMIX', quantity: 150 }
    ],
    'SFG_IDLI_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S305_STEAM', quantity: 1000 }
    ],
    'SFG_RED_SAUCE': [{ itemModel: 'RawMaterial', code: 'RM_C506', quantity: 1000 }],
    'SFG_WHITE_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 }
    ],
    'SFG_PIZZA_DOUGH': [
      { itemModel: 'RawMaterial', code: 'RM_C501', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 50 }
    ],
    'SFG_PIZZA_DOUGH_PERSONAL': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 150 }
    ],
    'SFG_PIZZA_DOUGH_MEDIUM': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 240 }
    ],
    'SFG_PIZZA_DOUGH_LARGE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 350 }
    ],
    'SFG_GARLIC_BUTTER': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C504', quantity: 40 }
    ],
    'SFG_HERB_GARLIC_MAYO': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_C504', quantity: 30 }
    ],
    'SFG_CREAMY_VELVET_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 30 }
    ],
    'SFG_CLASSIC_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_KETCHUP', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 30 }
    ],
    'SFG_TANDOORI_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 50 }
    ],
    'SFG_SPICY_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 50 }
    ],
    'SFG_CHEESY_GARLIC_DIP': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LIQUID_CHEESE', quantity: 50 }
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
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_MARINATED_CHICKEN_WINGS': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_WINGS', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_MARINATED_CHICKEN_STRIPS': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_MARINATED_CHICKEN_POPCORN': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_BOILED_PASTA': [
      { itemModel: 'RawMaterial', code: 'RM_PASTA_RAW', quantity: 1000 }
    ],
    'SFG_TOPPING_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 1000 }
    ],
    'SFG_PANEER_TOPPING': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 1000 }
    ],
    'SFG_CORN_FILLING': [
      { itemModel: 'RawMaterial', code: 'RM_CORN_RAW', quantity: 1000 }
    ],
    'SFG_VEG_FILLING': [
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 1000 }
    ],
    'SFG_PANEER_FILLING': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 1000 }
    ],
    'SFG_CHICKEN_FILLING': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_STRIPS', quantity: 6 }
    ],
    'SFG_FIRE_DUST_FRIES': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 12 }
    ],
    'SFG_FIRE_DUST_GRILL': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 10 }
    ],
    'SFG_FIRE_DUST_PIZZA': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 2.5 }
    ],
    'SFG_FIRE_DUST_WRAP': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 3.5 }
    ],
    'SFG_WHITE_SHAKE_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 42.5 }
    ],
    'SFG_DARK_SHAKE_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 42.5 }
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
    { name: 'Red Sauce Pasta', price: 250, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'White Sauce Pasta', price: 260, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Pink Sauce Pasta', price: 270, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Garlic Bread', price: 150, category: 'Sides', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Wings', price: 199, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_WING_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WING_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Strips', price: 219, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_STRIP_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STRIP_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Popcorn', price: 179, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_POPCORN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_POPCORN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Leg Piece', price: 149, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Classic Burger', price: 120, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Crispy Veggie Burger', price: 130, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Tandoori Burger', price: 140, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Paneer Burger', price: 150, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Classic Chicken Burger', price: 160, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Zinger Burger', price: 180, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Crispy Chicken Sandwich', price: 220, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Classic Corn Cheese Sandwich', price: 180, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Veg Grilled Club', price: 170, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Peri-Peri Paneer Sandwich', price: 195, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Single Medu Vada', price: 60, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Double Medu Vada', price: 110, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medu Vada Portion', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Peri Peri Fries', price: 120, category: 'Sides', packagingLogic: { takeaway: [pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Onion Rava Dosa', price: 140, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Small Onion Rava Dosa', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Onion Rava Dosa', price: 130, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Onion Rava Dosa', price: 170, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },

    { name: 'Veg Wrap', price: 110, category: 'Wraps', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Wrap', price: 140, category: 'Wraps', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Club Sandwich', price: 150, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Beverage System
    { name: 'Cold Coffee', price: 120, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chocolate Shake', price: 140, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Vanilla Shake', price: 130, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Strawberry Shake', price: 130, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mango Shake', price: 140, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Oreo Shake', price: 150, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'KitKat Shake', price: 160, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Hazelnut Shake', price: 150, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Hot Coffee', price: 90, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mocha Frappe', price: 160, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Uttapams
    { name: 'Mini Uttapam', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Uttapam', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Uttapam', price: 150, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Small Mix Veg Uttapam', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Mix Veg Uttapam', price: 130, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Mix Veg Uttapam', price: 170, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Mandi & Biryani
    { name: 'Shahi Lucknowi Biryani', price: 280, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Kyroz Indo Arabic White Mandi', price: 260, category: 'Mandi', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Kyroz Mutton Mandi', price: 450, category: 'Mandi', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Idlis
    { name: 'Mini Rice Idli', price: 60, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Rice Idli', price: 80, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Rice Idli', price: 100, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Dosas
    { name: 'Small Masala Dosa', price: 80, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Masala Dosa', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Masala Dosa', price: 160, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },

    // Pizza variations
    { name: 'Personal Classic Veg Pizza', price: 180, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Classic Veg Pizza', price: 280, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Classic Veg Pizza', price: 380, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Corn Cheese Pizza', price: 190, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Corn Cheese Pizza', price: 295, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Corn Cheese Pizza', price: 399, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Farmhouse Pizza', price: 220, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Farmhouse Pizza', price: 320, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Farmhouse Pizza', price: 420, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Paneer Pizza', price: 240, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Paneer Pizza', price: 340, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Paneer Pizza', price: 440, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Chicken Pizza', price: 260, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Chicken Pizza', price: 360, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Chicken Pizza', price: 460, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } }
  ];

  const recipeMappings: Record<string, { itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Packaging'; code: string; quantity: number }[]> = {
    'Red Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 190 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 10 }
    ],
    'White Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 190 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SAUCE', quantity: 1 }
    ],
    'Pink Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 190 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 25 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SAUCE', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 5 }
    ],
    'Large Farmhouse Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 70 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 60 }
    ],
    'Personal Farmhouse Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 65 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 25 }
    ],
    'Medium Farmhouse Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 40 }
    ],
    'Personal Classic Veg Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 65 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 25 }
    ],
    'Medium Classic Veg Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 40 }
    ],
    'Large Classic Veg Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 70 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 60 }
    ],
    'Personal Corn Cheese Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 65 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 25 }
    ],
    'Medium Corn Cheese Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 40 }
    ],
    'Large Corn Cheese Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 70 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 60 }
    ],
    'Personal Paneer Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 65 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_TOPPING', quantity: 25 }
    ],
    'Medium Paneer Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_TOPPING', quantity: 40 }
    ],
    'Large Paneer Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 70 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_TOPPING', quantity: 60 }
    ],
    'Personal Chicken Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 65 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 25 }
    ],
    'Medium Chicken Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 40 }
    ],
    'Large Chicken Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 70 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 60 }
    ],
    'Garlic Bread': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_GARLIC_BUTTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESY_GARLIC_DIP', quantity: 1 }
    ],
    'Chicken Wings': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_WINGS', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Chicken Strips': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_STRIPS', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Chicken Popcorn': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_POPCORN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Chicken Leg Piece': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_LEG', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Classic Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 }
    ],
    'Crispy Veggie Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 }
    ],
    'Tandoori Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TANDOORI_BURGER_SAUCE', quantity: 20 }
    ],
    'Paneer Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 }
    ],
    'Classic Chicken Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 }
    ],
    'Zinger Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ZINGER_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SPICY_BURGER_SAUCE', quantity: 20 }
    ],
    'Crispy Chicken Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_FILLING', quantity: 50 }
    ],
    'Classic Corn Cheese Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 }
    ],
    'Veg Grilled Club': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_FILLING', quantity: 50 }
    ],
    'Peri-Peri Paneer Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_FILLING', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_FIRE_DUST_WRAP', quantity: 1 }
    ],

    'Veg Wrap': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }
    ],
    'Chicken Wrap': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }
    ],
    'Club Sandwich': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 3 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }
    ],
    'Cold Coffee': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Chocolate Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CHOCO_SYRUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Vanilla Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_VANILLA_CORE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Strawberry Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_STRAWBERRY_CORE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Mango Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MANGO_SYRUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Oreo Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OREO_ADDON', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'KitKat Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KITKAT_ADDON', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Hazelnut Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HAZELNUT_SYRUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Hot Coffee': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_HOT_COFFEE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_PREMIX', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Mocha Frappe': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Mini Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_SMALL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_PORTION', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Regular Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_PORTION', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Large Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_PORTION', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Small Mix Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_SMALL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_PORTION', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Regular Mix Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_PORTION', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Large Mix Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_PORTION', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Shahi Lucknowi Biryani': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BIRYANI_BATCH', quantity: 1 }
    ],
    'Kyroz Indo Arabic White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_BATCH', quantity: 1 }
    ],
    'Kyroz Mutton Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_BATCH_MUTTON', quantity: 1 }
    ],
    'Mini Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Regular Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Large Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 170 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Medu Vada Portion': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Single Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 0.5 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Double Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Small Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 75 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Regular Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 95 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Large Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 115 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Small Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_SMALL', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 10 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Regular Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Large Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_LARGE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: 1 }
    ],
    'Peri Peri Fries': [
      { itemModel: 'RawMaterial', code: 'RM_FRIES_RAW', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_FIRE_DUST_FRIES', quantity: 1 }
    ]
  };

  for (const dish of dishData) {
    const doc = await Dish.findOneAndUpdate(
      { name: dish.name, userId }, 
      { 
        $set: { packagingLogic: dish.packagingLogic, category: dish.category, price: dish.price },
        $setOnInsert: { userId } 
      }, 
      { upsert: true, new: true }
    );
    
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

  // Seed Portion Stock (Inventory) for portion-tracked dishes
  const portionTrackedDishes = [
    { name: 'Shahi Lucknowi Biryani', yield: 9 },
    { name: 'Kyroz Indo Arabic White Mandi', yield: 6 },
    { name: 'Kyroz Mutton Mandi', yield: 6 }
  ];

  for (const track of portionTrackedDishes) {
    const dishDoc = await Dish.findOne({ name: track.name, userId });
    if (dishDoc) {
      await Inventory.findOneAndUpdate(
        { dishId: dishDoc._id, userId },
        {
          $setOnInsert: {
            platesPerPacket: track.yield,
            totalPlates: track.yield * 2,
            lowStockThreshold: 5,
            userId
          }
        },
        { upsert: true }
      );
    }
  }
};
