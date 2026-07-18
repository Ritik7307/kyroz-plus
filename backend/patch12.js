const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastRM = "costPerPurchaseUnit: 100 }"; // RM_FRIED_NOODLES
const rmInjection = `costPerPurchaseUnit: 100 },
    // Finishing Oils & Momos
    { code: 'RM_TEJA_CHILLI_FLAKES', name: 'Teja Chilli Flakes', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_KASHMIRI_CHILLI_POWDER', name: 'Kashmiri Chilli Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'RM_STAR_ANISE', name: 'Star Anise', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'RM_SALT', name: 'Salt', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'RM_FROZEN_VEG_MOMOS', name: 'Frozen Veg Momos', category: 'Frozen', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 5 },
    { code: 'RM_FROZEN_CHICKEN_MOMOS', name: 'Frozen Chicken Momos', category: 'Frozen', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 7 },
    { code: 'RM_Z106', name: 'Z-106 ARMOUR BASE', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_Z107', name: 'Z-107 RUBY CONCENTRATE', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_MAYONNAISE', name: 'Mayonnaise', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CORNFLAKES', name: 'Cornflakes', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 }`;

if (!content.includes('RM_FROZEN_VEG_MOMOS')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const lastPKG = "costPerUnit: 30 }"; // PKG_LARGE_SHALLOW_BOWL
const pkgInjection = `costPerUnit: 30 },
    // Momos PKG
    { code: 'PKG_SNACK_BOX', name: 'Snack Box', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_SAUCE_CUP', name: 'Sauce Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 2 }`;

if (!content.includes('PKG_SNACK_BOX')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

const sfgInjectionStr = `    ,'SFG_MASTER_CHILLI_OIL': [
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 900 },
      { itemModel: 'RawMaterial', code: 'RM_TEJA_CHILLI_FLAKES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_STAR_ANISE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_CINNAMON', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SALT', quantity: 5 }
    ],
    'SFG_MASTER_GARLIC_OIL': [
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 450 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GARLIC', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_SALT', quantity: 5 }
    ],
    'SFG_PREPARED_RUBY_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_Z107', quantity: 1000 }
    ],
    'SFG_PREPARED_Z106_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_Z106', quantity: 1000 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`;

if (!content.includes("'SFG_MASTER_CHILLI_OIL':")) {
  content = content.replace("  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {", sfgInjectionStr);
  console.log('SFG Recipe Inject: true');
}

// Wait, we need to inject the SFG items too, not just recipes.
const sfgDefInjection = `costPerUnit: 0.10 },
    // Finishing Oils & Momos SFGs
    { code: 'SFG_MASTER_CHILLI_OIL', name: 'F-301 Master Chilli Oil', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.50 },
    { code: 'SFG_MASTER_GARLIC_OIL', name: 'F-302 Master Garlic Oil', batchYield: 500, yieldUnit: 'ml', currentStock: 500, costPerUnit: 0.40 },
    { code: 'SFG_PREPARED_RUBY_SAUCE', name: 'Prepared Ruby Sauce', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.30 },
    { code: 'SFG_PREPARED_Z106_BATTER', name: 'Prepared Z-106 Batter', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 }`;

const lastSFGDef = "costPerUnit: 0.10 }"; // SFG_MIXED_SOUP_VEGETABLES

if (!content.includes('SFG_MASTER_CHILLI_OIL')) {
  content = content.replace(lastSFGDef, sfgDefInjection);
  console.log('SFG Def Inject: true');
}

const dishInjection = `{ name: 'Manchow Soup', price: 170, category: 'Soup', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SOUP_BOWL']] } },
    { name: 'Steamed Veg Momos', price: 150, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Steamed Chicken Momos', price: 170, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Fried Veg Momos', price: 160, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Fried Chicken Momos', price: 180, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Kurkure Veg Momos', price: 180, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Kurkure Chicken Momos', price: 200, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } }`;

const lastDish = "{ name: 'Manchow Soup', price: 170, category: 'Soup', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SOUP_BOWL']] } }";

if (!content.includes('Steamed Veg Momos')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const dishRecipeInjectionStr = `    ,'Steamed Veg Momos': [
      { itemModel: 'RawMaterial', code: 'RM_FROZEN_VEG_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_RUBY_SAUCE', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MASTER_GARLIC_OIL', quantity: 2.5 }
    ],
    'Steamed Chicken Momos': [
      { itemModel: 'RawMaterial', code: 'RM_FROZEN_CHICKEN_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_RUBY_SAUCE', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MASTER_GARLIC_OIL', quantity: 2.5 }
    ],
    'Fried Veg Momos': [
      { itemModel: 'RawMaterial', code: 'RM_FROZEN_VEG_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_RUBY_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MAYONNAISE', quantity: 20 }
    ],
    'Fried Chicken Momos': [
      { itemModel: 'RawMaterial', code: 'RM_FROZEN_CHICKEN_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_RUBY_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MAYONNAISE', quantity: 20 }
    ],
    'Kurkure Veg Momos': [
      { itemModel: 'RawMaterial', code: 'RM_FROZEN_VEG_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_Z106_BATTER', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLAKES', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_RUBY_SAUCE', quantity: 30 }
    ],
    'Kurkure Chicken Momos': [
      { itemModel: 'RawMaterial', code: 'RM_FROZEN_CHICKEN_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_Z106_BATTER', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLAKES', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_RUBY_SAUCE', quantity: 30 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'Steamed Veg Momos':")) {
  content = content.replace("  };\n\n  for (const dish of dishData) {", dishRecipeInjectionStr);
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 12 applied successfully!');
