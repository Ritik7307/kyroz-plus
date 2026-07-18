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
    { name: 'Chicken Tikka', category: 'Tandoor Starter', price: 299, packagingLogic: 'Standard Platter' },
    { name: 'Tandoori Chicken Half', category: 'Tandoor Starter', price: 349, packagingLogic: 'Standard Platter' },
    { name: 'Tandoori Chicken Full', category: 'Tandoor Starter', price: 599, packagingLogic: 'Standard Platter' },
    { name: 'Chicken Malai Tikka', category: 'Tandoor Starter', price: 329, packagingLogic: 'Standard Platter' },
    { name: 'Afghani Chicken Half', category: 'Tandoor Starter', price: 369, packagingLogic: 'Standard Platter' },
    { name: 'Afghani Chicken Full', category: 'Tandoor Starter', price: 629, packagingLogic: 'Standard Platter' },
    { name: 'Chicken Seekh Kebab', category: 'Tandoor Starter', price: 289, packagingLogic: 'Standard Platter' },
    { name: 'Al Faham Chicken', category: 'Tandoor Starter', price: 649, packagingLogic: 'Arabian Platter' },
    
    // Veg Tandoor
    { name: 'Tandoori Paneer', category: 'Veg Starter', price: 249, packagingLogic: 'Standard Platter' },
    { name: 'Tandoori Chaap', category: 'Veg Starter', price: 229, packagingLogic: 'Standard Platter' },
    { name: 'Tandoori Mushroom', category: 'Veg Starter', price: 259, packagingLogic: 'Standard Platter' },
    { name: 'Tandoori Momos', category: 'Veg Starter', price: 199, packagingLogic: 'Standard Platter' },
    
    { name: 'Malai Paneer', category: 'Veg Starter', price: 269, packagingLogic: 'Standard Platter' },
    { name: 'Malai Chaap', category: 'Veg Starter', price: 249, packagingLogic: 'Standard Platter' },
    { name: 'Malai Mushroom', category: 'Veg Starter', price: 279, packagingLogic: 'Standard Platter' },
    
    { name: 'Hariyali Paneer', category: 'Veg Starter', price: 259, packagingLogic: 'Standard Platter' },
    { name: 'Hariyali Chaap', category: 'Veg Starter', price: 239, packagingLogic: 'Standard Platter' },
    { name: 'Hariyali Mushroom', category: 'Veg Starter', price: 269, packagingLogic: 'Standard Platter' },
    
    { name: 'Achari Paneer', category: 'Veg Starter', price: 269, packagingLogic: 'Standard Platter' },
    { name: 'Achari Chaap', category: 'Veg Starter', price: 249, packagingLogic: 'Standard Platter' },
    { name: 'Achari Mushroom', category: 'Veg Starter', price: 279, packagingLogic: 'Standard Platter' },\n`;

const sfgRecipeInjectionStr = `    ,'SFG_MARINATED_CHICKEN_T604': [
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
    ]`;

const dishRecipeInjectionStr = `    ,'Chicken Tikka': [
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
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
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
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
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
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
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
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
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
    ]`;

content = content.replace(/\s*\];\s*const pkgIds/, "\n" + rmInjectionStr + "  ];\n\n  const pkgIds");
content = content.replace(/\s*\];\s*const sfgIds/, "\n" + pkgInjectionStr + "  ];\n\n  const sfgIds");
content = content.replace(/\s*\];\s*const dishIds/, "\n" + sfgDefInjectionStr + "  ];\n\n  const dishIds");
content = content.replace(/\s*\];\s*const sfgRecipeMappings/, "\n" + dishInjectionStr + "  ];\n\n  const sfgRecipeMappings");

content = content.replace(/\s*};\s*for \(const sfgCode of Object\.keys\(sfgRecipeMappings\)\) \{/, "\n" + sfgRecipeInjectionStr + "\n  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {");
content = content.replace(/\s*};\s*for \(const dish of dishData\) \{/, "\n" + dishRecipeInjectionStr + "\n  };\n\n  for (const dish of dishData) {");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 16 applied!');
