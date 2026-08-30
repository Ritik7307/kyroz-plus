const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/category:\s*'Main Course',\s*name:\s*\/biryani\/i/g, "category: 'Biryani'"); // Just in case
content = content.replace(/category:\s*'Main Course'/g, "category: 'Indian Curry'");
content = content.replace(/category:\s*'Tandoor Starter'/g, "category: 'Tandoor'");
content = content.replace(/category:\s*'Veg Starter'/g, "category: 'Tandoor'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed categories in blueprintSeeder.service.ts');
