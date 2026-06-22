import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseEntry extends Document {
  supplierId: mongoose.Types.ObjectId;
  invoiceNumber?: string;
  itemId: mongoose.Types.ObjectId; // refs RawMaterial
  quantityPurchased: number;
  purchaseUnit: string;
  price: number;
  totalCost: number;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const PurchaseEntrySchema: Schema = new Schema({
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  invoiceNumber: { type: String },
  itemId: { type: Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
  quantityPurchased: { type: Number, required: true },
  purchaseUnit: { type: String, required: true },
  price: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.PurchaseEntry || mongoose.model<IPurchaseEntry>('PurchaseEntry', PurchaseEntrySchema);
