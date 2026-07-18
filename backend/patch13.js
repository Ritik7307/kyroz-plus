const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastRM = "costPerPurchaseUnit: 120 }"; // RM_CORNFLAKES was last in patch12
const rmInjection = `costPerPurchaseUnit: 120 },
    // Schezwan & Wok Additions
    { code: 'RM_Z103', name: 'Z-103 RED FIRE BATCH Powder', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_Z104', name: 'Z-104 VOK DUST Powder', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_DARK_SOY_SAUCE', name: 'Dark Soy Sauce', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_JULIENNE_VEG', name: 'Mixed Julienne Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_CHICKEN_LOLLIPOP_RAW', name: 'Raw Chicken Lollipop', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_MUSHROOM', name: 'Mushroom', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 }`;

if (!content.includes('RM_Z103')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const sfgDefInjection = `costPerUnit: 0.20 },
    // Schezwan & Wok SFGs
    { code: 'SFG_SCHEZWAN_PASTE', name: 'Master Schezwan Paste', batchYield: 1000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_BOILED_RICE', name: 'Boiled Rice', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.05 },
    { code: 'SFG_BOILED_NOODLES', name: 'Boiled Noodles', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.08 }`;

const lastSFGDef = "costPerUnit: 0.20 }"; // SFG_PREPARED_Z106_BATTER

if (!content.includes('SFG_SCHEZWAN_PASTE')) {
  content = content.replace(lastSFGDef, sfgDefInjection);
  console.log('SFG Def Inject: true');
}

const dishInjection = `{ name: 'Kurkure Chicken Momos', price: 200, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Schezwan Fried Rice', price: 220, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Schezwan Noodles', price: 210, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Hakka Noodles', price: 200, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Veg Fried Rice', price: 210, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Fried Rice', price: 240, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Lollipop', price: 280, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Crispy Chicken', price: 270, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Paneer Crispy', price: 250, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } }`;

const lastDish = "{ name: 'Kurkure Chicken Momos', price: 200, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } }";

if (!content.includes('Schezwan Fried Rice')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const sfgRecipeInjectionStr = `    ,'SFG_SCHEZWAN_PASTE': [
      { itemModel: 'RawMaterial', code: 'RM_Z103', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GARLIC', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_VINEGAR', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_DARK_SOY_SAUCE', quantity: 100 }
    ],
    'SFG_BOILED_RICE': [
      { itemModel: 'RawMaterial', code: 'RM_RICE', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 3000 }
    ],
    'SFG_BOILED_NOODLES': [
      { itemModel: 'RawMaterial', code: 'RM_NOODLES', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 3000 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`;

if (!content.includes("'SFG_SCHEZWAN_PASTE':")) {
  content = content.replace("  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {", sfgRecipeInjectionStr);
  console.log('SFG Recipe Inject: true');
}

const dishRecipeInjectionStr = `    ,'Schezwan Fried Rice': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_RICE', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SCHEZWAN_PASTE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_MIX_VEG', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 }
    ],
    'Schezwan Noodles': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SCHEZWAN_PASTE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_JULIENNE_VEG', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 }
    ],
    'Hakka Noodles': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_JULIENNE_VEG', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_Z104', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_VINEGAR', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Veg Fried Rice': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_RICE', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MIX_VEG', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_Z104', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_VINEGAR', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Chicken Fried Rice': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_RICE', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_CHICKEN', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MIX_VEG', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_Z104', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_VINEGAR', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Chicken Lollipop': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_LOLLIPOP_RAW', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_Z106_BATTER', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 }
    ],
    'Crispy Chicken': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_Z106_BATTER', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 }
    ],
    'Paneer Crispy': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_Z106_BATTER', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'Schezwan Fried Rice':")) {
  content = content.replace("  };\n\n  for (const dish of dishData) {", dishRecipeInjectionStr);
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 13 applied successfully!');
