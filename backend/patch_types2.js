const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const models = ['Dish', 'RawMaterial', 'Packaging', 'SemiFinishedGood', 'Recipe', 'PortionMaster', 'Inventory'];

models.forEach(model => {
  content = content.replace(new RegExp(model + '\\.findOne\\(', 'g'), '(' + model + ' as any).findOne(');
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Types patched successfully again!');
