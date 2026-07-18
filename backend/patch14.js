const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastRM = "costPerPurchaseUnit: 120 }"; // RM_MUSHROOM was last in patch13
const rmInjection = `costPerPurchaseUnit: 120 },
    // Mandi Additions
    { code: 'RM_CHICKEN_LG_THIGH', name: 'Chicken LG + Thigh', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_SELLA_RICE', name: 'Long Grain/Sella Rice', category: 'Grain', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_B404_A', name: 'B-404 A Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50, costPerPurchaseUnit: 200 },
    { code: 'RM_B404_B', name: 'B-404 B Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50, costPerPurchaseUnit: 200 },
    { code: 'RM_COAL', name: 'Coal', category: 'Fuel', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 }`;

if (!content.includes('RM_CHICKEN_LG_THIGH')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const lastPKG = "costPerUnit: 2 }"; // PKG_SAUCE_CUP
const pkgInjection = `costPerUnit: 2 },
    // Mandi PKG
    { code: 'PKG_MANDI_CONTAINER', name: 'Mandi Container', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_FOIL', name: 'Foil', unit: 'pcs', currentStock: 1000, costPerUnit: 5 },
    { code: 'PKG_SPOON', name: 'Spoon', unit: 'pcs', currentStock: 1000, costPerUnit: 2 }`;

if (!content.includes('PKG_MANDI_CONTAINER')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

const lastSFGDef = "costPerUnit: 0.08 }"; // SFG_BOILED_NOODLES
const sfgDefInjection = `costPerUnit: 0.08 },
    // Mandi SFGs
    { code: 'SFG_STEAMED_CHICKEN_PIECES', name: 'Steamed Chicken Pieces', batchYield: 6, yieldUnit: 'pcs', currentStock: 60, costPerUnit: 45 },
    { code: 'SFG_STEAMED_MUTTON_PIECES', name: 'Steamed Mutton Pieces', batchYield: 6, yieldUnit: 'pcs', currentStock: 60, costPerUnit: 80 },
    { code: 'SFG_MANDI_STOCK', name: 'Mandi Stock', batchYield: 2000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_MANDI_RICE', name: 'Mandi Rice', batchYield: 3200, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.15 }`;

if (!content.includes('SFG_STEAMED_CHICKEN_PIECES')) {
  content = content.replace(lastSFGDef, sfgDefInjection);
  console.log('SFG Def Inject: true');
}

const dishInjection = `{ name: 'Paneer Crispy', price: 250, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken White Mandi', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mutton White Mandi', price: 550, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } }`;

const lastDish = "{ name: 'Paneer Crispy', price: 250, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } }";

if (!content.includes('Chicken White Mandi')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const sfgRecipeInjectionStr = `    ,'SFG_STEAMED_CHICKEN_PIECES': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_LG_THIGH', quantity: 1300 },
      { itemModel: 'RawMaterial', code: 'RM_B404_A', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_COAL', quantity: 10 }
    ],
    'SFG_STEAMED_MUTTON_PIECES': [
      { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_B404_A', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_COAL', quantity: 10 }
    ],
    'SFG_MANDI_STOCK': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_LG_THIGH', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 2500 }
    ],
    'SFG_MANDI_RICE': [
      { itemModel: 'RawMaterial', code: 'RM_SELLA_RICE', quantity: 1000 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_STOCK', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_B404_B', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 50 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`;

if (!content.includes("'SFG_STEAMED_CHICKEN_PIECES':")) {
  content = content.replace("  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {", sfgRecipeInjectionStr);
  console.log('SFG Recipe Inject: true');
}

const dishRecipeInjectionStr = `    ,'Chicken White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_RICE', quantity: 500 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_STEAMED_CHICKEN_PIECES', quantity: 1 }
    ],
    'Mutton White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_RICE', quantity: 500 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_STEAMED_MUTTON_PIECES', quantity: 1 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'Chicken White Mandi':")) {
  content = content.replace("  };\n\n  for (const dish of dishData) {", dishRecipeInjectionStr);
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 14 applied successfully!');
