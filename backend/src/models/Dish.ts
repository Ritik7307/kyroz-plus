import mongoose, { Schema, Document } from 'mongoose';

export interface IDish extends Document {
  name: string;
  price: number;
  ingredientPrice: number;
  category: string;
  imageUrl?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DishSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ingredientPrice: { type: Number, default: 0 },
  category: { type: String, required: true, default: 'General' },
  imageUrl: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Dish || mongoose.model<IDish>('Dish', DishSchema);
