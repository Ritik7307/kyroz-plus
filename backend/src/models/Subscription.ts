import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  razorpaySubscriptionId: string;
  plan: 'Basic' | 'Pro' | 'Elite';
  status: 'active' | 'cancelled' | 'past_due';
  startDate: Date;
  endDate: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    razorpaySubscriptionId: { type: String, required: true },
    plan: { type: String, enum: ['Basic', 'Pro', 'Elite'], required: true },
    status: { type: String, enum: ['active', 'cancelled', 'past_due'], default: 'active' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
