import mongoose, { Schema, Document } from 'mongoose';

export interface IPortionIngredient {
  sfgId: mongoose.Types.ObjectId; // References PreparationMaster (SFG)
  quantity: number; // e.g., 350
  unit: string; // e.g., 'gm'
}

export interface IPortionMaster extends Document {
  code: string;
  name: string;
  ingredients: IPortionIngredient[]; // A portion can be made of one or more SFGs
  costPerPortion: number; // dynamically calculated based on SFG costs
  userId: mongoose.Types.ObjectId;
}

const PortionIngredientSchema = new Schema({
  sfgId: { type: Schema.Types.ObjectId, ref: 'PreparationMaster', required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
});

const PortionMasterSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  ingredients: { type: [PortionIngredientSchema], required: true },
  costPerPortion: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

PortionMasterSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.PortionMaster || mongoose.model<IPortionMaster>('PortionMaster', PortionMasterSchema);
