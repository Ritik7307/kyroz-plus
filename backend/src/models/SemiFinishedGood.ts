import mongoose, { Schema, Document } from 'mongoose';

export interface ISemiFinishedGood extends Document {
  code: string;
  name: string;
  batchYield: number;
  yieldUnit: string;
  currentStock: number;
  costPerUnit: number;
  userId: mongoose.Types.ObjectId;
}

const SemiFinishedGoodSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  batchYield: { type: Number, required: true },
  yieldUnit: { type: String, required: true },
  currentStock: { type: Number, required: true, default: 0 },
  costPerUnit: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

SemiFinishedGoodSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.SemiFinishedGood || mongoose.model<ISemiFinishedGood>('SemiFinishedGood', SemiFinishedGoodSchema);
