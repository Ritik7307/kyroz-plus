const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const missingPkgStr = `
    // Tandoor Missing PKGs
    { code: 'PKG_ARABIAN_PLATTER', name: 'Arabian Platter', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_KHABOOS', name: 'Khaboos Bread', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_SERVING_PLATE', name: 'Standard Serving Plate', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
`;

if (!content.includes('PKG_SERVING_PLATE') || !content.includes('name: \'Standard Serving Plate\'')) {
    content = content.replace(/(const pkgData = \[)/, "$1" + missingPkgStr);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Packaging items patched successfully into pkgData!');
