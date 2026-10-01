import mongoose, { Document, Schema } from 'mongoose';

export interface IWhatsappMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  messageId: string;
  sender: 'user' | 'system' | 'admin';
  direction: 'inbound' | 'outbound';
  type: 'text' | 'image' | 'document' | 'interactive' | 'template';
  text?: string;
  mediaUrl?: string;
  mediaId?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'received';
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsappMessageSchema: Schema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'WhatsappConversation', required: true },
  messageId: { type: String, required: true, unique: true },
  sender: { type: String, enum: ['user', 'system', 'admin'], required: true },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  type: { type: String, enum: ['text', 'image', 'document', 'interactive', 'template'], default: 'text' },
  text: { type: String },
  mediaUrl: { type: String },
  mediaId: { type: String },
  status: { type: String, enum: ['sent', 'delivered', 'read', 'failed', 'received'], default: 'received' },
  timestamp: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model<IWhatsappMessage>('WhatsappMessage', WhatsappMessageSchema);
