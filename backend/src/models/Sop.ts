import mongoose, { Schema, Document } from 'mongoose';

export interface ISop extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: 'Cafe' | 'Chinese' | 'Biryani' | 'Mandi' | 'South India' | 'Indian Curry' | 'Discipline' | 'Preparation';
  contentEn?: string;
  contentHi?: string;
  content?: string;
  fileUrl?: string;
  subCategory?: string;
  isInventoryLinked?: boolean;
  platesPerPacket?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SopSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Cafe', 'Chinese', 'Biryani', 'Mandi', 'South India', 'Indian Curry', 'Discipline', 'Preparation'], 
      required: true 
    },
    contentEn: { type: String },
    contentHi: { type: String },
    content: { type: String }, // Legacy support
    fileUrl: { type: String },
    subCategory: { type: String },
    isInventoryLinked: { type: Boolean, default: false },
    platesPerPacket: { type: Number, default: 10 }
  },
  { timestamps: true }
);

SopSchema.index({ userId: 1 });

export default mongoose.models.Sop || mongoose.model<ISop>('Sop', SopSchema);
