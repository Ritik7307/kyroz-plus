import mongoose, { Schema, Document } from 'mongoose';

export interface IMasterSop extends Document {
  title: string;
  category: string;
  contentEn: string;
  contentHi: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MasterSopSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    contentEn: { type: String, required: true },
    contentHi: { type: String, required: true },
    content: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.MasterSop || mongoose.model<IMasterSop>('MasterSop', MasterSopSchema);
