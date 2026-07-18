const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix RM missing commas before comments
content = content.replace(/costPerPurchaseUnit: 280 \}\s*\/\//g, 'costPerPurchaseUnit: 280 },\n\n    //');
content = content.replace(/costPerPurchaseUnit: 600 \}\s*\/\//g, 'costPerPurchaseUnit: 600 },\n\n    //');
content = content.replace(/costPerPurchaseUnit: 200 \}\s*\/\//g, 'costPerPurchaseUnit: 200 },\n\n    //');

// General fix for object entries missing commas
// Match } followed by newline and then { name:
content = content.replace(/\}\s*(\{ name: 'Desi Handi Chicken')/g, '},\n    $1');

// Match ] followed by newline and then 'Mini Uttapam':
content = content.replace(/\]\s*('Mini Uttapam':)/g, '],\n    $1');

// Let's do a more robust regex for RM array:
// } followed by \s* { code:
content = content.replace(/\}\s*(\{ code:)/g, '},\n    $1');

// Dish array:
// } followed by \s* { name:
content = content.replace(/\}\s*(\{ name:)/g, '},\n    $1');

// Recipe mappings:
// ] followed by \s* 'Some String':
content = content.replace(/\]\s*('[A-Za-z0-9_ -]+':)/g, '],\n    $1');

// SFG Defs:
// } followed by \s* { code: 'SFG_
content = content.replace(/\}\s*(\{ code: 'SFG_)/g, '},\n    $1');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Syntax errors fixed!');
