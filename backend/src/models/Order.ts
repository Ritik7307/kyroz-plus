import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  dishId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  ingredientPrice: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalRevenue: number;
  totalProfit: number;
  customerName?: string;
  customerPhone?: string;
  discount?: number; // legacy percentage
  discountType?: 'percentage' | 'flat';
  discountValue?: number;
  additionalCharge?: number;
  tableNumber?: string;
  paymentMethod?: 'Cash' | 'Online' | 'Split';
  splitPayments?: {
    cash: number;
    online: number;
  };
  orderType?: 'DineIn' | 'Takeaway' | 'Delivery';
  offline_id?: string;
  billNumber?: number;
  displayBillNumber?: string;
  createdAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  dishId: { type: Schema.Types.ObjectId, ref: 'Dish', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  ingredientPrice: { type: Number, required: true }
});

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  totalRevenue: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  discountValue: { type: Number, default: 0 },
  additionalCharge: { type: Number, default: 0 },
  tableNumber: { type: String },
  paymentMethod: { type: String, enum: ['Cash', 'Online', 'Split'], default: 'Cash' },
  splitPayments: {
    cash: { type: Number, default: 0 },
    online: { type: Number, default: 0 }
  },
  orderType: { type: String, enum: ['DineIn', 'Takeaway', 'Delivery'], default: 'DineIn' },
  offline_id: { type: String },
  billNumber: { type: Number },
  displayBillNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

OrderSchema.index({ offline_id: 1 }, { unique: true, sparse: true });

OrderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
