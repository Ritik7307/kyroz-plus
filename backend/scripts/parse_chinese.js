const fs = require('fs');

const raw = fs.readFileSync('chinese_raw.txt', 'utf-8');
const blocks = raw.split('==============================').map(b => b.trim()).filter(b => b.length > 0);

const sops = blocks.map(block => {
  // Extract Title: It's usually the first line or first few lines before "ENGLISH VERSION"
  const englishIdx = block.indexOf('ENGLISH VERSION');
  let titleBlock = block.substring(0, englishIdx).trim();
  
  // Clean up title block. If it has multiple lines, the first one is the title. 
  // Let's just use the first non-empty line as the title.
  const titleLines = titleBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // For the first SOP, there is "This uploaded file is..." before ENGLISH VERSION. Let's just grab the first line.
  let title = titleLines[0];
  if (title.match(/^\d+\.\s/)) {
    title = title.replace(/^\d+\.\s/, ''); // Remove leading numbers like "12. "
  }

  // Extract English and Hindi content
  const hindiIdx = block.indexOf('हिंदी संस्करण');
  
  let contentEn = '';
  let contentHi = '';
  
  if (hindiIdx !== -1) {
    contentEn = block.substring(englishIdx + 'ENGLISH VERSION'.length, hindiIdx).trim();
    contentHi = block.substring(hindiIdx + 'हिंदी संस्करण'.length).trim();
  } else {
    contentEn = block.substring(englishIdx + 'ENGLISH VERSION'.length).trim();
  }
  
  return {
    title,
    category: 'chinese',
    contentEn,
    contentHi
  };
});

fs.writeFileSync('chinese_sops.json', JSON.stringify(sops, null, 2));
console.log(`Successfully parsed ${sops.length} SOPs.`);
