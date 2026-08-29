const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

if (content.includes("category: 'South India'")) {
    let newCode = content.replace(/category: 'South India'/g, "category: 'South Indian'");
    fs.writeFileSync(filePath, newCode, 'utf8');
    console.log('Successfully replaced South India with South Indian in blueprintSeeder');
} else {
    console.log('No South India found in blueprintSeeder');
}
