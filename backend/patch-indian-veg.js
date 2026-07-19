const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// RM Injection
const lastRM = "{ code: 'RM_STAR_ANISE', name: 'Star Anise', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },";
const rmInjection = `{ code: 'RM_STAR_ANISE', name: 'Star Anise', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    // Indian Veg Costing RM
    { code: 'RM_PRE_FRIED_POTATO_CUBES', name: 'Pre-fried Potato Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_PRE_FRIED_CAULIFLOWER_FLORETS', name: 'Pre-fried Cauliflower Florets', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_BOILED_GREEN_PEAS', name: 'Boiled Green Peas', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_HING', name: 'Hing', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_K801', name: 'K-801 ROYAL PUNCH', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_K806', name: 'K-806 ZESTFUL ZING', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 650 },
    { code: 'RM_K802', name: 'K-802 WOK SPICE', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'RM_KASOORI_METHI', name: 'Kasoori Methi', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 300 },
    { code: 'RM_CRUSHED_BLACK_PEPPER', name: 'Crushed Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 800 },
    { code: 'RM_FRESH_CORIANDER', name: 'Fresh Coriander', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_GINGER_JULIENNES', name: 'Ginger Juliennes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 150 },
    { code: 'RM_BOILED_SWEET_CORN', name: 'Boiled Sweet Corn', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_PANEER_CUBES', name: 'Paneer Cubes', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_PROCESSED_CHEESE', name: 'Processed Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_FRESH_CREAM', name: 'Fresh Cream', category: 'Dairy', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_SUGAR', name: 'Sugar', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_CAPSICUM_ONION_STOCK', name: 'Capsicum/Onion Stock', category: 'Liquid', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'RM_CURD', name: 'Curd', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_GRATED_PANEER', name: 'Grated Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_CHOPPED_GARLIC', name: 'Chopped Garlic', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_PREMIUM_FRIED_KOFTA', name: 'Premium Fried Stuffed Paneer Kofta', category: 'Grocery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 1000, costPerPurchaseUnit: 15 },
    { code: 'RM_GREEN_CARDAMOM', name: 'Green Cardamom', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 2500 },
    { code: 'RM_MACE', name: 'Mace', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 3000 },
    { code: 'RM_ALMOND_FLAKES', name: 'Almond Flakes', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 1000 },
    { code: 'RM_GRATED_KHOYA', name: 'Grated Khoya', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },`;

if (!content.includes('RM_PRE_FRIED_POTATO_CUBES')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

// SFG Injection
const lastSFGDef = "{ code: 'SFG_G201', name: 'G-201 Sunset Base', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.18 },";
const sfgDefInjection = `{ code: 'SFG_G201', name: 'G-201 Sunset Base', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.18 },
    // Indian Veg SFGs
    { code: 'SFG_PRE_FRIED_POTATO', name: 'Pre-fried Potato', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_PRE_FRIED_CAULIFLOWER', name: 'Pre-fried Cauliflower', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_BOILED_GREEN_PEAS', name: 'Boiled Green Peas', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'SFG_PANEER_CUBES', name: 'Paneer Cubes', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.38 },
    { code: 'SFG_KADHAI_VEG_MIX_NEW', name: 'Kadhai Veg Mix New', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_GOLDEN_GARLIC_TOPPING', name: 'Golden Garlic Topping', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_FRIED_KOFTA', name: 'Fried Kofta', batchYield: 100, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 18 },`;

if (!content.includes('SFG_PRE_FRIED_POTATO')) {
  content = content.replace(lastSFGDef, sfgDefInjection);
  console.log('SFG Def Inject: true');
}

// PKG Injection
const lastPKG = "{ code: 'PKG_KHABOOS', name: 'Khaboos Bread', unit: 'pcs', currentStock: 500, costPerUnit: 10 },";
const pkgInjection = `{ code: 'PKG_KHABOOS', name: 'Khaboos Bread', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    // Indian Veg PKG
    { code: 'PKG_OVAL_VEG_DISH', name: 'Flat Ceramic Plate / Oval Veg Dish', unit: 'pcs', currentStock: 500, costPerUnit: 40 },
    { code: 'PKG_TAKEAWAY_CONTAINER', name: 'Takeaway Container', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_COPPER_KADHAI', name: 'Copper Kadhai / Ceramic Handi', unit: 'pcs', currentStock: 500, costPerUnit: 50 },
    { code: 'PKG_PREMIUM_DEEP_BOWL', name: 'Premium Deep Bowl / Handi', unit: 'pcs', currentStock: 500, costPerUnit: 45 },`;

if (!content.includes('PKG_OVAL_VEG_DISH')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

// Dish Injection
const lastDish = "name: 'Pre-cooked Tandoori Barrah'"; // wait, let's replace inside dishData
const lastDishReal = "dineIn: [pkgIds['PKG_SOUP_BOWL']] } }";
const dishInjection = `dineIn: [pkgIds['PKG_SOUP_BOWL']] } },
    { name: 'Aloo Gobhi Matar (Semi-Gravy)', price: 250, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Corn Palak Cheese', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Kadhai Paneer', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Lehsunia Paneer', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta (Ivory)', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } }`;

if (!content.includes('Aloo Gobhi Matar')) {
  content = content.replace(lastDishReal, dishInjection);
  console.log('Dish Inject: true');
}

// Dish Recipe Injection
const dishRecipeInjectionStr = `    ,'Aloo Gobhi Matar (Semi-Gravy)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRE_FRIED_POTATO', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRE_FRIED_CAULIFLOWER', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_GREEN_PEAS', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HING', quantity: 0.2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Corn Palak Cheese': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BOILED_SWEET_CORN', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_PROCESSED_CHEESE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 1 }
    ],
    'Kadhai Paneer': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_ONION_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 5 }
    ],
    'Lehsunia Paneer': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_GARLIC', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SALT', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_GOLDEN_GARLIC_TOPPING', quantity: 10 }
    ],
    'Malai Kofta (Ivory)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_FRIED_KOFTA', quantity: 4 },
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
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.25 },
      { itemModel: 'RawMaterial', code: 'RM_ALMOND_FLAKES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_KHOYA', quantity: 5 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'Aloo Gobhi Matar (Semi-Gravy)':")) {
  content = content.replace("  };\n\n  for (const dish of dishData) {", dishRecipeInjectionStr);
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch applied successfully!');
