const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const rmInjectionStr = `    // C-500 Series Master Bases & Raw Materials
    { code: 'RM_C501', name: 'C-501 DOUGH MASTER', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 180 },
    { code: 'RM_C502', name: 'C-502 GRILL DUST', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 250 },
    { code: 'RM_C503', name: 'C-503 VELVET GLAZE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 300 },
    { code: 'RM_C504', name: 'C-504 HERB INFUSION', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_C505', name: 'C-505 ALFREDO CORE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_C506', name: 'C-506 MARINARA CORE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_C507', name: 'C-507 SNOW BASE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 280 },
    { code: 'RM_C508', name: 'C-508 COCOA BASE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 320 },
    { code: 'RM_C509', name: 'C-509 FIRE DUST', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'RM_C510', name: 'C-510 ZING MASTER', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 260 },
    { code: 'RM_DUSTING_FLOUR', name: 'Dusting Flour', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 40 },
    { code: 'RM_BREADCRUMBS', name: 'Breadcrumbs', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 80 },
    { code: 'RM_LIQUID_CHEESE', name: 'Liquid Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 300 },
    { code: 'RM_VEG_EXTRA_THICK_MAYO', name: 'Veg Extra Thick Mayo', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 120 },
    { code: 'RM_TOMATO_KETCHUP', name: 'Tomato Ketchup', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 90 },
    { code: 'RM_BURGER_BUN', name: 'Burger Bun', category: 'Bakery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 8 },
    { code: 'RM_CHEESE_SLICE', name: 'Cheese Slice', category: 'Dairy', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 1000, costPerPurchaseUnit: 12 },
    { code: 'RM_TORTILLA', name: '8/10 inch Tortilla', category: 'Bakery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 10 },
    { code: 'RM_FRENCH_FRIES', name: 'French Fries (Frozen)', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 110 },
    { code: 'RM_CHICKEN_NUGGETS', name: 'Chicken Nuggets (Frozen)', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 250 },
    { code: 'RM_FRUIT_SYRUPS', name: 'Fruit Syrups', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_INSTANT_COFFEE', name: 'Instant Coffee', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 800 },
    { code: 'RM_OREO', name: 'Oreo Biscuits', category: 'Grocery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 1000, costPerPurchaseUnit: 3 },
    { code: 'RM_HAZELNUT_SYRUP', name: 'Hazelnut Syrup', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },
    { code: 'RM_ICE_CUBES', name: 'Ice Cubes', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 10 },
    { code: 'RM_RAW_PASTA', name: 'Raw Pasta', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 150 },
    { code: 'RM_CHICKEN_MINCE', name: 'Chicken Mince', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 280 },\n`;

const pkgInjectionStr = `    // C-500 Series Packaging
    { code: 'PKG_DOUGH_TRAY', name: 'Food Grade Dough Tray', unit: 'pcs', currentStock: 200, costPerUnit: 50 },
    { code: 'PKG_PLASTIC_WRAP', name: 'Plastic Wrap', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_SAUCE_BOTTLE', name: '1 L Sauce Bottle', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_DIP_CUP', name: 'Dip Cup', unit: 'pcs', currentStock: 5000, costPerUnit: 1 },
    { code: 'PKG_SEASONING_SACHET', name: 'Seasoning Sachet', unit: 'pcs', currentStock: 10000, costPerUnit: 0.5 },
    { code: 'PKG_CHICKEN_BUCKET', name: 'Chicken Box/Bucket', unit: 'pcs', currentStock: 1000, costPerUnit: 20 },
    { code: 'PKG_BURGER_BOX', name: 'Burger Wrap/Box', unit: 'pcs', currentStock: 5000, costPerUnit: 8 },
    { code: 'PKG_PIZZA_BOX', name: 'Pizza Box', unit: 'pcs', currentStock: 2000, costPerUnit: 18 },
    { code: 'PKG_SANDWICH_BOX', name: 'Sandwich Box', unit: 'pcs', currentStock: 2000, costPerUnit: 10 },
    { code: 'PKG_WRAP_BOX', name: 'Wrap Sleeve / Box', unit: 'pcs', currentStock: 3000, costPerUnit: 8 },
    { code: 'PKG_PASTA_BOWL', name: 'Pasta Bowl', unit: 'pcs', currentStock: 3000, costPerUnit: 15 },
    { code: 'PKG_LID', name: 'Lid', unit: 'pcs', currentStock: 5000, costPerUnit: 3 },
    { code: 'PKG_BEVERAGE_CUP', name: 'Beverage Cup', unit: 'pcs', currentStock: 5000, costPerUnit: 8 },
    { code: 'PKG_PAPER_STRAW', name: 'Paper Straw', unit: 'pcs', currentStock: 10000, costPerUnit: 2 },\n`;

const sfgDefInjectionStr = `    // C-500 Series SFGs
    { code: 'SFG_PREPARED_PIZZA_DOUGH', name: 'Prepared Pizza Dough', batchYield: 1700, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'SFG_10_INCH_PIZZA_BASE', name: '10 inch Pizza Base', batchYield: 1, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 25 },
    { code: 'SFG_12_INCH_PIZZA_BASE', name: '12 inch Pizza Base', batchYield: 1, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 35 },
    { code: 'SFG_VEG_PATTY', name: 'Prepared Veg Patty', batchYield: 13, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 12 },
    { code: 'SFG_CHICKEN_PATTY', name: 'Prepared Chicken Patty', batchYield: 13, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 28 },
    { code: 'SFG_CLASSIC_BURGER_SAUCE', name: 'Classic Burger Sauce', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.15 },
    { code: 'SFG_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce', batchYield: 360, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.16 },
    { code: 'SFG_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_HERB_GARLIC_BUTTER', name: 'Herb Garlic Butter', batchYield: 240, yieldUnit: 'gm', currentStock: 500, costPerUnit: 0.45 },
    { code: 'SFG_HERB_GARLIC_MAYO', name: 'Herb Garlic Mayo', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.18 },
    { code: 'SFG_MARINATED_CHICKEN_C510', name: '24-Hour Marinated Chicken (C-510)', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.28 },
    { code: 'SFG_COATED_CHICKEN_C510', name: 'Double Coated Chicken (C-510)', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.30 },
    { code: 'SFG_PREPARED_PIZZA_SAUCE', name: 'Prepared Pizza Sauce', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.10 },
    { code: 'SFG_BOILED_PASTA_C500', name: '80% Boiled Pasta', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.15 },\n`;

const dishInjectionStr = `    // C-500 Cafe Dishes
    { name: '10 Inch Margherita Pizza', price: 299, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Classic Burger', price: 149, category: 'Burger', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Wrap', price: 179, category: 'Wrap', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'French Fries (Cafe)', price: 99, category: 'Snacks', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Popcorn Chicken (Cafe)', price: 199, category: 'Snacks', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Pink Sauce Pasta (Cafe)', price: 249, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Vanilla Shake (Cafe)', price: 149, category: 'Beverages', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_PAPER_STRAW']] } },
    { name: 'Cold Coffee (Cafe)', price: 169, category: 'Beverages', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_PAPER_STRAW']] } },\n`;

const sfgRecipeInjectionStr = `    'SFG_PREPARED_PIZZA_DOUGH': [
      { itemModel: 'RawMaterial', code: 'RM_C501', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 600 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 100 }
    ],
    'SFG_10_INCH_PIZZA_BASE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_DOUGH', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DUSTING_FLOUR', quantity: 10 }
    ],
    'SFG_12_INCH_PIZZA_BASE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_DOUGH', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_DUSTING_FLOUR', quantity: 15 }
    ],
    'SFG_VEG_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_BOILED_POTATOES', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_BREADCRUMBS', quantity: 100 }
    ],
    'SFG_CHICKEN_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_MINCE', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_BREADCRUMBS', quantity: 100 }
    ],
    'SFG_CLASSIC_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_VEG_EXTRA_THICK_MAYO', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO_KETCHUP', quantity: 80 }
    ],
    'SFG_TANDOORI_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_VEG_EXTRA_THICK_MAYO', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO_KETCHUP', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 30 }
    ],
    'SFG_CHEESY_GARLIC_DIP': [
      { itemModel: 'RawMaterial', code: 'RM_VEG_EXTRA_THICK_MAYO', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_LIQUID_CHEESE', quantity: 130 }
    ],
    'SFG_HERB_GARLIC_BUTTER': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C504', quantity: 40 }
    ],
    'SFG_HERB_GARLIC_MAYO': [
      { itemModel: 'RawMaterial', code: 'RM_VEG_EXTRA_THICK_MAYO', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_C504', quantity: 80 }
    ],
    'SFG_MARINATED_CHICKEN_C510': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_MANDI', quantity: 4000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 400 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 600 }
    ],
    'SFG_COATED_CHICKEN_C510': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_C510', quantity: 4000 },
      { itemModel: 'RawMaterial', code: 'RM_DUSTING_FLOUR', quantity: 1000 }
    ],
    'SFG_PREPARED_PIZZA_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 4000 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 500 }
    ],
    'SFG_BOILED_PASTA_C500': [
      { itemModel: 'RawMaterial', code: 'RM_RAW_PASTA', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 3000 }
    ],\n`;

const dishRecipeInjectionStr = `    '10 Inch Margherita Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_10_INCH_PIZZA_BASE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_LIQUID_CHEESE', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Classic Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Veg Wrap': [
      { itemModel: 'RawMaterial', code: 'RM_TORTILLA', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TANDOORI_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'French Fries (Cafe)': [
      { itemModel: 'RawMaterial', code: 'RM_FRENCH_FRIES', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 12 }
    ],
    'Popcorn Chicken (Cafe)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_COATED_CHICKEN_C510', quantity: 240 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Pink Sauce Pasta (Cafe)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA_C500', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Vanilla Shake (Cafe)': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_ICE_CUBES', quantity: 30 }
    ],
    'Cold Coffee (Cafe)': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_INSTANT_COFFEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_ICE_CUBES', quantity: 30 }
    ],\n`;

if (!content.includes('RM_C501')) {
    // Arrays
    content = content.replace("const rmData = [", "const rmData = [\n" + rmInjectionStr);
    content = content.replace("const pkgData = [", "const pkgData = [\n" + pkgInjectionStr);
    content = content.replace("const sfgData = [", "const sfgData = [\n" + sfgDefInjectionStr);
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);

    // Objects
    content = content.replace(/(const sfgRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + sfgRecipeInjectionStr);
    
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + dishRecipeInjectionStr);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('C-500 Cafe Patch applied successfully!');
} else {
    console.log('Already patched.');
}
