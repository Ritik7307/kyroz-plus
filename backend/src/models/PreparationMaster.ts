import mongoose, { Schema, Document } from 'mongoose';

export interface IPreparationMaster extends Document {
  code: string;
  name: string;
  description?: string;
  outputUnit: string; // e.g., 'pcs', 'kg', 'litre'
  currentStock: number;
  costPerOutputUnit: number; // dynamically calculated
  reorderLevel?: number;
  expiryDays?: number; // how long before a batch expires
  userId: mongoose.Types.ObjectId;
}

const PreparationMasterSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  outputUnit: { type: String, required: true },
  currentStock: { type: Number, required: true, default: 0 },
  costPerOutputUnit: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  expiryDays: { type: Number },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

PreparationMasterSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.PreparationMaster || mongoose.model<IPreparationMaster>('PreparationMaster', PreparationMasterSchema);
