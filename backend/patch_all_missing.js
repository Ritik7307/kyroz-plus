const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const missingRMsStr = `
    // Patch Missing RMs from other recipes
    { code: 'RM_FRYING_OIL', name: 'Frying Oil', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_SHAHI_JEERA', name: 'Shahi Jeera', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 400 },
    { code: 'RM_FRESH_GINGER', name: 'Fresh Ginger', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_KASHMIRI_CHILLI_POWDER', name: 'Kashmiri Chilli Powder', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 350 },
    { code: 'RM_ONION_PETALS', name: 'Onion Petals', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'RM_CURD_FRESH_CREAM', name: 'Curd / Fresh Cream', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 150 },
    { code: 'RM_PINEAPPLE_CHUNKS', name: 'Pineapple Chunks', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 180 },
    { code: 'RM_FRIED_CASHEW', name: 'Fried Cashew', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_RAISINS', name: 'Raisins', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_POMEGRANATE_SEEDS', name: 'Pomegranate Seeds', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 150 },
    { code: 'RM_VEG_STOCK_WATER', name: 'Veg Stock Water', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 10 },
    { code: 'RM_WHOLE_JEERA', name: 'Whole Jeera', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 300 },
    { code: 'RM_HONEY', name: 'Honey', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },
`;

if (!content.includes('name: \'Frying Oil\'')) {
    content = content.replace(/(const rmData = \[)/, "$1" + missingRMsStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Missing RMs patched successfully!');
} else {
    console.log('Already patched.');
}
