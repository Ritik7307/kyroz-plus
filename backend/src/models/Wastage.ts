import mongoose, { Schema, Document } from 'mongoose';

export interface IWastage extends Document {
  itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Packaging';
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  reason: string;
  costLost: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const WastageSchema: Schema = new Schema({
  itemModel: {
    type: String,
    required: true,
    enum: ['RawMaterial', 'SemiFinishedGood', 'Packaging']
  },
  itemId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  costLost: { type: Number, required: true, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Wastage || mongoose.model<IWastage>('Wastage', WastageSchema);
