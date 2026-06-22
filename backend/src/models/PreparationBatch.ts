import mongoose, { Schema, Document } from 'mongoose';

export interface IPreparationBatchIngredient {
  itemId: mongoose.Types.ObjectId;
  itemModel: 'RawMaterial' | 'PreparationMaster';
  inputQuantity: number;
  costAtProduction: number;
}

export interface IPreparationBatch extends Document {
  prepMasterId: mongoose.Types.ObjectId;
  ingredients: IPreparationBatchIngredient[];
  expectedOutputQuantity: number;
  actualOutputQuantity: number;
  totalBatchCost: number;
  costPerOutputUnit: number;
  dateProduced: Date;
  expiryDate?: Date;
  userId: mongoose.Types.ObjectId;
}

const PreparationBatchIngredientSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemModel: { type: String, enum: ['RawMaterial', 'PreparationMaster'], required: true },
  inputQuantity: { type: Number, required: true },
  costAtProduction: { type: Number, required: true }
});

const PreparationBatchSchema: Schema = new Schema({
  prepMasterId: { type: Schema.Types.ObjectId, ref: 'PreparationMaster', required: true },
  ingredients: { type: [PreparationBatchIngredientSchema], required: true },
  expectedOutputQuantity: { type: Number, required: true },
  actualOutputQuantity: { type: Number, required: true },
  totalBatchCost: { type: Number, required: true },
  costPerOutputUnit: { type: Number, required: true },
  dateProduced: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.PreparationBatch || mongoose.model<IPreparationBatch>('PreparationBatch', PreparationBatchSchema);
