const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// RM Data Injection
const rmInjection = `
    // Indian Gravy & Spices
    { code: 'RM_G205', name: 'G-205 Royal Rogan', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 150 },
    { code: 'RM_G204', name: 'G-204 Roasted Rust', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 160 },
    { code: 'RM_G201', name: 'G-201 Sunset Base', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_G202', name: 'G-202 Ivory Base', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 200 },
    { code: 'RM_K801', name: 'K-801 Royal Punch', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 500 },
    { code: 'RM_K802', name: 'K-802 Wok Spice', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 450 },
    { code: 'RM_K806', name: 'K-806 Zestful Zing', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 480 },
    { code: 'RM_DESI_GHEE', name: 'Desi Ghee', category: 'Fat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_MUSTARD_OIL', name: 'Mustard Oil', category: 'Fat', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'RM_SHAHI_JEERA', name: 'Shahi Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_TEJ_PATTA', name: 'Tej Patta', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 500, currentStock: 500, costPerPurchaseUnit: 200 },
    { code: 'RM_BLACK_CARDAMOM', name: 'Black Cardamom', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 400, currentStock: 400, costPerPurchaseUnit: 1200 },
    { code: 'RM_CLOVES', name: 'Cloves', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 900 },
    { code: 'RM_GINGER_GARLIC_PASTE', name: 'Ginger Garlic Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_CURD', name: 'Curd', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_BLACK_PEPPER', name: 'Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_CORIANDER_POWDER', name: 'Coriander Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 250 },
    { code: 'RM_KASHMIRI_CHILLI', name: 'Kashmiri Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 450 },
    { code: 'RM_FRESH_CORIANDER', name: 'Fresh Coriander', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_GINGER_JULIENNES', name: 'Ginger Juliennes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 100 },
    { code: 'RM_MEAT_STOCK', name: 'Meat Stock', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_GREEN_CHILLI', name: 'Green Chilli', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 80 },
    { code: 'RM_LEMON_JUICE', name: 'Lemon Juice', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 150 },
    { code: 'RM_FRESH_CREAM', name: 'Fresh Cream', category: 'Dairy', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 3000, costPerPurchaseUnit: 200 },
    { code: 'RM_KASOORI_METHI', name: 'Kasoori Methi', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 350 },
    { code: 'RM_PRECOOKED_TANDOORI_CHICKEN', name: 'Pre-cooked Tandoori Chicken', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_PRECOOKED_TANDOORI_BARRAH', name: 'Pre-cooked Tandoori Barrah', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 600 }
`;

if (!content.includes('RM_G205')) {
  content = content.replace(/(  \];\r?\n\r?\n  const rmIds: any = \{\};)/, rmInjection + '\n$1');
}

// PKG Data Injection
const pkgInjection = `
    // Indian Gravy Packaging
    { code: 'PKG_EARTHEN_HANDI', name: 'Earthen Handi / Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_PREMIUM_HANDI', name: 'Premium Round Handi', unit: 'pcs', currentStock: 500, costPerUnit: 30 },
    { code: 'PKG_SERVING_PLATE', name: 'Serving Plate/Container', unit: 'pcs', currentStock: 500, costPerUnit: 15 }
`;

if (!content.includes('PKG_EARTHEN_HANDI')) {
  content = content.replace(/(  \];\r?\n\r?\n  const pkgIds: any = \{\};)/, pkgInjection + '\n$1');
}

// SFG Data Injection
const sfgInjection = `
    // Indian Gravies
    { code: 'SFG_G205', name: 'G-205 Royal Rogan', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.15 },
    { code: 'SFG_G204', name: 'G-204 Roasted Rust', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.16 },
    { code: 'SFG_G201', name: 'G-201 Sunset Base', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.18 },
    { code: 'SFG_G202', name: 'G-202 Ivory Base', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.20 },
    { code: 'SFG_PRECOOKED_CHICKEN_MUTTON', name: 'Pre-cooked Chicken/Mutton', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.30 },
    { code: 'SFG_PRECOOKED_BARRAH', name: 'Pre-cooked Tandoori Barrah', batchYield: 5000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.60 }
`;

if (!content.includes('SFG_G205')) {
  content = content.replace(/(  \];\r?\n\r?\n  const sfgIds: any = \{\};)/, sfgInjection + '\n$1');
}

// SFG Recipe Mappings
const sfgRecipeInjection = `
    'SFG_G205': [
      { itemModel: 'RawMaterial', code: 'RM_G205', quantity: 5000 }
    ],
    'SFG_G204': [
      { itemModel: 'RawMaterial', code: 'RM_G204', quantity: 5000 }
    ],
    'SFG_G201': [
      { itemModel: 'RawMaterial', code: 'RM_G201', quantity: 5000 }
    ],
    'SFG_G202': [
      { itemModel: 'RawMaterial', code: 'RM_G202', quantity: 5000 }
    ],
    'SFG_PRECOOKED_CHICKEN_MUTTON': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 5000 }
    ],
    'SFG_PRECOOKED_BARRAH': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_BARRAH', quantity: 5000 }
    ],
`;

if (!content.includes("'SFG_G205':")) {
  content = content.replace(/(  \};\r?\n\r?\n  for \(const sfgCode of Object\.keys\(sfgRecipeMappings\)\) \{)/, sfgRecipeInjection + '\n$1');
}

// Dish Data Injection
const dishInjection = `
    { name: 'Desi Handi Chicken', price: 350, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Barrah Masala', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_SERVING_PLATE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SERVING_PLATE'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Butter Chicken', price: 380, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_HANDI']] } },
    { name: 'Chicken Changezi', price: 400, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Curry', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } }
`;

if (!content.includes('Desi Handi Chicken')) {
  content = content.replace(/(  \];\r?\n\r?\n  const recipeMappings: Record<string,)/, dishInjection + '\n$1');
}

// Dish Recipe Mappings Injection
const dishRecipeInjection = `
    'Desi Handi Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_TEJ_PATTA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CLOVES', quantity: 4 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CORIANDER_POWDER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 50 }
    ],
    'Barrah Masala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_BARRAH', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 }
    ],
    'Butter Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 22 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Chicken Changezi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 50 }
    ],
    'Chicken Curry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_CARDAMOM', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CLOVES', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
`;

if (!content.includes("'Desi Handi Chicken':")) {
  content = content.replace(/(  \};\r?\n\r?\n  for \(const dish of dishData\) \{)/, dishRecipeInjection + '\n$1');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 4 applied successfully!');
