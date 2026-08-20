import SopChunk, { ISopChunk } from '../../models/SopChunk';

// Mathematical Cosine Similarity Function
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const retrieveRelevantChunks = async (userId: string, queryEmbedding: number[], topK: number = 3, rawQuery: string = "", lang: string = "en") => {
  let allChunks = await SopChunk.find({ userId, lang }).lean<ISopChunk[]>();
  
  // Also fetch English chunks as a fallback source of knowledge to provide to the LLM for translation
  if (lang !== 'en') {
    const enChunks = await SopChunk.find({ userId, lang: 'en' }).lean<ISopChunk[]>();
    allChunks = [...allChunks, ...enChunks];
  }
  
  if (!allChunks || allChunks.length === 0) return [];

  const queryLower = rawQuery.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 2);

  const scoredChunks = allChunks.map(chunk => {
    let similarity = 0;
    if (queryEmbedding && queryEmbedding.length > 0 && chunk.embedding && chunk.embedding.length > 0) {
      similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
    }
    
    // Dish Name Boost: If the dish name keywords are in the query, boost significantly
    if (queryLower) {
      const dishLower = chunk.dish.toLowerCase();
      // Exact or full substring match
      if (queryLower.includes(dishLower) || dishLower.includes(queryLower)) {
        similarity += 0.8; 
      } else {
        // Individual keyword matches (e.g. "Mushroom" in query matching "Mushroom Do Pyaza")
        const dishKeywords = dishLower.split(/\s+/).filter(k => k.length > 2);
        const matchCount = dishKeywords.filter(keyword => queryLower.includes(keyword)).length;
        if (matchCount > 0) {
          similarity += (matchCount * 0.3); // High boost per matching word
        }
      }
    }

    return { ...chunk, similarity };
  });

  scoredChunks.sort((a, b) => b.similarity - a.similarity);
  return scoredChunks.slice(0, topK);
};

export const searchSopByText = async (userId: string, query: string, topK: number = 3, lang: string = "en") => {
  // Clean query: remove common question words
  const cleanQuery = query.toLowerCase()
    .replace(/\b(how|to|make|get|the|recipe|for|is|are|a|an)\b/g, '')
    .trim();

  const performSearch = async (searchLang: string) => {
    try {
      // 1. Try MongoDB Text Search (requires text index)
      const results = await SopChunk.find(
        { 
          userId, 
          lang: searchLang,
          $text: { $search: cleanQuery || query } 
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(topK)
      .lean<ISopChunk[]>();

      if (results.length > 0) return results;
    } catch (error) {
      console.warn(`Text index search failed for lang ${searchLang}`);
    }

    // 2. Fallback: Keyword-based Regex Search with field prioritization
    const keywords = (cleanQuery || query).split(/\s+/).filter(k => k.length > 2);
    const regexQuery = keywords.length > 0 ? keywords.join('|') : query;

    const results = await SopChunk.find({
      userId,
      lang: searchLang,
      $or: [
        { dish: { $regex: regexQuery, $options: 'i' } },
        { content: { $regex: regexQuery, $options: 'i' } }
      ]
    }).lean<ISopChunk[]>();

    // Sort results manually to ensure dish matches come first
    results.sort((a, b) => {
      const aMatch = new RegExp(regexQuery, 'i').test(a.dish) ? 1 : 0;
      const bMatch = new RegExp(regexQuery, 'i').test(b.dish) ? 1 : 0;
      return bMatch - aMatch;
    });

    return results.slice(0, topK);
  };

  let finalResults = await performSearch(lang);
  
  // Also fetch English chunks as a fallback source of knowledge
  if (lang !== 'en') {
    const enResults = await performSearch('en');
    finalResults = [...finalResults, ...enResults];
    // Deduplicate or just rely on the LLM to process it
  }

  return finalResults;
};
