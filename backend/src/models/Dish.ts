import mongoose, { Schema, Document } from 'mongoose';

export interface IDish extends Document {
  name: string;
  price: number;
  ingredientPrice: number;
  category: string;
  imageUrl?: string;
  packagingLogic?: {
    dineIn: mongoose.Types.ObjectId[];
    takeaway: mongoose.Types.ObjectId[];
    delivery: mongoose.Types.ObjectId[];
  };
  allowedWastagePercentage?: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DishSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ingredientPrice: { type: Number, default: 0 },
  category: { type: String, required: true, default: 'General' },
  imageUrl: { type: String },
  packagingLogic: {
    dineIn: [{ type: Schema.Types.ObjectId, ref: 'Packaging' }],
    takeaway: [{ type: Schema.Types.ObjectId, ref: 'Packaging' }],
    delivery: [{ type: Schema.Types.ObjectId, ref: 'Packaging' }]
  },
  allowedWastagePercentage: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Dish || mongoose.model<IDish>('Dish', DishSchema);
