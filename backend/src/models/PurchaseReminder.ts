import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseReminder extends Document {
  phone: string;
  reminderTime: Date;
  status: 'PENDING' | 'PURCHASED' | 'SENT';
  sendCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseReminderSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    reminderTime: { type: Date, required: true },
    status: { type: String, enum: ['PENDING', 'PURCHASED', 'SENT'], default: 'PENDING' },
    sendCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Index to quickly find reminders that need to be sent
PurchaseReminderSchema.index({ status: 1, reminderTime: 1 });

export default mongoose.models.PurchaseReminder || mongoose.model<IPurchaseReminder>('PurchaseReminder', PurchaseReminderSchema);
