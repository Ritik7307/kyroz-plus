import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeIngredient {
  itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Premix' | 'SopPacket' | 'Packaging';
  itemId: mongoose.Types.ObjectId;
  quantity: number; // The standard quantity required
}

export interface IRecipe extends Document {
  targetModel: 'Dish' | 'SemiFinishedGood' | 'Premix';
  targetId: mongoose.Types.ObjectId;
  targetYield: number; // e.g., 1 (for 1 plate of Dish) or 1850 (for 1850gm SFG)
  operationalYield: number;
  ingredients: IRecipeIngredient[];
  userId: mongoose.Types.ObjectId;
}

const RecipeIngredientSchema = new Schema({
  itemModel: { 
    type: String, 
    required: true, 
    enum: ['RawMaterial', 'SemiFinishedGood', 'Premix', 'SopPacket', 'Packaging'] 
  },
  itemId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true }
});

const RecipeSchema: Schema = new Schema({
  targetModel: { 
    type: String, 
    required: true, 
    enum: ['Dish', 'SemiFinishedGood', 'Premix'] 
  },
  targetId: { type: Schema.Types.ObjectId, required: true },
  targetYield: { type: Number, required: true, default: 1 },
  operationalYield: { type: Number, required: true, default: 1 },
  ingredients: { type: [RecipeIngredientSchema], required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// A target item can only have one main recipe
RecipeSchema.index({ targetModel: 1, targetId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
