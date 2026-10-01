import mongoose, { Document, Schema } from 'mongoose';

export interface IWhatsappConversation extends Document {
  phone: string;
  name: string;
  lastMessageAt: Date;
  lastMessagePreview?: string;
  unreadCount: number;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const WhatsappConversationSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lastMessageAt: { type: Date, default: Date.now },
  lastMessagePreview: { type: String },
  unreadCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

export default mongoose.model<IWhatsappConversation>('WhatsappConversation', WhatsappConversationSchema);
