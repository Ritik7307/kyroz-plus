import mongoose, { Schema, Document } from 'mongoose';

export interface IRawMaterial extends Document {
  code: string;
  name: string;
  purchaseUnit: string;
  consumptionUnit: string;
  conversionFactor: number;
  category: string;
  currentStock: number; // Stored in consumption unit to avoid rounding issues
  costPerPurchaseUnit: number;
  userId: mongoose.Types.ObjectId;
}

const RawMaterialSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  purchaseUnit: { type: String, required: true },
  consumptionUnit: { type: String, required: true },
  conversionFactor: { type: Number, required: true, default: 1 },
  category: { type: String, required: true },
  currentStock: { type: Number, required: true, default: 0 },
  costPerPurchaseUnit: { type: Number, required: true, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Compound index to ensure code is unique per user
RawMaterialSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.RawMaterial || mongoose.model<IRawMaterial>('RawMaterial', RawMaterialSchema);
