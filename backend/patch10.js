const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastRM = "costPerPurchaseUnit: 500 }";
const rmInjection = `costPerPurchaseUnit: 500 },
    // Nizami and Saagwala Additions
    { code: 'RM_BIRISTA', name: 'Birista (Fried Onion)', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 250 },
    { code: 'RM_FRIED_CASHEW', name: 'Fried Cashew', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_SHAHI_JEERA', name: 'Shahi Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 }`;

if (!content.includes('RM_BIRISTA')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const lastPKG = "costPerUnit: 40 }";
const pkgInjection = `costPerUnit: 40 },
    // Black Bowl
    { code: 'PKG_BLACK_BOWL', name: 'Black Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 35 }`;

if (!content.includes('PKG_BLACK_BOWL')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

// SFGs: We already have SFG_PRECOOKED_CHICKEN_TIKKA and SFG_PRECOOKED_MUTTON.
// No new SFGs strictly required.

const lastDish = "{ name: 'Mutton Rogan Josh', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } }";
const dishInjection = `{ name: 'Mutton Rogan Josh', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Chicken Nizami Handi', price: 410, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CLAY_HANDI']] } },
    { name: 'Saagwala Meat', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BLACK_BOWL']] } }`;

if (!content.includes('Chicken Nizami Handi')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const dishRecipeInjection = `    'Chicken Nizami Handi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BIRISTA', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_CASHEW', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 }
    ],
    'Saagwala Meat': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 1 }
    ]`;

if (!content.includes("'Chicken Nizami Handi':")) {
  content = content.replace(/(\\}\\s*\\]\\s*\\n\\s*\\};\\s*\\n\\s*for\\s*\\(const\\s*dish\\s*of\\s*dishData\\))/, 
    "}," + "\\n" + dishRecipeInjection + "\\n  };\\n\\n  for (const dish of dishData)"
  );
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 10 applied successfully!');
