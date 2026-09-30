import mongoose, { Schema, Document } from 'mongoose';

export interface IOnboardingReminder extends Document {
  phone: string;
  userName?: string;
  reminderTime: Date;
  messageText: string;
  status: 'PENDING' | 'SENT' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const OnboardingReminderSchema: Schema = new Schema(
  {
    phone: { type: String, required: true },
    userName: { type: String },
    reminderTime: { type: Date, required: true },
    messageText: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'SENT', 'CANCELLED'], default: 'PENDING' },
  },
  { timestamps: true }
);

// Index to quickly find reminders that need to be sent
OnboardingReminderSchema.index({ status: 1, reminderTime: 1 });
OnboardingReminderSchema.index({ phone: 1, status: 1 });

export default mongoose.models.OnboardingReminder || mongoose.model<IOnboardingReminder>('OnboardingReminder', OnboardingReminderSchema);
