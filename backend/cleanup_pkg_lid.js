const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Find all occurrences of PKG_LID
const matches = [...content.matchAll(/code:\s*'PKG_LID'/g)];
console.log('Found PKG_LID occurrences:', matches.length);

if (matches.length > 1) {
    // Remove the first occurrence (or just replace the injected one)
    // The one from patch_cafe_c500.js is { code: 'PKG_LID', name: 'Lid', unit: 'pcs', currentStock: 5000, costPerUnit: 3 }
    content = content.replace(/.*code: 'PKG_LID', name: 'Lid', unit: 'pcs', currentStock: 5000, costPerUnit: 3.*\n/, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Removed duplicate PKG_LID');
} else {
    console.log('No duplicate found or already removed.');
}
