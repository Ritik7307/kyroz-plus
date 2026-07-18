const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace `} \n\n    //` or `}\n\n    //` with `},\n\n    //`
content = content.replace(/\}[ \t]*\n\n[ \t]*\/\//g, '},\n\n    //');

// Replace `}\n\n    {` with `},\n\n    {`
content = content.replace(/\}[ \t]*\n\n[ \t]*\{/g, '},\n\n    {');

// Replace `]\n    '` with `],\n    '`
content = content.replace(/\][ \t]*\n[ \t]*'/g, '],\n    \'');

// Specifically for line 1326 where it's `]\n    'Mini Uttapam': [`
// The above `\][ \t]*\n[ \t]*'` should catch it. Let's make it robust:
content = content.replace(/\]\n\s*'/g, '],\n    \'');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Syntax fixed again!');
