const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// RM Injection
const lastRM = "{ code: 'RM_STAR_ANISE', name: 'Star Anise', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },";
const rmInjection = `{ code: 'RM_STAR_ANISE', name: 'Star Anise', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    // Indian Veg Costing RM Part 2
    { code: 'RM_WATER', name: 'Water', category: 'Liquid', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 0 },
    { code: 'RM_BUTTON_MUSHROOM', name: 'Button Mushroom', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_ONION_PETALS', name: 'Onion Petals', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_CURD_FRESH_CREAM', name: 'Curd/Fresh Cream Mix', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_BLANCHED_MIX_VEG', name: 'Blanched Mix Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_FRIED_MAKHANA', name: 'Fried Makhana', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_PINEAPPLE_CHUNKS', name: 'Pineapple Chunks', category: 'Fruit', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 100 },
    { code: 'RM_RAISINS', name: 'Raisins', category: 'Dry Fruit', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },
    { code: 'RM_POMEGRANATE_SEEDS', name: 'Pomegranate Seeds', category: 'Fruit', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 150 },
    { code: 'RM_VEG_STOCK_WATER', name: 'Vegetable Stock / Water', category: 'Liquid', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 10 },
    { code: 'RM_WHOLE_JEERA', name: 'Whole Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_DESI_GHEE', name: 'Desi Ghee', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_GREEN_CHILLI', name: 'Green Chilli', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_FRESH_GINGER', name: 'Fresh Ginger', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_DRY_RED_CHILLI', name: 'Dry Red Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_FRIED_CASHEW', name: 'Fried Cashew', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },`;

if (!content.includes('RM_BUTTON_MUSHROOM')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject 2: true');
}

// SFG Injection
const lastSFGDef = "{ code: 'SFG_FRIED_KOFTA', name: 'Fried Kofta', batchYield: 100, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 18 },";
const sfgDefInjection = `{ code: 'SFG_FRIED_KOFTA', name: 'Fried Kofta', batchYield: 100, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 18 },
    // Indian Veg SFGs Part 2
    { code: 'SFG_BLANCHED_VEG_MIX', name: 'Blanched Veg Mix', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'SFG_FRIED_MAKHANA', name: 'Fried Makhana', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.85 },
    { code: 'SFG_MALAI_KOFTA', name: 'Malai Kofta', batchYield: 50, yieldUnit: 'pcs', currentStock: 50, costPerUnit: 20 },`;

if (!content.includes('SFG_BLANCHED_VEG_MIX')) {
  content = content.replace(lastSFGDef, sfgDefInjection);
  console.log('SFG Def Inject 2: true');
}


// Dish Injection
const lastDishReal = "dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } }";
const dishInjection = `dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta Red', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Mushroom Do Pyaza', price: 290, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Navratan Korma', price: 350, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Palak Paneer', price: 300, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Paneer Butter Masala', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } }`;

if (!content.includes('Malai Kofta Red')) {
  content = content.replace(lastDishReal, dishInjection);
  console.log('Dish Inject 2: true');
}

// Dish Recipe Injection
const dishRecipeInjectionStr = `    ,'Malai Kofta Red': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MALAI_KOFTA', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 3 }
    ],
    'Mushroom Do Pyaza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_PETALS', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_CURD_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 2 }
    ],
    'Navratan Korma': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_BLANCHED_VEG_MIX', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_FRIED_MAKHANA', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_PINEAPPLE_CHUNKS', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_CASHEW', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_RAISINS', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_MACE', quantity: 0.25 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_POMEGRANATE_SEEDS', quantity: 5 }
    ],
    'Palak Paneer': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_VEG_STOCK_WATER', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 5 }
    ],
    'Paneer Butter Masala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_HONEY', quantity: 2 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'Malai Kofta Red':")) {
  content = content.replace("  };\n\n  for (const dish of dishData) {", dishRecipeInjectionStr);
  console.log('Dish Recipe Inject 2: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 2 applied successfully!');
