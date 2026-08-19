import mongoose from 'mongoose';
import MasterSop from '../src/models/MasterSop';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';

function fixTroubleshootingBlocks(text: string): string {
  if (!text) return text;
  
  // English troubleshooting replacement
  const enRegex = /Problem:(.*?)\n+.*?\*\*Reason:\*\*(.*?)\n+.*?\*\*Solution:\*\*(.*?)(?=\n+Problem:|\n+\d|\n+5\.|\n+6\.|==============================|$)/gs;
  
  if (enRegex.test(text)) {
    // If we have problems, we wrap them in a table
    text = text.replace(enRegex, (match, p1, p2, p3) => {
      return `| ${p1.trim()} | ${p2.trim()} | ${p3.trim()} |\n`;
    });
    
    // Now we need to insert the table header before the first pipe if it's the start of the table
    // Wait, regex replace replaces each block individually. So we need to group them.
  }
  return text;
}

// A more robust approach is to find the "TROUBLESHOOTING" or "समस्या और समाधान" sections and parse them.
function formatText(text: string): string {
    if (!text) return text;

    // We can replace the English pattern
    let lines = text.split('\n');
    let inEnTroubleshooting = false;
    let inHiTroubleshooting = false;
    let problemsEn: any[] = [];
    let problemsHi: any[] = [];
    
    let newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Start of English Troubleshooting
        if (line.includes('TROUBLESHOOTING') && !line.includes('समस्या और समाधान')) {
            inEnTroubleshooting = true;
            newLines.push(line);
            newLines.push('');
            newLines.push('| Problem | Reason | Solution |');
            newLines.push('| ------- | ------ | -------- |');
            continue;
        }
        
        // Start of Hindi Troubleshooting
        if (line.includes('समस्या और समाधान') || line.includes('TROUBLESHOOTING — समस्या और समाधान')) {
            inHiTroubleshooting = true;
            inEnTroubleshooting = false;
            newLines.push(line);
            newLines.push('');
            newLines.push('| समस्या | कारण | समाधान |');
            newLines.push('| ------- | ------ | -------- |');
            continue;
        }
        
        // End of Troubleshooting section (usually indicated by next numbered section)
        if ((inEnTroubleshooting || inHiTroubleshooting) && line.match(/^\d+\.\s/)) {
            inEnTroubleshooting = false;
            inHiTroubleshooting = false;
        }

        if (inEnTroubleshooting) {
            if (line.startsWith('Problem:')) {
                let problem = line.replace('Problem:', '').trim();
                let reason = '';
                let solution = '';
                
                // Read ahead
                while (i + 1 < lines.length && !lines[i+1].startsWith('Problem:') && !lines[i+1].match(/^\d+\.\s/)) {
                    i++;
                    let nLine = lines[i];
                    if (nLine.includes('**Reason:**')) {
                        reason = nLine.replace('**Reason:**', '').trim();
                    } else if (nLine.includes('**Solution:**')) {
                        solution = nLine.replace('**Solution:**', '').trim();
                    }
                }
                newLines.push(`| ${problem} | ${reason} | ${solution} |`);
                continue;
            } else if (line.trim() !== '') {
                // If it's a blank line or random text, skip or keep it? 
                // Let's keep it if it's not part of the problem block.
                // Wait, some tables were already formatted `| Problem | Reason |`
                if (line.startsWith('|')) {
                     newLines.push(line);
                     // If it's already a table, we should turn off the custom parser? No, just push it.
                }
            }
        } 
        else if (inHiTroubleshooting) {
            if (line.startsWith('समस्या:')) {
                let problem = line.replace('समस्या:', '').trim();
                let reason = '';
                let solution = '';
                
                while (i + 1 < lines.length && !lines[i+1].startsWith('समस्या:') && !lines[i+1].match(/^\d+\.\s/)) {
                    i++;
                    let nLine = lines[i];
                    if (nLine.includes('**कारण:**')) {
                        reason = nLine.replace('**कारण:**', '').trim();
                    } else if (nLine.includes('**समाधान:**')) {
                        solution = nLine.replace('**समाधान:**', '').trim();
                    }
                }
                newLines.push(`| ${problem} | ${reason} | ${solution} |`);
                continue;
            } else if (line.trim() !== '') {
                if (line.startsWith('|')) {
                     newLines.push(line);
                }
            }
        }
        else {
            newLines.push(line);
        }
    }
    
    return newLines.join('\n');
}

async function fixSops() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const chineseSops = await MasterSop.find({ category: 'chinese' });
    let count = 0;
    
    for (const sop of chineseSops) {
      const originalEn = sop.contentEn;
      const originalHi = sop.contentHi;
      
      const newEn = formatText(originalEn);
      const newHi = originalHi ? formatText(originalHi) : originalHi;
      
      let modified = false;
      if (newEn !== originalEn) {
          sop.contentEn = newEn;
          modified = true;
      }
      if (newHi !== originalHi) {
          sop.contentHi = newHi;
          modified = true;
      }
      
      if (modified) {
          await sop.save();
          console.log('Fixed SOP: ' + sop.title);
          count++;
      }
    }

    console.log('\\nDone! Fixed ' + count + ' Chinese SOPs.');
  } catch (error) {
    console.error('Error fixing SOPs:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixSops();
