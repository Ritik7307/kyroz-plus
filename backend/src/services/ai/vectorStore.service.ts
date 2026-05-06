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

export const retrieveRelevantChunks = async (userId: string, queryEmbedding: number[], topK: number = 3) => {
  // Fetch all chunks for this user. 
  // In a massive scale app, this would use Atlas Vector Search.
  // For local MongoDB, we do the math in Node.js.
  const allChunks = await SopChunk.find({ userId }).lean<ISopChunk[]>();

  if (!allChunks || allChunks.length === 0) {
    return [];
  }

  // Calculate similarity for each chunk
  const scoredChunks = allChunks.map(chunk => {
    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
    return { ...chunk, similarity };
  });

  // Sort by highest similarity
  scoredChunks.sort((a, b) => b.similarity - a.similarity);

  // Return the top K chunks that meet a minimum similarity threshold
  const THRESHOLD = 0.5; // Adjust based on Gemini embedding tendencies
  const filteredChunks = scoredChunks.filter(c => c.similarity > THRESHOLD);
  
  // Fallback to topK regardless of threshold if no strong match, or just return topK
  return scoredChunks.slice(0, topK);
};

export const searchSopByText = async (userId: string, query: string, topK: number = 3) => {
  // Clean query: remove common question words
  const cleanQuery = query.toLowerCase()
    .replace(/\b(how|to|make|get|the|recipe|for|is|are|a|an)\b/g, '')
    .trim();

  try {
    // 1. Try MongoDB Text Search (requires text index)
    // We use the cleaned query for better matching
    const results = await SopChunk.find(
      { 
        userId, 
        $text: { $search: cleanQuery || query } 
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(topK)
    .lean<ISopChunk[]>();

    if (results.length > 0) return results;
  } catch (error) {
    console.warn("Text index search failed or not ready:", error);
  }

  // 2. Fallback: Keyword-based Regex Search
  // We split the clean query into words and search for any of them
  const keywords = (cleanQuery || query).split(/\s+/).filter(k => k.length > 2);
  const regexQuery = keywords.length > 0 ? keywords.join('|') : query;

  return await SopChunk.find({
    userId,
    $or: [
      { dish: { $regex: regexQuery, $options: 'i' } },
      { section: { $regex: regexQuery, $options: 'i' } },
      { content: { $regex: regexQuery, $options: 'i' } }
    ]
  })
  .limit(topK)
  .lean<ISopChunk[]>();
};
