const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const models = ['RawMaterial', 'Packaging', 'SemiFinishedGood', 'Recipe', 'PortionMaster', 'Dish', 'Inventory'];

models.forEach(model => {
  content = content.replace(new RegExp(model + '\\.findOneAndUpdate', 'g'), '(' + model + ' as any).findOneAndUpdate');
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Types patched successfully!');
