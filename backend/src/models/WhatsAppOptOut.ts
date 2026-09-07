import mongoose, { Document, Schema } from 'mongoose';

export interface IWhatsAppOptOut extends Document {
  phone: string;
  optedOut: boolean;
  updatedAt: Date;
}

const WhatsAppOptOutSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  optedOut: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWhatsAppOptOut>('WhatsAppOptOut', WhatsAppOptOutSchema);
