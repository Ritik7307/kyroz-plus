const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastRM = "costPerPurchaseUnit: 40 }"; // RM_COAL was last in patch14
const rmInjection = `costPerPurchaseUnit: 40 },
    // South Indian Additions
    { code: 'RM_S305_STEAM', name: 'S-305 STEAM CLOUD', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_COASTAL_CRUST', name: 'S-301 COASTAL CRUST', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'RM_S302_TEMPER', name: 'S-302 YELLOW TEMPER', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 220 },
    { code: 'RM_S303_RAVA', name: 'S-303 RAVA PEARL', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_S304_CRUNCH', name: 'S-304 CRUNCH CORE', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 230 },
    { code: 'RM_POTATO_BOILED', name: 'Boiled Potatoes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 }`;

if (!content.includes('RM_S305_STEAM')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const lastPKG = "costPerUnit: 2 }"; // PKG_SPOON in patch14
const pkgInjection = `costPerUnit: 2 },
    // South Indian PKG
    { code: 'PKG_SOUTH_INDIAN_CONTAINER', name: 'South Indian Container', unit: 'pcs', currentStock: 1000, costPerUnit: 15 }`;

if (!content.includes('PKG_SOUTH_INDIAN_CONTAINER')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

const lastSFGDef = "costPerUnit: 0.15 }"; // SFG_MANDI_RICE in patch14
const sfgDefInjection = `costPerUnit: 0.15 },
    // South Indian SFGs
    { code: 'SFG_S305_BATTER', name: 'Prepared S-305 Batter', batchYield: 2250, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_S301_BATTER', name: 'Prepared Dosa Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_ALOO_MASALA_STUFFING', name: 'Prepared Aloo Masala Stuffing', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_S303_BATTER', name: 'Prepared Rava Dosa Batter', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_S304_BATTER', name: 'Prepared Medu Vada Batter', batchYield: 1800, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 }`;

if (!content.includes('SFG_S305_BATTER')) {
  content = content.replace(lastSFGDef, sfgDefInjection);
  console.log('SFG Def Inject: true');
}

const dishInjection = `{ name: 'Mix-Veg Uttapam', price: 180, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Plain Dosa', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Masala Dosa', price: 150, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Butter Dosa', price: 160, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Masala Uttapam', price: 170, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Onion Rava Dosa', price: 160, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medu Vada', price: 100, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Idli', price: 100, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mini Idli', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } }`;

const lastDish = "{ name: 'Mutton White Mandi', price: 550, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } }";

if (!content.includes('Mix-Veg Uttapam')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const sfgRecipeInjectionStr = `    ,'SFG_S305_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S305_STEAM', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1250 }
    ],
    'SFG_S301_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_COASTAL_CRUST', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1500 }
    ],
    'SFG_ALOO_MASALA_STUFFING': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO_BOILED', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_S302_TEMPER', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 30 }
    ],
    'SFG_S303_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S303_RAVA', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 2500 }
    ],
    'SFG_S304_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S304_CRUNCH', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 800 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`;

if (!content.includes("'SFG_S305_BATTER':")) {
  content = content.replace("  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {", sfgRecipeInjectionStr);
  console.log('SFG Recipe Inject: true');
}

const dishRecipeInjectionStr = `    ,'Mix-Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S305_BATTER', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 8 }
    ],
    'Plain Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S301_BATTER', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 }
    ],
    'Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S301_BATTER', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA_STUFFING', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 }
    ],
    'Butter Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S301_BATTER', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Masala Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S305_BATTER', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA_STUFFING', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 8 }
    ],
    'Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S303_BATTER', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 8 }
    ],
    'Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S304_BATTER', quantity: 70 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 8 }
    ],
    'Regular Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S305_BATTER', quantity: 50 }
    ],
    'Mini Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_S305_BATTER', quantity: 20 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'Mix-Veg Uttapam':")) {
  content = content.replace("  };\n\n  for (const dish of dishData) {", dishRecipeInjectionStr);
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 15 applied successfully!');
