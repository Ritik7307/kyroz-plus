import SopChunk from '../../models/SopChunk';
import { generateEmbedding } from './embedding.service';

export const processSopText = async (userId: string, text: string, language: string = 'en') => {
  // 1. Extract Dish Name
  const dishMatch = text.match(/SOP:\s*(.+)/i);
  if (!dishMatch) {
    throw new Error("Invalid Format: Could not detect 'SOP: [Dish Name]' at the beginning of the document.");
  }
  const dish = dishMatch[1].trim().toLowerCase();

  // 2. Delete old chunks for this dish and language
  await SopChunk.deleteMany({ userId, dish, lang: language });

  // 3. Define Section Keywords
  const sectionKeywords = [
    'INITIAL SETUP', 
    'COOKING PROCESS', 
    'FINISHING', 
    'GARNISH', 
    'TROUBLESHOOTING', 
    'TIP',
    'GARNISH & PLATING' // Fallback for variations
  ];

  // 4. Parse the text into sections
  const chunks: { dish: string; section: string; content: string }[] = [];
  
  let currentSection = 'GENERAL INFO';
  let currentContent: string[] = [];
  
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    let isSectionHeader = false;
    for (const keyword of sectionKeywords) {
      // If the line starts with the keyword (ignoring case)
      if (trimmedLine.toUpperCase().startsWith(keyword)) {
        // Save the previous section
        if (currentContent.length > 0) {
          chunks.push({
            dish,
            section: currentSection,
            content: currentContent.join('\n')
          });
        }
        // Start new section
        currentSection = keyword;
        currentContent = [];
        isSectionHeader = true;
        break;
      }
    }

    if (!isSectionHeader) {
      currentContent.push(trimmedLine);
    }
  }

  // Save the final section
  if (currentContent.length > 0) {
    chunks.push({
      dish,
      section: currentSection,
      content: currentContent.join('\n')
    });
  }

  // 5. Generate Embeddings and Save to MongoDB
  let chunksStored = 0;
  for (const chunk of chunks) {
    // We combine dish name, section, and content to create a highly contextual embedding
    const textToEmbed = `Dish: ${chunk.dish}\nSection: ${chunk.section}\nContent: ${chunk.content}`;
    
    try {
      let embedding = null;
      
      // Only generate embedding if API key is present
      if (process.env.GEMINI_API_KEY) {
        embedding = await generateEmbedding(textToEmbed);
      }
      
      await SopChunk.create({
        userId,
        dish: chunk.dish,
        section: chunk.section,
        content: chunk.content,
        embedding: embedding || [], // Save even if no embedding
        lang: language
      });
      
      chunksStored++;
    } catch (error) {
      console.error(`Failed to process chunk for ${chunk.dish} - ${chunk.section}:`, error);
      
      // Fallback: save without embedding if generation fails
      await SopChunk.create({
        userId,
        dish: chunk.dish,
        section: chunk.section,
        content: chunk.content,
        embedding: [],
        lang: language
      });
      chunksStored++;
    }
  }

  return { dish, chunksStored };
};
