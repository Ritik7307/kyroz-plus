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
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', OrderSchema);
