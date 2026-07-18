const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastRM = "costPerPurchaseUnit: 50 }";
const rmInjection = `costPerPurchaseUnit: 50 },
    // Mutton & Specialized Ingredients
    { code: 'RM_EGG_RAW', name: 'Raw Egg', category: 'Dairy', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 6 },
    { code: 'RM_PRECOOKED_MUTTON', name: 'Pre-cooked Mutton', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'RM_WHOLE_SPICES', name: 'Whole Spices', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1000 },
    { code: 'RM_MUTTON_STOCK', name: 'Mutton Stock', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_CINNAMON', name: 'Cinnamon', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 800 },
    { code: 'RM_WHOLE_RED_CHILLI', name: 'Whole Red Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 500, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_BAY_LEAF', name: 'Bay Leaf', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 500, currentStock: 1000, costPerPurchaseUnit: 200 },
    { code: 'RM_FINE_CHOPPED_ONION', name: 'Fine Chopped Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_FINE_CHOPPED_TOMATO', name: 'Fine Chopped Tomato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_DRY_GINGER_POWDER', name: 'Dry Ginger Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 400 },
    { code: 'RM_FENNEL_POWDER', name: 'Fennel Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 300 },
    { code: 'RM_KEWRA_WATER', name: 'Kewra Water', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 200 },
    { code: 'RM_RATAN_JOT_OIL', name: 'Ratan Jot Oil', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 500 }`;

if (!content.includes('RM_MUTTON_STOCK')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const lastPKG = "costPerUnit: 10 }";
const pkgInjection = `costPerUnit: 10 },
    // Iron & Clay
    { code: 'PKG_IRON_KARAHI', name: 'Iron Karahi / Plate', unit: 'pcs', currentStock: 500, costPerUnit: 50 },
    { code: 'PKG_CLAY_HANDI', name: 'Clay Handi / Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 40 }`;

if (!content.includes('PKG_IRON_KARAHI')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

const lastSFG = "costPerUnit: 0.45 }";
const sfgInjection = `costPerUnit: 0.45 },
    // Mutton & Omelette SFG
    { code: 'SFG_EGG_OMELETTE', name: 'Egg Omelette', batchYield: 25, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 10 },
    { code: 'SFG_PRECOOKED_MUTTON', name: 'Pre-cooked Mutton', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.85 }`;

if (!content.includes('SFG_PRECOOKED_MUTTON')) {
  content = content.replace(lastSFG, sfgInjection);
  console.log('SFG Inject: true');
}

if (!content.includes("'SFG_PRECOOKED_MUTTON':")) {
  content = content.replace(/(\}\\s*\\]\\s*\\n\\s*\\};\\s*\\n\\s*for\\s*\\(const\\s*sfgCode\\s*of\\s*Object.keys\\(sfgRecipeMappings\\)\\))/, 
    "}," + `
    'SFG_EGG_OMELETTE': [
      { itemModel: 'RawMaterial', code: 'RM_EGG_RAW', quantity: 25 }
    ],
    'SFG_PRECOOKED_MUTTON': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_MUTTON', quantity: 5000 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`
  );
  console.log('SFG Recipe Inject: true');
}

const lastDish = "{ name: 'Murg Musallam', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_PLATE']] } }";
const dishInjection = `{ name: 'Murg Musallam', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_PLATE']] } },
    { name: 'Murg Patiala', price: 430, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Mutton Bhuna Gosht', price: 480, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_IRON_KARAHI'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_IRON_KARAHI'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_IRON_KARAHI']] } },
    { name: 'Mutton Curry', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_HANDI']] } },
    { name: 'Mutton Handi', price: 470, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CLAY_HANDI']] } },
    { name: 'Mutton Rogan Josh', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } }`;

if (!content.includes('Mutton Bhuna Gosht')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const dishRecipeInjection = `    'Murg Patiala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_EGG_OMELETTE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 45 }
    ],
    'Mutton Bhuna Gosht': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_SPICES', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Mutton Curry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CINNAMON', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Mutton Handi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_BAY_LEAF', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FINE_CHOPPED_ONION', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FINE_CHOPPED_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CORIANDER_POWDER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Mutton Rogan Josh': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_CARDAMOM', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CINNAMON', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_GINGER_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FENNEL_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KEWRA_WATER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_RATAN_JOT_OIL', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ]`;

if (!content.includes("'Murg Patiala':")) {
  content = content.replace(/(\\}\\s*\\]\\s*\\n\\s*\\};\\s*\\n\\s*for\\s*\\(const\\s*dish\\s*of\\s*dishData\\))/, 
    "}," + "\\n" + dishRecipeInjection + "\\n  };\\n\\n  for (const dish of dishData)"
  );
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 9 applied successfully!');
