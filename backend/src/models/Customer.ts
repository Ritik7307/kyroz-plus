import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId; // The shop owner
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

// Unique index for phone per shop owner
CustomerSchema.index({ userId: 1, phone: 1 }, { unique: true });

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
