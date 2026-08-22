const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const missingRmStr = `
    // Tandoor Missing RMs
    { code: 'RM_LEMON_JUICE', name: 'Lemon Juice', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_OLIVE_OIL', name: 'Olive Oil', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
`;

const missingPkgStr = `
    // Tandoor Missing PKGs
    { code: 'PKG_SERVING_PLATE', name: 'Standard Serving Plate', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
`;

if (!content.includes('RM_LEMON_JUICE') || !content.includes('name: \'Lemon Juice\'')) {
    content = content.replace(/(const rmData = \[)/, "$1" + missingRmStr);
}

if (!content.includes('PKG_SERVING_PLATE') || !content.includes('name: \'Standard Serving Plate\'')) {
    content = content.replace(/(const packagingData = \[)/, "$1" + missingPkgStr);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Missing items patched successfully!');
