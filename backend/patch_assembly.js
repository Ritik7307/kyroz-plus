const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Add new raw materials to rmData
const rmDataToInject = `    { code: 'RM_LETTUCE', name: 'Lettuce/Cabbage', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 60 },
    { code: 'RM_TOMATO', name: 'Tomato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 40 },
    { code: 'RM_ONION', name: 'Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 30 },
    { code: 'RM_OLIVE_OIL', name: 'Olive Oil', category: 'Fat', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },`;

if (!content.includes('RM_LETTUCE')) {
  content = content.replace("    // New Raw Materials", "    // New Raw Materials\n" + rmDataToInject);
}

// Add SFGs to sfgData
const sfgDataToInject = `    { code: 'SFG_PIZZA_BASE_PERSONAL', name: '8 inch Pizza Base', batchYield: 1, yieldUnit: 'pc', currentStock: 100, costPerUnit: 10 },
    { code: 'SFG_PIZZA_BASE_MEDIUM', name: '10 inch Pizza Base', batchYield: 1, yieldUnit: 'pc', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_PIZZA_BASE_LARGE', name: '12 inch Pizza Base', batchYield: 1, yieldUnit: 'pc', currentStock: 100, costPerUnit: 20 },
    { code: 'SFG_PREPARED_PIZZA_SAUCE', name: 'Prepared Pizza Sauce', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.1 },`;

if (!content.includes('SFG_PIZZA_BASE_PERSONAL')) {
  content = content.replace("    // Base Gravies", "    // Base Gravies\n" + sfgDataToInject);
}

// Add to sfgRecipeMappings
const sfgRecipesToInject = `    'SFG_PIZZA_BASE_PERSONAL': [{ itemModel: 'PortionMaster', code: 'PORTION_PIZZA_DOUGH_PERSONAL', quantity: 1 }],
    'SFG_PIZZA_BASE_MEDIUM': [{ itemModel: 'PortionMaster', code: 'PORTION_PIZZA_DOUGH_MEDIUM', quantity: 1 }],
    'SFG_PIZZA_BASE_LARGE': [{ itemModel: 'PortionMaster', code: 'PORTION_PIZZA_DOUGH_LARGE', quantity: 1 }],
    'SFG_PREPARED_PIZZA_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 4000 }
    ],`;

if (!content.includes("'SFG_PIZZA_BASE_PERSONAL':")) {
  content = content.replace("  const sfgRecipeMappings: Record<string, { itemModel: string, code: string, quantity: number }[]> = {", "  const sfgRecipeMappings: Record<string, { itemModel: string, code: string, quantity: number }[]> = {\n" + sfgRecipesToInject);
}

// Exact Dish string replacements
const dishesToUpdate = [
  // BURGERS
  {
    from: `    'Classic Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_ALOO_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 }
    ],`,
    to: `    'Classic Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_ALOO_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],`
  },
  {
    from: `    'Crispy Veggie Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_VEG_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 }
    ],`,
    to: `    'Crispy Veggie Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_VEG_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],`
  },
  {
    from: `    'Tandoori Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_ALOO_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_TANDOORI_BURGER_SAUCE', quantity: 1 }
    ],`,
    to: `    'Tandoori Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_ALOO_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_TANDOORI_BURGER_SAUCE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],`
  },
  {
    from: `    'Paneer Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_PANEER_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 }
    ],`,
    to: `    'Paneer Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_PANEER_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],`
  },
  {
    from: `    'Classic Chicken Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 }
    ],`,
    to: `    'Classic Chicken Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],`
  },
  {
    from: `    'Zinger Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_ZINGER_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_SPICY_BURGER_SAUCE', quantity: 1 }
    ],`,
    to: `    'Zinger Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_ZINGER_PATTY', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_SPICY_BURGER_SAUCE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 }
    ],`
  },
  // SANDWICHES
  {
    from: `    'Crispy Chicken Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_FILLING', quantity: 50 }
    ],`,
    to: `    'Crispy Chicken Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 }
    ],`
  },
  {
    from: `    'Classic Corn Cheese Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 }
    ],`,
    to: `    'Classic Corn Cheese Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 }
    ],`
  },
  {
    from: `    'Veg Grilled Club': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_FILLING', quantity: 50 }
    ],`,
    to: `    'Veg Grilled Club': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 }
    ],`
  },
  {
    from: `    'Peri-Peri Paneer Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_FILLING', quantity: 50 },
      { itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 }
    ],`,
    to: `    'Peri-Peri Paneer Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 }
    ],`
  },
  {
    from: `    'Red Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 190 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAUCE_PORTION_PERSONAL', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 10 }
    ],`,
    to: `    'Red Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_WATER_STOCK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 10 }
    ],`
  },
  {
    from: `    'White Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 190 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SAUCE', quantity: 1 }
    ],`,
    to: `    'White Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],`
  },
  {
    from: `    'Pink Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 190 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 25 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SAUCE', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 5 }
    ],`,
    to: `    'Pink Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_WATER_STOCK', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],`
  },
  {
    from: `    'Vanilla Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_VANILLA_CORE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Vanilla Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 40 }
    ],`
  },
  {
    from: `    'Cold Coffee': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Cold Coffee': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 }
    ],`
  },
  {
    from: `    'Chocolate Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CHOCO_SYRUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Chocolate Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 45 }
    ],`
  },
  {
    from: `    'Oreo Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OREO_ADDON', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Oreo Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_OREO_ADDON', quantity: 2 }
    ],`
  },
  {
    from: `    'KitKat Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KITKAT_ADDON', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'KitKat Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_KITKAT_ADDON', quantity: 1 }
    ],`
  },
  {
    from: `    'Hazelnut Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HAZELNUT_SYRUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Hazelnut Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_HAZELNUT_SYRUP', quantity: 15 }
    ],`
  },
  {
    from: `    'Mocha Frappe': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DARK_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Mocha Frappe': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 }
    ],`
  },
  {
    from: `    'Strawberry Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_STRAWBERRY_CORE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Strawberry Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_STRAWBERRY_CORE', quantity: 20 }
    ],`
  },
  {
    from: `    'Mango Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_WHITE_SHAKE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MANGO_SYRUP', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],`,
    to: `    'Mango Shake': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_MANGO_SYRUP', quantity: 20 }
    ],`
  }
];

for (const r of dishesToUpdate) {
  content = content.replace(r.from, r.to);
}

// Regex to replace all Pizza definitions with our new standardized Pizza components
// Current formats are:
// 'Personal Farmhouse Pizza': [ ... ]
// 'Medium Margherita': [ ... ]
// They all start with 'Personal ', 'Medium ', or 'Large ' and end with ' Pizza': [ ... ] or ' Margherita': [ ... ]

content = content.replace(/    '(Personal|Medium|Large) (.*?)': \[[^\]]*\],/g, (match, size, flavor) => {
  if (!flavor.includes('Pizza') && !flavor.includes('Margherita')) {
    return match; // Don't mess with non-pizza items if any
  }
  let quantityMultiplier = size === 'Personal' ? 1 : size === 'Medium' ? 1.5 : 2;
  
  // Specific additional toppings based on flavor
  let extraToppings = '';
  if (flavor.includes('Corn Cheese')) {
    extraToppings = `\n      { itemModel: 'RawMaterial', code: 'RM_CORN_RAW', quantity: ${30 * quantityMultiplier} },`;
  } else if (flavor.includes('Paneer')) {
    extraToppings = `\n      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: ${40 * quantityMultiplier} },`;
  } else if (flavor.includes('Chicken')) {
    extraToppings = `\n      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PORTION_PERSONAL', quantity: ${1 * quantityMultiplier} },`;
  }

  return `    '${size} ${flavor}': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_${size.toUpperCase()}', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: ${50 * quantityMultiplier} },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: ${90 * quantityMultiplier} },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: ${40 * quantityMultiplier} },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: ${3 * quantityMultiplier} },
      { itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 }${extraToppings}
    ],`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Assembly Engine exact specifications patched successfully!');
