const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The last item in RM array
const lastRM = "costPerPurchaseUnit: 600 }";
const rmInjection = `costPerPurchaseUnit: 600 },
    // Indian Gravies 3
    { code: 'RM_G203', name: 'G-203 Emerald Mix', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_DRY_RED_CHILLI', name: 'Dry Red Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 300 },
    { code: 'RM_FRESH_MINT', name: 'Fresh Mint', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 80 },
    { code: 'RM_CARDAMOM_POWDER', name: 'Cardamom Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 2500 },
    { code: 'RM_DRY_FRUITS', name: 'Dry Fruits (Cashew/Almond)', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_SAFFRON_MILK', name: 'Saffron Milk', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_BOILED_EGG', name: 'Boiled Egg', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 20, currentStock: 100, costPerPurchaseUnit: 120 },
    { code: 'RM_PRECOOKED_HARIYALI_TIKKA', name: 'Pre-cooked Hariyali Tikka', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_CAPSICUM_CUBES', name: 'Capsicum Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 70 },
    { code: 'RM_ONION_CUBES', name: 'Onion Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 50 }`;

if (!content.includes('RM_G203')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const lastPKG = "costPerUnit: 15 }";
const pkgInjection = `costPerUnit: 15 },
    // Copper Kadhai / Oval Plate
    { code: 'PKG_COPPER_KADHAI', name: 'Copper Kadhai / Round Handi', unit: 'pcs', currentStock: 500, costPerUnit: 40 },
    { code: 'PKG_OVAL_PLATE', name: 'Oval Plate / Handi', unit: 'pcs', currentStock: 500, costPerUnit: 35 },
    { code: 'PKG_TAKEAWAY_CONTAINER', name: 'Takeaway Container', unit: 'pcs', currentStock: 1000, costPerUnit: 10 }`;

if (!content.includes('PKG_COPPER_KADHAI')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

const lastSFG = "costPerUnit: 0.60 }";
const sfgInjection = `costPerUnit: 0.60 },
    // Hariyali and Kadhai
    { code: 'SFG_G203', name: 'G-203 Emerald Mix', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.18 },
    { code: 'SFG_KADHAI_VEG_MIX', name: 'Kadhai Veg Mix', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PRECOOKED_HARIYALI_TIKKA', name: 'Pre-cooked Hariyali Tikka', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.45 }`;

if (!content.includes('SFG_G203')) {
  content = content.replace(lastSFG, sfgInjection);
  console.log('SFG Inject: true');
}

const lastSFGRecipe = "'SFG_PRECOOKED_BARRAH': [\n      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_BARRAH', quantity: 5000 }\n    ]";
const sfgRecipeInjection = `'SFG_PRECOOKED_BARRAH': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_BARRAH', quantity: 5000 }
    ],
    'SFG_G203': [
      { itemModel: 'RawMaterial', code: 'RM_G203', quantity: 5000 }
    ],
    'SFG_KADHAI_VEG_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 2500 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 2500 }
    ],
    'SFG_PRECOOKED_HARIYALI_TIKKA': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_HARIYALI_TIKKA', quantity: 5000 }
    ]`;

// Let's use a smarter replace for SFG Recipe using Regex just before the end
if (!content.includes("'SFG_G203':")) {
  content = content.replace(/(\}\s*\]\s*\n\s*\};\s*\n\s*for\s*\(const\s*sfgCode\s*of\s*Object.keys\(sfgRecipeMappings\)\))/, 
    "}," + `
    'SFG_G203': [
      { itemModel: 'RawMaterial', code: 'RM_G203', quantity: 5000 }
    ],
    'SFG_KADHAI_VEG_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 2500 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 2500 }
    ],
    'SFG_PRECOOKED_HARIYALI_TIKKA': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_HARIYALI_TIKKA', quantity: 5000 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`
  );
  console.log('SFG Recipe Inject: true');
}

const lastDish = "{ name: 'Chicken Curry', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } }";
const dishInjection = `{ name: 'Chicken Curry', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Tikka Masala', price: 380, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Kadhai Chicken', price: 360, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Murg Hariyali', price: 390, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Murg Mumtaz', price: 420, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_ROYAL_BOWL']] } },
    { name: 'Murg Musallam', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_PLATE']] } }`;

if (!content.includes('Chicken Tikka Masala')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const dishRecipeInjection = `    'Chicken Tikka Masala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 }
    ],
    'Kadhai Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Murg Hariyali': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_HARIYALI_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_MINT', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 10 }
    ],
    'Murg Mumtaz': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_FRUITS', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 }
    ],
    'Murg Musallam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_KEEMA', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SAFFRON_MILK', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_BOILED_EGG', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_FRUITS', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 }
    ]`;

if (!content.includes("'Chicken Tikka Masala':")) {
  content = content.replace(/(\}\s*\]\s*\n\s*\};\s*\n\s*for\s*\(const\s*dish\s*of\s*dishData\))/, 
    "}," + "\n" + dishRecipeInjection + "\n  };\n\n  for (const dish of dishData)"
  );
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 8 applied successfully!');
