const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastRM = "costPerPurchaseUnit: 800 }"; // Last one was RM_SHAHI_JEERA
const rmInjection = `costPerPurchaseUnit: 800 },
    // Indo-Chinese Additions
    { code: 'RM_Z105', name: 'Z-105 TANGY COAT Premix', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_Z102', name: 'Z-102 CRYSTAL GLAZE Premix', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_Z102_LIQUID', name: 'Z-102 CRYSTAL GLAZE Liquid', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_Z101', name: 'Z-101 DARK MASTER Premix', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_Z101_LIQUID', name: 'Z-101 DARK MASTER Liquid', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_CRISPY_NOODLE_NEST', name: 'Crispy Fried Noodle Nest', category: 'Grocery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 20 },
    { code: 'RM_TOMATO_KETCHUP', name: 'Tomato Ketchup', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_CORNFLOUR_SLURRY', name: 'Cornflour Slurry', category: 'Grocery', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_PINEAPPLE_PIECES', name: 'Pineapple Pieces', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_FRIED_PANEER', name: 'Fried Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_FRIED_SOYA_CHAAP', name: 'Fried Soya Chaap', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_SPRING_ONION', name: 'Spring Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_FRIED_VEG_MANCHURIAN_BALLS', name: 'Fried Veg Manchurian Balls', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_FRIED_CHICKEN_MANCHURIAN', name: 'Fried Chicken Manchurian', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_DOUBLE_FRIED_POTATO', name: 'Double Fried Potato Fingers', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_HONEY', name: 'Honey', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_WHITE_SESAME', name: 'White Sesame', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_MIXED_SOUP_VEGETABLES', name: 'Mixed Soup Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_VINEGAR', name: 'Vinegar', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_RED_CHILLI_PASTE', name: 'Red Chilli Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_FRESH_GARLIC', name: 'Fresh Garlic', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_FRESH_GINGER', name: 'Fresh Ginger', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CORIANDER_STEMS', name: 'Coriander Stems', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_FRIED_NOODLES', name: 'Fried Noodles', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 }`;

if (!content.includes('RM_Z105')) {
  content = content.replace(lastRM, rmInjection);
  console.log('RM Inject: true');
}

const lastPKG = "costPerUnit: 35 }"; // PKG_BLACK_BOWL
const pkgInjection = `costPerUnit: 35 },
    // Chinese PKG
    { code: 'PKG_CHINESE_BOWL', name: 'Chinese Bowl/Container', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_SOUP_BOWL', name: 'Soup Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_SOUP_LID', name: 'Soup Lid', unit: 'pcs', currentStock: 500, costPerUnit: 5 },
    { code: 'PKG_LARGE_SHALLOW_BOWL', name: 'Large Shallow Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 30 }`;

if (!content.includes('PKG_CHINESE_BOWL')) {
  content = content.replace(lastPKG, pkgInjection);
  console.log('PKG Inject: true');
}

const lastSFG = "costPerUnit: 0.30 }"; // SFG_PRECOOKED_CHICKEN_MUTTON or similar. Wait, I will use SFG_G203.
const sfgInjection = `costPerUnit: 0.18 },
    // Chinese SFGs
    { code: 'SFG_SWEET_SOUR_GRAVY', name: 'Master Sweet & Sour Gravy', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.20 },
    { code: 'SFG_CHILLI_LIQUID_BASE', name: 'Master Chilli Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_MANCHURIAN_LIQUID_BASE', name: 'Master Manchurian Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_HONEY_CHILLI_GLAZE_BASE', name: 'Honey Chilli Glaze Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.30 },
    { code: 'SFG_Z102_SOUP_BASE', name: 'Z-102 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_Z101_SOUP_BASE', name: 'Z-101 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_MIXED_SOUP_VEGETABLES', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 }`;

if (!content.includes('SFG_SWEET_SOUR_GRAVY')) {
  // Replace the SFG definition of SFG_G203
  content = content.replace(/costPerUnit: 0.18 \}/g, sfgInjection);
  console.log('SFG Inject: true');
}

const lastDish = "{ name: 'Saagwala Meat', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BLACK_BOWL']] } }";
const dishInjection = `{ name: 'Saagwala Meat', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BLACK_BOWL']] } },
    { name: 'American Chopsuey', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_LARGE_SHALLOW_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_LARGE_SHALLOW_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_LARGE_SHALLOW_BOWL']] } },
    { name: 'Chilli Paneer Dry', price: 260, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chilli Paneer Gravy', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chilli Chicken Dry', price: 300, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chilli Chicken Gravy', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Veg Manchurian Dry', price: 240, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Veg Manchurian Gravy', price: 260, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Manchurian Dry', price: 280, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Manchurian Gravy', price: 300, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Honey Chilli Potato', price: 220, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Hot & Sour Soup', price: 160, category: 'Soup', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SOUP_BOWL']] } },
    { name: 'Manchow Soup', price: 170, category: 'Soup', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SOUP_BOWL']] } }`;

if (!content.includes('American Chopsuey')) {
  content = content.replace(lastDish, dishInjection);
  console.log('Dish Inject: true');
}

const sfgRecipeInjectionStr = `    ,'SFG_SWEET_SOUR_GRAVY': [
      { itemModel: 'RawMaterial', code: 'RM_Z105', quantity: 500 }
    ],
    'SFG_CHILLI_LIQUID_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_Z102', quantity: 500 }
    ],
    'SFG_MANCHURIAN_LIQUID_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_Z101', quantity: 500 }
    ],
    'SFG_HONEY_CHILLI_GLAZE_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_Z105', quantity: 500 }
    ],
    'SFG_Z102_SOUP_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_Z102_LIQUID', quantity: 500 }
    ],
    'SFG_Z101_SOUP_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_Z101_LIQUID', quantity: 500 }
    ],
    'SFG_MIXED_SOUP_VEGETABLES': [
      { itemModel: 'RawMaterial', code: 'RM_MIXED_SOUP_VEGETABLES', quantity: 5000 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`;

if (!content.includes("'SFG_SWEET_SOUR_GRAVY':")) {
  content = content.replace("  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {", sfgRecipeInjectionStr);
  console.log('SFG Recipe Inject: true');
}

const dishRecipeInjectionStr = `    ,'American Chopsuey': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_SWEET_SOUR_GRAVY', quantity: 350 },
      { itemModel: 'RawMaterial', code: 'RM_MIX_VEG', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_CRISPY_NOODLE_NEST', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO_KETCHUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_PINEAPPLE_PIECES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_EGG_RAW', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 20 }
    ],
    'Chilli Paneer Dry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_LIQUID_BASE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_PANEER', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Chilli Paneer Gravy': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_LIQUID_BASE', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_PANEER', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Chilli Chicken Dry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_LIQUID_BASE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Chilli Chicken Gravy': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_LIQUID_BASE', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Veg Manchurian Dry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANCHURIAN_LIQUID_BASE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_VEG_MANCHURIAN_BALLS', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Veg Manchurian Gravy': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANCHURIAN_LIQUID_BASE', quantity: 275 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_VEG_MANCHURIAN_BALLS', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Chicken Manchurian Dry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANCHURIAN_LIQUID_BASE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_CHICKEN_MANCHURIAN', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Chicken Manchurian Gravy': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANCHURIAN_LIQUID_BASE', quantity: 275 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_CHICKEN_MANCHURIAN', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 }
    ],
    'Honey Chilli Potato': [
      { itemModel: 'RawMaterial', code: 'RM_DOUBLE_FRIED_POTATO', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HONEY_CHILLI_GLAZE_BASE', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO_KETCHUP', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_HONEY', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_SESAME', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 }
    ],
    'Hot & Sour Soup': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_Z102_SOUP_BASE', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MIXED_SOUP_VEGETABLES', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_VINEGAR', quantity: 2.5 },
      { itemModel: 'RawMaterial', code: 'RM_RED_CHILLI_PASTE', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 }
    ],
    'Manchow Soup': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_Z101_SOUP_BASE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MIXED_SOUP_VEGETABLES', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CORNFLOUR_SLURRY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CORIANDER_STEMS', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_VINEGAR', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_NOODLES', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SPRING_ONION', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'American Chopsuey':")) {
  content = content.replace("  };\n\n  for (const dish of dishData) {", dishRecipeInjectionStr);
  console.log('Dish Recipe Inject: true');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 11 applied successfully!');
