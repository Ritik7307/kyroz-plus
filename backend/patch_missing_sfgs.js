const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const missingSfgsStr = `
    // Patch Missing SFGs from other recipes
    { code: 'SFG_PANEER_CUBES', name: 'SFG Paneer Cubes', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_GOLDEN_GARLIC_TOPPING', name: 'Golden Garlic Topping', batchYield: 500, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_FRIED_KOFTA', name: 'Fried Kofta', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.25 },
    { code: 'SFG_MALAI_KOFTA', name: 'Malai Kofta', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.30 },
    { code: 'SFG_BLANCHED_VEG_MIX', name: 'Blanched Veg Mix', batchYield: 2000, yieldUnit: 'gm', currentStock: 3000, costPerUnit: 0.15 },
    { code: 'SFG_FRIED_MAKHANA', name: 'Fried Makhana', batchYield: 500, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.40 },
`;

const missingSfgRecipesStr = `
    'SFG_PANEER_CUBES': [ { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1 } ],
    'SFG_GOLDEN_GARLIC_TOPPING': [ { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1 } ],
    'SFG_FRIED_KOFTA': [ { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1 } ],
    'SFG_MALAI_KOFTA': [ { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1 } ],
    'SFG_BLANCHED_VEG_MIX': [ { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1 } ],
    'SFG_FRIED_MAKHANA': [ { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 1 } ],
`;

// Only inject if SFG_FRIED_MAKHANA is not defined in sfgData
const sfgDataSection = content.substring(content.indexOf('const sfgData = ['), content.indexOf('const portionData = ['));

if (!sfgDataSection.includes('SFG_FRIED_MAKHANA')) {
    content = content.replace(/(const sfgData = \[)/, "$1" + missingSfgsStr);
    content = content.replace(/(const sfgRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + missingSfgRecipesStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Missing SFGs patched successfully!');
} else {
    console.log('Already patched.');
}
