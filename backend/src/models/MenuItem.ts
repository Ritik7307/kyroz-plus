import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItemIngredient {
  itemId: mongoose.Types.ObjectId;
  itemModel: 'RawMaterial' | 'PreparationMaster';
  defaultQuantity: number;
  isEditable: boolean; // if true, can be modified during order
}

export interface IMenuItem extends Document {
  code: string;
  name: string;
  category: string;
  sellingPrice: number;
  ingredients: IMenuItemIngredient[];
  defaultFoodCost: number; // calculated from default quantities
  defaultMargin: number; 
  userId: mongoose.Types.ObjectId;
}

const MenuItemIngredientSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemModel: { type: String, enum: ['RawMaterial', 'PreparationMaster'], required: true },
  defaultQuantity: { type: Number, required: true },
  isEditable: { type: Boolean, default: false }
});

const MenuItemSchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  sellingPrice: { type: Number, required: true, default: 0 },
  ingredients: { type: [MenuItemIngredientSchema], required: true },
  defaultFoodCost: { type: Number, default: 0 },
  defaultMargin: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

MenuItemSchema.index({ code: 1, userId: 1 }, { unique: true });

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
