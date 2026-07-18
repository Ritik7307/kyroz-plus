const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all 'PortionMaster' with 'SemiFinishedGood'
content = content.replace(/'PortionMaster'/g, "'SemiFinishedGood'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed PortionMaster issue');
