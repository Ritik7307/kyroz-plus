import mongoose, { Schema, Document } from 'mongoose';

export interface ICostHistory extends Document {
  itemId: mongoose.Types.ObjectId;
  itemModel: 'RawMaterial' | 'PreparationMaster';
  price: number;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const CostHistorySchema: Schema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemModel: { type: String, enum: ['RawMaterial', 'PreparationMaster'], required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.CostHistory || mongoose.model<ICostHistory>('CostHistory', CostHistorySchema);
