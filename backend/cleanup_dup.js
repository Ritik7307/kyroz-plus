const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Remove my injected RM_DRY_RED_CHILLI (the one with category 'Grocery' and consumptionUnit 'gm')
content = content.replace(/.*code: 'RM_DRY_RED_CHILLI', name: 'Dry Red Chilli', category: 'Grocery'.*\n/, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Removed duplicate RM_DRY_RED_CHILLI');
