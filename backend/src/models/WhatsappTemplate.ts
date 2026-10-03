import mongoose, { Document, Schema } from 'mongoose';

export interface IWhatsappTemplate extends Document {
  name: string;
  body: string;
  category: 'utility' | 'marketing' | 'onboarding' | 'support';
  language: 'en' | 'hi';
  createdAt: Date;
  updatedAt: Date;
}

const WhatsappTemplateSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  body: { type: String, required: true },
  category: { type: String, enum: ['utility', 'marketing', 'onboarding', 'support'], default: 'utility' },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
}, { timestamps: true });

export default mongoose.model<IWhatsappTemplate>('WhatsappTemplate', WhatsappTemplateSchema);
