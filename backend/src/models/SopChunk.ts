import mongoose, { Schema, Document } from 'mongoose';

export interface ISopChunk extends Document {
  userId: mongoose.Types.ObjectId;
  dish: string;
  section: string;
  content: string;
  embedding: number[];
  lang: string;
  createdAt: Date;
  updatedAt: Date;
}

const SopChunkSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dish: { type: String, required: true },
    section: { type: String, required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], required: false }, // Optional if Gemini is not used
    lang: { type: String, default: 'en' },
  },
  { timestamps: true }
);

// Add text index for searching without embeddings
SopChunkSchema.index({ dish: 'text', section: 'text', content: 'text' });

// Add compound index for user and language searches
SopChunkSchema.index({ userId: 1, lang: 1 });

export default mongoose.models.SopChunk || mongoose.model<ISopChunk>('SopChunk', SopChunkSchema);
