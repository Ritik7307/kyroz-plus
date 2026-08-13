const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\Ritik prajapati\\.gemini\\antigravity-ide\\brain\\87b49aa1-70fe-47e0-9667-f9f4e2bd0f9f\\.system_generated\\logs\\transcript_full.jsonl';
const sopsDir = 'C:\\Users\\Ritik prajapati\\Desktop\\project\\kyroz-plus\\SOPs';

const southIndianDir = path.join(sopsDir, 'South_Indian');
const tandoorDir = path.join(sopsDir, 'Tandoor');
const indoArabicDir = path.join(sopsDir, 'Indo_Arabic');
const architectureDir = path.join(sopsDir, 'Architecture');
const biryaniDir = path.join(sopsDir, 'Biryani');
const cafeDishesDir = path.join(sopsDir, 'Cafe_Dishes');

[sopsDir, southIndianDir, tandoorDir, indoArabicDir, architectureDir, biryaniDir, cafeDishesDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const lines = fs.readFileSync(transcriptPath, 'utf-8').split('\n').filter(Boolean);

let sopCount = 0;
const sopMap = {};

for (const line of lines) {
    try {
        const entry = JSON.parse(line);
        if (entry.type === 'USER_INPUT' && entry.content) {
            const content = entry.content;
            
            const regex = /(?:# KYROZ PLUS MASTER SOP|# KYROZ\+ OPERATIONAL MANUAL|# KYROZ\+ SOUTH INDIAN DAILY OPERATIONAL CHART|"KYROZ\+ OPERATIONAL MANUAL|"KYROZ\+ DEVELOPER INVENTORY ARCHITECTURE|"KYROZ\+ \| STANDARD OPERATING PROCEDURE \(SOP\)|"KYROZ\+ \| BURGER SAUCE & DIP MAKING)[\s\S]*?(?=(?:# KYROZ PLUS MASTER SOP|# KYROZ\+ OPERATIONAL MANUAL|# KYROZ\+ SOUTH INDIAN DAILY OPERATIONAL CHART|"KYROZ\+ OPERATIONAL MANUAL|"KYROZ\+ DEVELOPER INVENTORY ARCHITECTURE|"KYROZ\+ \| STANDARD OPERATING PROCEDURE \(SOP\)|"KYROZ\+ \| BURGER SAUCE & DIP MAKING|$))/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                let sopText = match[0].trim();
                if (!sopText) continue;
                
                // Remove the starting quote if present
                if (sopText.startsWith('"')) {
                    sopText = sopText.substring(1);
                }
                
                let titleMatch = sopText.match(/PRODUCT:\s*(.*)/i) || sopText.match(/SOP:\s*(.*)/i) || sopText.match(/## (.*)/) || sopText.match(/ARCHITECTURE\s*\n\s*(.*)/i);
                let title = titleMatch ? titleMatch[1].trim() : `SOP_${sopCount}`;
                let filename = title.replace(/[^a-zA-Z0-9_-]/g, '_') + '.md';
                
                let dir = sopsDir;
                if (sopText.toLowerCase().includes('category:** south indian') || sopText.toLowerCase().includes('category: south indian') || sopText.toLowerCase().includes('south indian daily operational')) {
                    dir = southIndianDir;
                } else if (title.toLowerCase().includes('tandoor') || title.toLowerCase().includes('t-6')) {
                    dir = tandoorDir;
                } else if (sopText.toLowerCase().includes('indo-arabic')) {
                    dir = indoArabicDir;
                } else if (sopText.toLowerCase().includes('developer inventory architecture')) {
                    dir = architectureDir;
                } else if (title.toLowerCase().includes('biryani')) {
                    dir = biryaniDir;
                } else if (sopText.toLowerCase().includes('burger') || sopText.toLowerCase().includes('pizza') || sopText.toLowerCase().includes('kfc-style') || sopText.toLowerCase().includes('cafe-style')) {
                    dir = cafeDishesDir;
                }
                
                const filePath = path.join(dir, filename);
                if (!sopMap[filePath]) {
                    sopMap[filePath] = [];
                }
                sopMap[filePath].push(sopText);
                
                sopCount++;
            }
        }
    } catch (e) {
    }
}

for (const filePath in sopMap) {
    const texts = sopMap[filePath];
    const uniqueTexts = [...new Set(texts)];
    fs.writeFileSync(filePath, uniqueTexts.join('\n\n---\n\n'));
    console.log(`Saved ${path.basename(filePath)}`);
}

console.log(`Total unique files saved: ${Object.keys(sopMap).length}`);
