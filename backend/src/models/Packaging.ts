import mongoose, { Schema, Document } from 'mongoose';

export interface IPackaging extends Document {
  code: string;
  name: string;
  unit: string;
  currentStock: number;
  costPerUnit: number;
  userId: mongoose.Types.ObjectId;
}

const PackagingSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  unit: { type: String, required: true, default: 'pcs' },
  currentStock: { type: Number, required: true, default: 0 },
  costPerUnit: { type: Number, required: true, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

PackagingSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.Packaging || mongoose.model<IPackaging>('Packaging', PackagingSchema);
