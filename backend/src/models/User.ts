import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string; // For staff accounts
  name?: string;
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  role: 'admin' | 'manager' | 'cook' | 'billing' | 'user';
  subscriptionPlan: 'Basic' | 'Pro' | 'Elite' | 'Admin';
  ownerId?: mongoose.Types.ObjectId; // Links staff to their Manager
  otpHash?: string;
  otpExpiresAt?: Date;
  paymentQrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String },
    shopName: { type: String },
    shopAddress: { type: String },
    gstNumber: { type: String },
    role: { type: String, enum: ['admin', 'manager', 'cook', 'billing', 'user'], default: 'user' },
    subscriptionPlan: { type: String, enum: ['Basic', 'Pro', 'Elite', 'Admin'], default: 'Basic' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    otpHash: { type: String },
    otpExpiresAt: { type: Date },
    paymentQrCode: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
