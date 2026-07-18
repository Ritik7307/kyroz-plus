const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix missing commas before injections
// Looking for `}\r\n    //` or `}\n    //` where `}` doesn't have a comma.
content = content.replace(/\}[\r\n]+(\s*\/\/ Indian Gravy & Spices)/g, '},\n$1');
content = content.replace(/\}[\r\n]+(\s*\/\/ More Indian Spices & Ingredients)/g, '},\n$1');
content = content.replace(/\}[\r\n]+(\s*\/\/ Indian Gravy Packaging)/g, '},\n$1');
content = content.replace(/\}[\r\n]+(\s*\/\/ Premium White Bowl)/g, '},\n$1');
content = content.replace(/\}[\r\n]+(\s*\/\/ Indian Gravies)/g, '},\n$1');
content = content.replace(/\}[\r\n]+(\s*\/\/ Precooked items)/g, '},\n$1');

// For recipes, it's before `'SFG_G205':` and `'SFG_PRECOOKED_KEEMA':` and `'Desi Handi Chicken':` and `'Chicken Kali Mirch':`
content = content.replace(/\][\r\n]+(\s*'SFG_G205':)/g, '],\n$1');
content = content.replace(/\][\r\n]+(\s*'SFG_PRECOOKED_KEEMA':)/g, '],\n$1');
content = content.replace(/\}[\r\n]+(\s*\{ name: 'Desi Handi Chicken')/g, '},\n$1');
content = content.replace(/\}[\r\n]+(\s*\{ name: 'Chicken Kali Mirch')/g, '},\n$1');
content = content.replace(/\][\r\n]+(\s*'Desi Handi Chicken':)/g, '],\n$1');
content = content.replace(/\][\r\n]+(\s*'Chicken Kali Mirch':)/g, '],\n$1');

// Let's also check for any missing comma globally in array of objects:
// `}\n    {` -> `},\n    {`
content = content.replace(/\}([\r\n]+\s*)\{/g, '},$1{');
// `]\n    '` -> `],\n    '`
content = content.replace(/\]([\r\n]+\s*)'/g, '],$1\'');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed missing commas');
