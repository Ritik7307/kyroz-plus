import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  role: 'admin' | 'user';
  subscriptionPlan: 'Basic' | 'Pro' | 'Elite';
  otpHash?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    shopName: { type: String },
    shopAddress: { type: String },
    gstNumber: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    subscriptionPlan: { type: String, enum: ['Basic', 'Pro', 'Elite'], default: 'Basic' },
    otpHash: { type: String },
    otpExpiresAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
