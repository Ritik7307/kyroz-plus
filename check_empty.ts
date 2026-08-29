import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Fix model imports by compiling schema locally to avoid import errors
const RecipeSchema = new mongoose.Schema({
  targetModel: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  ingredients: { type: Array, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});
const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});
const Dish = mongoose.models.Dish || mongoose.model('Dish', DishSchema);

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  const emptyRecipes = await Recipe.find({ targetModel: 'Dish', 'ingredients.0': { $exists: false } });
  console.log(`Found ${emptyRecipes.length} empty Dish recipes.`);
  
  if (emptyRecipes.length > 0) {
    console.log("Sample of empty recipes:");
    for (let i = 0; i < Math.min(5, emptyRecipes.length); i++) {
      const r = emptyRecipes[i];
      const dish = await Dish.findById(r.targetId);
      console.log(`- Dish: ${dish ? dish.name : 'UNKNOWN'} (ID: ${r.targetId})`);
    }
  }

  process.exit(0);
}).catch(console.error);
