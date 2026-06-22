import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryTransaction extends Document {
  itemId: mongoose.Types.ObjectId;
  itemModel: 'RawMaterial' | 'PreparationMaster';
  transactionType: 'Purchase' | 'Sale' | 'Waste' | 'Transfer' | 'Adjustment' | 'Production';
  quantity: number; // positive for in, negative for out
  costImpact?: number; // total cost impact of the transaction
  date: Date;
  referenceId?: mongoose.Types.ObjectId; // e.g. SalesTransaction ID, PurchaseEntry ID
  notes?: string;
  userId: mongoose.Types.ObjectId;
}

const InventoryTransactionSchema: Schema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemModel: { type: String, enum: ['RawMaterial', 'PreparationMaster'], required: true },
  transactionType: { 
    type: String, 
    enum: ['Purchase', 'Sale', 'Waste', 'Transfer', 'Adjustment', 'Production'], 
    required: true 
  },
  quantity: { type: Number, required: true },
  costImpact: { type: Number },
  date: { type: Date, default: Date.now },
  referenceId: { type: Schema.Types.ObjectId },
  notes: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.InventoryTransaction || mongoose.model<IInventoryTransaction>('InventoryTransaction', InventoryTransactionSchema);
