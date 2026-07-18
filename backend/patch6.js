const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

function injectAt(searchStr, injectionStr) {
  const idx = content.indexOf(searchStr);
  if (idx !== -1) {
    content = content.slice(0, idx) + injectionStr + '\n' + content.slice(idx);
    return true;
  }
  return false;
}

const rmInjection = `
    // More Indian Spices & Ingredients
    { code: 'RM_GREEN_CARDAMOM', name: 'Green Cardamom', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 400, currentStock: 400, costPerPurchaseUnit: 1500 },
    { code: 'RM_WHOLE_GREEN_CHILLI', name: 'Whole Green Chilli', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 300, currentStock: 500, costPerPurchaseUnit: 80 },
    { code: 'RM_WHOLE_BLACK_PEPPER', name: 'Whole Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 900 },
    { code: 'RM_CRUSHED_BLACK_PEPPER', name: 'Crushed Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 950 },
    { code: 'RM_CHOPPED_CAPSICUM', name: 'Chopped Capsicum', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_GRATED_PANEER', name: 'Grated Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_KITCHEN_KING', name: 'Kitchen King Masala', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_KEEMA_RAW', name: 'Raw Keema', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_JEERA', name: 'Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 350 },
    { code: 'RM_ALMOND_PASTE', name: 'Almond Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_WHITE_PEPPER', name: 'White Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_PRECOOKED_CHICKEN_TIKKA', name: 'Pre-cooked Chicken Tikka', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
`;

if (!content.includes('RM_GREEN_CARDAMOM')) {
  console.log('RM Inject:', injectAt('  ];\r\n\r\n  const rmIds: any = {};', rmInjection) || injectAt('  ];\n\n  const rmIds: any = {};', rmInjection));
}

const pkgInjection = `
    // Premium White Bowl
    { code: 'PKG_PREMIUM_WHITE_BOWL', name: 'Premium White Bowl / Royal Handi', unit: 'pcs', currentStock: 500, costPerUnit: 35 },
    { code: 'PKG_ROYAL_BOWL', name: '500 ml Royal Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 30 },
`;

if (!content.includes('PKG_PREMIUM_WHITE_BOWL')) {
  console.log('PKG Inject:', injectAt('  ];\r\n\r\n  const pkgIds: any = {};', pkgInjection) || injectAt('  ];\n\n  const pkgIds: any = {};', pkgInjection));
}

const sfgInjection = `
    // Precooked items
    { code: 'SFG_PRECOOKED_KEEMA', name: 'Pre-cooked Keema', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.50 },
    { code: 'SFG_PRECOOKED_CHICKEN_TIKKA', name: 'Pre-cooked Chicken Tikka', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.45 },
`;

if (!content.includes('SFG_PRECOOKED_KEEMA')) {
  console.log('SFG Inject:', injectAt('  ];\r\n\r\n  const sfgIds: any = {};', sfgInjection) || injectAt('  ];\n\n  const sfgIds: any = {};', sfgInjection));
}

const sfgRecipeInjection = `
    'SFG_PRECOOKED_KEEMA': [
      { itemModel: 'RawMaterial', code: 'RM_KEEMA_RAW', quantity: 5000 }
    ],
    'SFG_PRECOOKED_CHICKEN_TIKKA': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_CHICKEN_TIKKA', quantity: 5000 }
    ],
`;

if (!content.includes("'SFG_PRECOOKED_KEEMA':")) {
  console.log('SFG Recipe Inject:', injectAt('  };\r\n\r\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {', sfgRecipeInjection) || injectAt('  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {', sfgRecipeInjection));
}

const dishInjection = `
    { name: 'Chicken Kali Mirch', price: 360, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_WHITE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_WHITE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_WHITE_BOWL']] } },
    { name: 'Chicken Lababdar', price: 370, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Mutton Rara', price: 390, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Pasanda', price: 410, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_ROYAL_BOWL']] } },
    { name: 'Chicken Rara', price: 380, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
`;

if (!content.includes('Chicken Kali Mirch')) {
  console.log('Dish Inject:', injectAt('  ];\r\n\r\n  const recipeMappings:', dishInjection) || injectAt('  ];\n\n  const recipeMappings:', dishInjection));
}

const dishRecipeInjection = `
    'Chicken Kali Mirch': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_GREEN_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 22 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Chicken Lababdar': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_CAPSICUM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KITCHEN_KING', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 }
    ],
    'Chicken Mutton Rara': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_KEEMA', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 }
    ],
    'Chicken Pasanda': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 8 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_ALMOND_PASTE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 2 }
    ],
    'Chicken Rara': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_KEEMA', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 }
    ],
`;

if (!content.includes("'Chicken Kali Mirch':")) {
  console.log('Dish Recipe Inject:', injectAt('  };\r\n\r\n  for (const dish of dishData) {', dishRecipeInjection) || injectAt('  };\n\n  for (const dish of dishData) {', dishRecipeInjection));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 6 applied successfully!');
