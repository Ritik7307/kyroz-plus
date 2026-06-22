import mongoose, { Schema, Document } from 'mongoose';

export interface IRawMaterial extends Document {
  code: string;
  name: string;
  description?: string;
  supplierId?: mongoose.Types.ObjectId;
  purchaseUnit: string;
  consumptionUnit: string;
  conversionFactor: number;
  category: string;
  currentStock: number; // Stored in consumption unit to avoid rounding issues
  costPerPurchaseUnit: number;
  reorderLevel?: number;
  storageType?: string; // e.g., 'Dry', 'Cold', 'Frozen'
  expiryDate?: Date;
  userId: mongoose.Types.ObjectId;
}

const RawMaterialSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  purchaseUnit: { type: String, required: true },
  consumptionUnit: { type: String, required: true },
  conversionFactor: { type: Number, required: true, default: 1 },
  category: { type: String, required: true },
  currentStock: { type: Number, required: true, default: 0 },
  costPerPurchaseUnit: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  storageType: { type: String },
  expiryDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Compound index to ensure code is unique per user
RawMaterialSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.RawMaterial || mongoose.model<IRawMaterial>('RawMaterial', RawMaterialSchema);
