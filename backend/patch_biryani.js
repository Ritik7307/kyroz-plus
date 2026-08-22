const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const rmInjectionStr = `    // B-401 Biryani RMs
    { code: 'RM_B401', name: 'B-401 ROYAL AWADH', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 450 },
    { code: 'RM_BASMATI_RICE', name: 'Long Grain Basmati Rice', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 140 },
    { code: 'RM_GHEE', name: 'Pure Ghee', category: 'Dairy', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 600 },
    { code: 'RM_KEWRA_WATER', name: 'Kewra + Attar', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 300 },
    { code: 'RM_FOOD_COLOUR', name: 'Food Colour', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 200 },\n`;

const pkgInjectionStr = `    // Biryani Packaging
    { code: 'PKG_BIRYANI_CONTAINER', name: 'Biryani Container', unit: 'pcs', currentStock: 2000, costPerUnit: 20 },\n`;

const sfgDefInjectionStr = `    // Biryani Batches & SFGs
    { code: 'SFG_YAKHNI_CHICKEN', name: '80% Cooked Yakhni Chicken', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.28 },
    { code: 'SFG_70_BOILED_RICE', name: '70% Boiled Rice', batchYield: 2200, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.08 },
    { code: 'SFG_BROWN_ONION', name: 'Brown Onion (Birista)', batchYield: 200, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.25 },
    { code: 'SFG_PREPARED_BIRYANI', name: 'Prepared Biryani (Dum)', batchYield: 3200, yieldUnit: 'gm', currentStock: 15000, costPerUnit: 0.15 },\n`;

const dishInjectionStr = `    // Biryani Dishes
    { name: 'Chicken Biryani', price: 349, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;

const sfgRecipeInjectionStr = `    'SFG_YAKHNI_CHICKEN': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_B401', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_GHEE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 50 }
    ],
    'SFG_70_BOILED_RICE': [
      { itemModel: 'RawMaterial', code: 'RM_BASMATI_RICE', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1500 }
    ],
    'SFG_BROWN_ONION': [
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 100 }
    ],
    'SFG_PREPARED_BIRYANI': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_YAKHNI_CHICKEN', quantity: 1000 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_70_BOILED_RICE', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_KEWRA_WATER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FOOD_COLOUR', quantity: 5 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_BROWN_ONION', quantity: 70 }
    ],\n`;

const dishRecipeInjectionStr = `    'Chicken Biryani': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_BIRYANI', quantity: 350 }
    ],\n`;

if (!content.includes('Chicken Biryani')) {
    // Arrays
    content = content.replace("const rmData = [", "const rmData = [\n" + rmInjectionStr);
    content = content.replace("const pkgData = [", "const pkgData = [\n" + pkgInjectionStr);
    content = content.replace("const sfgData = [", "const sfgData = [\n" + sfgDefInjectionStr);
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);

    // Objects
    content = content.replace(/(const sfgRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + sfgRecipeInjectionStr);
    
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + dishRecipeInjectionStr);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Biryani Patch applied successfully!');
} else {
    console.log('Already patched.');
}
