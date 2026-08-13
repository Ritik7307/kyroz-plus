const fs = require('fs');
const text = fs.readFileSync('c:/Users/Ritik prajapati/Desktop/project/kyroz-plus/sop_content.txt', 'utf-8');
const regex = /"# KYROZ PLUS MASTER SOP([\s\S]*?)"/g;
let match;
const sops = [];
while ((match = regex.exec(text)) !== null) {
  sops.push('# KYROZ PLUS MASTER SOP' + match[1]);
}
console.log('Found ' + sops.length + ' SOPs');
fs.writeFileSync('c:/Users/Ritik prajapati/Desktop/project/kyroz-plus/parsed_sops.json', JSON.stringify(sops, null, 2));
