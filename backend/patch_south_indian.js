const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const rmInjectionStr = `    // South Indian S-300 Series
    { code: 'RM_S301', name: 'S-301 Coastal Crust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'RM_S302', name: 'S-302 Yellow Temper', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_S303', name: 'S-303 Rava Pearl', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 160 },
    { code: 'RM_S304', name: 'S-304 Crunch Core', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 190 },
    { code: 'RM_S305', name: 'S-305 Steam Cloud', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 170 },
    { code: 'RM_S306', name: 'S-306 Tangy Tropic', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 220 },
    { code: 'RM_S307', name: 'S-307 Kerala Kernel', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 240 },
    { code: 'RM_S308', name: 'S-308 Lentil Lava', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 210 },
    { code: 'RM_WATER', name: 'Water', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 100000, costPerPurchaseUnit: 1 },
    { code: 'RM_ONION', name: 'Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 40 },
    { code: 'RM_TOMATO', name: 'Tomato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 50 },
    { code: 'RM_MUSTARD_SEEDS', name: 'Mustard Seeds', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_URAD_DAL', name: 'Urad Dal', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_CURRY_LEAVES', name: 'Curry Leaves', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 80 },
    { code: 'RM_DRY_RED_CHILLI', name: 'Dry Red Chilli', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 3000, costPerPurchaseUnit: 250 },
    { code: 'RM_BOILED_POTATOES', name: 'Boiled Potatoes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 60 },
    { code: 'RM_BOILED_VEGETABLES', name: 'Boiled Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 70 },\n`;

const pkgInjectionStr = `    // South Indian Packaging
    { code: 'PKG_BATTER_CONTAINER', name: 'Batter Container', unit: 'pcs', currentStock: 1000, costPerUnit: 10 },
    { code: 'PKG_FOOD_GRADE_CONTAINER', name: 'Food Grade Container', unit: 'pcs', currentStock: 1000, costPerUnit: 12 },
    { code: 'PKG_CHUTNEY_CONTAINER', name: 'Chutney Container', unit: 'pcs', currentStock: 2000, costPerUnit: 5 },
    { code: 'PKG_SAMBHAR_CONTAINER', name: 'Sambhar Container', unit: 'pcs', currentStock: 2000, costPerUnit: 8 },
    { code: 'PKG_BATCH_LABEL', name: 'Batch Label', unit: 'pcs', currentStock: 5000, costPerUnit: 1 },\n`;

const sfgDefInjectionStr = `    // South Indian Batters and Bases
    { code: 'SFG_DOSA_BATTER_S301', name: 'Dosa Batter S-301', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_ALOO_MASALA_S302', name: 'Aloo Masala S-302', batchYield: 1500, yieldUnit: 'gm', currentStock: 3000, costPerUnit: 0.15 },
    { code: 'SFG_RAVA_BATTER_S303', name: 'Rava Batter S-303', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_VADA_BATTER_S304', name: 'Vada Batter S-304', batchYield: 1800, yieldUnit: 'gm', currentStock: 3000, costPerUnit: 0.11 },
    { code: 'SFG_IDLI_BATTER_S305', name: 'Idli/Uttapam Batter S-305', batchYield: 2200, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_RED_CHUTNEY_S306', name: 'Red Chutney S-306', batchYield: 3500, yieldUnit: 'gm', currentStock: 4000, costPerUnit: 0.07 },
    { code: 'SFG_COCONUT_CHUTNEY_S307', name: 'Coconut Chutney S-307', batchYield: 3500, yieldUnit: 'gm', currentStock: 4000, costPerUnit: 0.08 },
    { code: 'SFG_SAMBHAR_S308', name: 'Sambhar S-308', batchYield: 10000, yieldUnit: 'ml', currentStock: 15000, costPerUnit: 0.04 },\n`;

const dishInjectionStr = `    // South Indian Dishes
    { name: 'Mix-Veg Uttapam', price: 179, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Plain Dosa', price: 149, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Masala Dosa', price: 189, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Butter Dosa', price: 169, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Onion Rava Dosa', price: 199, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Medu Vada', price: 119, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Regular Idli', price: 99, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mini Idli', price: 119, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;

const sfgRecipeInjectionStr = `    'SFG_DOSA_BATTER_S301': [
      { itemModel: 'RawMaterial', code: 'RM_S301', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1500 }
    ],
    'SFG_ALOO_MASALA_S302': [
      { itemModel: 'RawMaterial', code: 'RM_BOILED_POTATOES', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_S302', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 50 }
    ],
    'SFG_RAVA_BATTER_S303': [
      { itemModel: 'RawMaterial', code: 'RM_S303', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 2500 }
    ],
    'SFG_VADA_BATTER_S304': [
      { itemModel: 'RawMaterial', code: 'RM_S304', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 800 }
    ],
    'SFG_IDLI_BATTER_S305': [
      { itemModel: 'RawMaterial', code: 'RM_S305', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1200 }
    ],
    'SFG_RED_CHUTNEY_S306': [
      { itemModel: 'RawMaterial', code: 'RM_S306', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 2500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_SEEDS', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_URAD_DAL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_CURRY_LEAVES', quantity: 5 }
    ],
    'SFG_COCONUT_CHUTNEY_S307': [
      { itemModel: 'RawMaterial', code: 'RM_S307', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 2500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_SEEDS', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CURRY_LEAVES', quantity: 5 }
    ],
    'SFG_SAMBHAR_S308': [
      { itemModel: 'RawMaterial', code: 'RM_S308', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 9000 },
      { itemModel: 'RawMaterial', code: 'RM_BOILED_VEGETABLES', quantity: 1500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_SEEDS', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CURRY_LEAVES', quantity: 5 }
    ],\n`;

const dishRecipeInjectionStr = `    'Mix-Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 8 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Plain Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER_S301', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER_S301', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA_S302', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Butter Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER_S301', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_S303', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 8 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER_S304', quantity: 70 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 8 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 120 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Regular Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 120 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Mini Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 25 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 60 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],\n`;

if (!content.includes('S-301 Coastal Crust')) {
    // Arrays
    content = content.replace("const rmData = [", "const rmData = [\n" + rmInjectionStr);
    content = content.replace("const pkgData = [", "const pkgData = [\n" + pkgInjectionStr);
    content = content.replace("const sfgData = [", "const sfgData = [\n" + sfgDefInjectionStr);
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);

    // Objects
    content = content.replace(/(const sfgRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + sfgRecipeInjectionStr);
    
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + dishRecipeInjectionStr);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('South Indian Patch applied successfully!');
} else {
    console.log('Already patched.');
}
