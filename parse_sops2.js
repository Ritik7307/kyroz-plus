const fs = require('fs');
const text = fs.readFileSync('c:/Users/Ritik prajapati/Desktop/project/kyroz-plus/sop_content.txt', 'utf-8');

// Find where the SOPs actually start
const firstIndex = text.indexOf('# KYROZ PLUS MASTER SOP');
if (firstIndex === -1) {
    console.error('Could not find start of SOPs');
    process.exit(1);
}

const sopsText = text.substring(firstIndex);
const parts = sopsText.split('# KYROZ PLUS MASTER SOP').filter(p => p.trim().length > 0);

console.log(`Found ${parts.length} parts`);

const sops = parts.map(p => {
    // clean up leading/trailing quotes and commas if they exist
    let cleaned = p.replace(/^["',\s]+/, '').replace(/["',\s]+$/, '');
    return '# KYROZ PLUS MASTER SOP\n' + cleaned;
});

fs.writeFileSync('c:/Users/Ritik prajapati/Desktop/project/kyroz-plus/parsed_sops.json', JSON.stringify(sops, null, 2));

const titles = sops.map(s => {
    const lines = s.split('\n');
    return lines.find(l => l.startsWith('## ')) || 'Unknown';
});
console.log('Titles found:');
console.log(titles.join('\n'));
