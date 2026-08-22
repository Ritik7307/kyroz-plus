const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const rmInjectionStr = `    // T-600 Series Tandoor System
    { code: 'RM_T604', name: 'T-604 Crimson Coat', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_T605', name: 'T-605 Silk Infusion', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 280 },
    { code: 'RM_T606', name: 'T-606 Mince Master', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 150 },
    { code: 'RM_T607', name: 'T-607 Arabian Smoke', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 180 },
    { code: 'RM_T601', name: 'T-601 Classic Char', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 120 },
    { code: 'RM_T602', name: 'T-602 White Velvet', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 130 },
    { code: 'RM_T603', name: 'T-603 Verdant Rub', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 140 },
    { code: 'RM_ACHARI_PASTE', name: 'Achari Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 300 },
    { code: 'RM_RAW_CHICKEN_WHOLE', name: 'Raw Chicken Whole Bird', category: 'Meat', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 160 },
    { code: 'RM_CHICKEN_FAT', name: 'Chicken Fat', category: 'Fat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_DEWATERED_ONION', name: 'Dewatered Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_BESAN', name: 'Besan', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 70 },
    { code: 'RM_SOYA_CHAAP', name: 'Soya Chaap', category: 'Protein', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_BUTTON_MUSHROOM', name: 'Button Mushroom', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_MINT_ONION', name: 'Mint Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_MOMO_CHUTNEY', name: 'Momo Chutney', category: 'Condiment', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_VEG_MOMOS', name: 'Veg Momos Raw', category: 'Frozen', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 5 },\n`;

const pkgInjectionStr = `    // Tandoor Packaging
    { code: 'PKG_ARABIAN_PLATTER', name: 'Arabian Platter', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_KHABOOS', name: 'Khaboos Bread', unit: 'pcs', currentStock: 500, costPerUnit: 10 },\n`;

const sfgDefInjectionStr = `    // Tandoor Marination SFGs
    { code: 'SFG_MARINATED_CHICKEN_T604', name: 'Marinated Chicken T-604', batchYield: 2000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_MARINATED_CHICKEN_T605', name: 'Marinated Chicken T-605', batchYield: 2000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.40 },
    { code: 'SFG_MARINATED_SEEKH_T606', name: 'Marinated Seekh Mix T-606', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.45 },
    { code: 'SFG_MARINATED_ALFAHAM_T607', name: 'Marinated Al Faham T-607', batchYield: 1, yieldUnit: 'pcs', currentStock: 50, costPerUnit: 180 },
    { code: 'SFG_T601_PASTE', name: 'T-601 Ready Paste', batchYield: 600, yieldUnit: 'gm', currentStock: 1200, costPerUnit: 0.30 },
    { code: 'SFG_T602_PASTE', name: 'T-602 Ready Paste', batchYield: 600, yieldUnit: 'gm', currentStock: 1200, costPerUnit: 0.35 },
    { code: 'SFG_T603_PASTE', name: 'T-603 Ready Paste', batchYield: 600, yieldUnit: 'gm', currentStock: 1200, costPerUnit: 0.32 },
    { code: 'SFG_T602A_PASTE', name: 'T-602-A Achari Paste', batchYield: 750, yieldUnit: 'gm', currentStock: 1500, costPerUnit: 0.34 },\n`;

const dishInjectionStr = `    // Tandoor Dishes
    { name: 'Chicken Tikka', price: 299, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Chicken Half', price: 349, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Chicken Full', price: 599, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Chicken Malai Tikka', price: 329, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Afghani Chicken Half', price: 369, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Afghani Chicken Full', price: 629, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Chicken Seekh Kebab', price: 289, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Al Faham Chicken', price: 649, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    // Veg Tandoor
    { name: 'Tandoori Paneer', price: 249, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Chaap', price: 229, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Mushroom', price: 259, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Momos', price: 199, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    { name: 'Malai Paneer', price: 269, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Chaap', price: 249, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Mushroom', price: 279, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    { name: 'Hariyali Paneer', price: 259, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Hariyali Chaap', price: 239, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Hariyali Mushroom', price: 269, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    { name: 'Achari Paneer', price: 269, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Achari Chaap', price: 249, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Achari Mushroom', price: 279, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },\n`;

const sfgRecipeInjectionStr = `    'SFG_MARINATED_CHICKEN_T604': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_T604', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_BESAN', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 50 }
    ],
    'SFG_MARINATED_CHICKEN_T605': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_T605', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 30 }
    ],
    'SFG_MARINATED_SEEKH_T606': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 700 },
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_FAT', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_T606', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_DEWATERED_ONION', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 25 }
    ],
    'SFG_MARINATED_ALFAHAM_T607': [
      { itemModel: 'RawMaterial', code: 'RM_RAW_CHICKEN_WHOLE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_T607', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 }
    ],
    'SFG_T601_PASTE': [
      { itemModel: 'RawMaterial', code: 'RM_T601', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 400 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 100 }
    ],
    'SFG_T602_PASTE': [
      { itemModel: 'RawMaterial', code: 'RM_T602', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 400 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 100 }
    ],
    'SFG_T603_PASTE': [
      { itemModel: 'RawMaterial', code: 'RM_T603', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 400 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 100 }
    ],
    'SFG_T602A_PASTE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 600 },
      { itemModel: 'RawMaterial', code: 'RM_ACHARI_PASTE', quantity: 150 }
    ],\n`;

const dishRecipeInjectionStr = `    'Chicken Tikka': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chicken Half': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chicken Full': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Chicken Malai Tikka': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Afghani Chicken Half': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Afghani Chicken Full': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Chicken Seekh Kebab': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_SEEKH_T606', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Al Faham Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_ALFAHAM_T607', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'Packaging', code: 'PKG_ARABIAN_PLATTER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_KHABOOS', quantity: 1 }
    ],
    'Tandoori Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Momos': [
      { itemModel: 'RawMaterial', code: 'RM_VEG_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MOMO_CHUTNEY', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],\n`;

if (!content.includes('T-604 Crimson Coat')) {
    // Arrays
    content = content.replace("const rmData = [", "const rmData = [\n" + rmInjectionStr);
    content = content.replace("const packagingData = [", "const packagingData = [\n" + pkgInjectionStr);
    content = content.replace("const sfgData = [", "const sfgData = [\n" + sfgDefInjectionStr);
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);

    // Objects
    // For sfgRecipeMappings, find "const sfgRecipeMappings" and the opening brace "{", then inject
    content = content.replace(/(const sfgRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + sfgRecipeInjectionStr);
    
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + dishRecipeInjectionStr);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Tandoori Patch applied successfully!');
} else {
    console.log('Already patched.');
}
