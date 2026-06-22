import mongoose, { Schema, Document } from 'mongoose';

export interface IWasteRecord extends Document {
  itemId: mongoose.Types.ObjectId;
  itemModel: 'RawMaterial' | 'PreparationMaster';
  quantity: number;
  reason?: string; // e.g., 'Spoilage', 'Expired', 'Kitchen Waste', 'Overproduction'
  costImpact: number;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const WasteRecordSchema: Schema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemModel: { type: String, enum: ['RawMaterial', 'PreparationMaster'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String },
  costImpact: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.WasteRecord || mongoose.model<IWasteRecord>('WasteRecord', WasteRecordSchema);
