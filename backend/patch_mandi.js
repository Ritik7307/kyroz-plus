const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const rmInjectionStr = `    // Indo Arabic Mandi RMs
    { code: 'RM_CHICKEN_MANDI', name: 'Chicken LG + Thigh', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 220 },
    { code: 'RM_MUTTON_MANDI', name: 'Mutton', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 800 },
    { code: 'RM_SELLA_RICE', name: 'Long Grain/Sella Rice', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 120 },
    { code: 'RM_B404A', name: 'B-404 A', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_B404B', name: 'B-404 B', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_COAL', name: 'Coal', category: 'Fuel', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 30 },\n`;

const pkgInjectionStr = `    // Mandi Packaging
    { code: 'PKG_MANDI_CONTAINER', name: 'Mandi Container', unit: 'pcs', currentStock: 2000, costPerUnit: 15 },
    { code: 'PKG_FOIL', name: 'Aluminium Foil', unit: 'pcs', currentStock: 5000, costPerUnit: 2 },
    { code: 'PKG_SPOON', name: 'Plastic Spoon', unit: 'pcs', currentStock: 10000, costPerUnit: 1 },\n`;

const sfgDefInjectionStr = `    // Mandi Batches & SFGs
    { code: 'SFG_STEAMED_CHICKEN_MANDI', name: 'Steamed Chicken Mandi', batchYield: 6, yieldUnit: 'pcs', currentStock: 60, costPerUnit: 45 },
    { code: 'SFG_STEAMED_MUTTON_MANDI', name: 'Steamed Mutton Mandi', batchYield: 6, yieldUnit: 'pcs', currentStock: 30, costPerUnit: 150 },
    { code: 'SFG_MANDI_STOCK', name: 'Mandi Stock', batchYield: 2000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0 },
    { code: 'SFG_MANDI_RICE', name: 'Mandi Rice', batchYield: 3200, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.1 },\n`;

const dishInjectionStr = `    // Mandi Dishes
    { name: 'Chicken White Mandi', price: 399, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mutton White Mandi', price: 599, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },\n`;

const sfgRecipeInjectionStr = `    'SFG_STEAMED_CHICKEN_MANDI': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_MANDI', quantity: 1300 },
      { itemModel: 'RawMaterial', code: 'RM_B404A', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'SFG_STEAMED_MUTTON_MANDI': [
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_MANDI', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_B404A', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'SFG_MANDI_RICE': [
      { itemModel: 'RawMaterial', code: 'RM_SELLA_RICE', quantity: 1000 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_STOCK', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_B404B', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 100 }
    ],
    'SFG_MANDI_STOCK': [
        { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 2000 }
    ],\n`;

const dishRecipeInjectionStr = `    'Chicken White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_RICE', quantity: 500 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_STEAMED_CHICKEN_MANDI', quantity: 1 }
    ],
    'Mutton White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_RICE', quantity: 500 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_STEAMED_MUTTON_MANDI', quantity: 1 }
    ],\n`;

if (!content.includes('Chicken White Mandi')) {
    // Arrays
    content = content.replace("const rmData = [", "const rmData = [\n" + rmInjectionStr);
    content = content.replace("const pkgData = [", "const pkgData = [\n" + pkgInjectionStr);
    content = content.replace("const sfgData = [", "const sfgData = [\n" + sfgDefInjectionStr);
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);

    // Objects
    content = content.replace(/(const sfgRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + sfgRecipeInjectionStr);
    
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + dishRecipeInjectionStr);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Mandi Patch applied successfully!');
} else {
    console.log('Already patched.');
}
