import mongoose, { Schema, Document } from 'mongoose';

export interface ISop extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: 'Dish' | 'Gravy' | 'Costing' | 'Wastage' | 'Discipline';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const SopSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Dish', 'Gravy', 'Costing', 'Wastage', 'Discipline'], 
      required: true 
    },
    contentEn: { type: String },
    contentHi: { type: String },
    content: { type: String } // Legacy support
  },
  { timestamps: true }
);

export default mongoose.models.Sop || mongoose.model<ISop>('Sop', SopSchema);
