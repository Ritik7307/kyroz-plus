import mongoose, { Schema, Document } from 'mongoose';

export interface IKotItem {
  dishId: mongoose.Types.ObjectId;
  quantity: number;
  note?: string;
}

export interface IKot extends Document {
  userId: mongoose.Types.ObjectId;
  kotNumber: number;
  tableNumber: string;
  orderType: 'DineIn' | 'Takeaway' | 'Delivery';
  customerName?: string;
  customerPhone?: string;
  items: IKotItem[];
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';
  packaging: { name: string; quantity: number }[];
  deleted: boolean;
  offline_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KotItemSchema = new Schema({
  dishId: { type: Schema.Types.ObjectId, ref: 'Dish', required: true },
  name: { type: String, default: 'Unknown Dish' },
  quantity: { type: Number, required: true },
  note: { type: String, default: '' }
});

const KotSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  kotNumber: { type: Number, required: true },
  tableNumber: { type: String, default: 'Quick Bill' },
  orderType: { type: String, enum: ['DineIn', 'Takeaway', 'Delivery'], default: 'DineIn' },
  customerName: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  items: { type: [KotItemSchema], required: true },
  status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'], default: 'Pending' },
  packaging: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  deleted: { type: Boolean, default: false },
  offline_id: { type: String }
}, { timestamps: true });

// Ensure unique kotNumber per user session/account
KotSchema.index({ userId: 1, kotNumber: 1 }, { unique: true });
KotSchema.index({ offline_id: 1 }, { unique: true, sparse: true });

export default mongoose.models.Kot || mongoose.model<IKot>('Kot', KotSchema);
