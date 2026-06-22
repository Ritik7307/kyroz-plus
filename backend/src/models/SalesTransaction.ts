import mongoose, { Schema, Document } from 'mongoose';

export interface ISalesCustomization {
  itemId: mongoose.Types.ObjectId;
  itemModel: 'RawMaterial' | 'PreparationMaster';
  quantityDifference: number; // positive means extra used, negative means less used
  costImpact: number;
}

export interface ISalesTransaction extends Document {
  menuItemId: mongoose.Types.ObjectId;
  quantitySold: number;
  sellingPricePerUnit: number;
  totalRevenue: number;
  totalFoodCost: number; // dynamically calculated based on ingredients + customizations
  customizations?: ISalesCustomization[];
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const SalesCustomizationSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemModel: { type: String, enum: ['RawMaterial', 'PreparationMaster'], required: true },
  quantityDifference: { type: Number, required: true },
  costImpact: { type: Number, required: true }
});

const SalesTransactionSchema: Schema = new Schema({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantitySold: { type: Number, required: true, default: 1 },
  sellingPricePerUnit: { type: Number, required: true },
  totalRevenue: { type: Number, required: true },
  totalFoodCost: { type: Number, required: true },
  customizations: { type: [SalesCustomizationSchema] },
  date: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.SalesTransaction || mongoose.model<ISalesTransaction>('SalesTransaction', SalesTransactionSchema);
