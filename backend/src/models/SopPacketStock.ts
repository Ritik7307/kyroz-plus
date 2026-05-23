import mongoose, { Schema, Document } from 'mongoose';

export interface ISopPacketStock extends Document {
  packetId: mongoose.Types.ObjectId;
  currentStock: number;
  userId: mongoose.Types.ObjectId;
}

const SopPacketStockSchema: Schema = new Schema({
  packetId: { type: Schema.Types.ObjectId, ref: 'SopPacket', required: true },
  currentStock: { type: Number, required: true, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

SopPacketStockSchema.index({ packetId: 1, userId: 1 }, { unique: true });

export default mongoose.models.SopPacketStock || mongoose.model<ISopPacketStock>('SopPacketStock', SopPacketStockSchema);
