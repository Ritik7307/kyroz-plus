import mongoose, { Schema, Document } from 'mongoose';

export interface IPremix extends Document {
  code: string;
  name: string;
  consumptionType: string;
  currentStock: number;
  yieldPerPacket: number;
  costPerPacket: number;
  userId: mongoose.Types.ObjectId;
}

const PremixSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  consumptionType: { type: String, required: true },
  currentStock: { type: Number, required: true, default: 0 },
  yieldPerPacket: { type: Number, required: true, default: 1 }, // E.g. 1 packet makes X portions
  costPerPacket: { type: Number, required: true, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

PremixSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.Premix || mongoose.model<IPremix>('Premix', PremixSchema);
