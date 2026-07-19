const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The 10 Indian Veg Dishes for dishData
const vegDishData = `const dishData = [
    { name: 'Aloo Gobhi Matar (Semi-Gravy)', price: 250, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Corn Palak Cheese', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Kadhai Paneer', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Lehsunia Paneer', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta (Ivory)', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta Red', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Mushroom Do Pyaza', price: 290, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Navratan Korma', price: 350, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Palak Paneer', price: 300, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Paneer Butter Masala', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } }
  ];`;

const vegDishRecipes = `const dishRecipeMappings: Record<string, { itemModel: string, code: string, quantity: number }[]> = {
    'Aloo Gobhi Matar (Semi-Gravy)': [
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
    ],
    'Malai Kofta Red': [
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
  };`;

// Find bounds for dishData
const dishStart = content.indexOf('const dishData = [');
let dishEnd = content.indexOf('];', dishStart);
if (dishStart > -1 && dishEnd > -1) {
    content = content.substring(0, dishStart) + vegDishData + content.substring(dishEnd + 2);
}

// Find bounds for dishRecipeMappings
const dishRecipeStart = content.indexOf('const dishRecipeMappings: Record<string');
let dishRecipeEnd = content.indexOf('  };\n\n  for (const dish of dishData)');
if (dishRecipeEnd === -1) dishRecipeEnd = content.indexOf('};', dishRecipeStart);

if (dishRecipeStart > -1 && dishRecipeEnd > -1) {
    // we want to replace from dishRecipeStart up to (but not including) the closing }; or for loop
    const subStart = content.substring(0, dishRecipeStart);
    // Find the end of the dishRecipeMappings object
    let actualEnd = content.indexOf('};', dishRecipeStart) + 2;
    content = subStart + vegDishRecipes + content.substring(actualEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Stripped other dishes completely!');
