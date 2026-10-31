const fs = require('fs');
let content = fs.readFileSync('src/services/blueprintSeeder.service.ts', 'utf8');

content = content.replace('{ $set: { ...rm, userId } }', '{ $set: { ...rm, currentStock: 0, userId } }');
content = content.replace('{ $set: { ...sfg, userId } }', '{ $set: { ...sfg, currentStock: 0, userId } }');
content = content.replace('{ $set: { ...pkg, userId } }', '{ $set: { ...pkg, currentStock: 0, userId } }');

fs.writeFileSync('src/services/blueprintSeeder.service.ts', content, 'utf8');
console.log('Successfully updated blueprintSeeder.service.ts');
