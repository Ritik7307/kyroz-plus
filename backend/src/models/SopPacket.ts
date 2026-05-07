import mongoose, { Schema, Document } from 'mongoose';

export interface ISopPacket extends Document {
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const SopPacketSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    category: { type: String, default: 'General' }
  },
  { timestamps: true }
);

export default mongoose.models.SopPacket || mongoose.model<ISopPacket>('SopPacket', SopPacketSchema);
