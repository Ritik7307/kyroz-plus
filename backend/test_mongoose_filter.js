require('dotenv').config();
const mongoose = require('mongoose');

// Import the Mongoose model the same way the controller does
const RecipeSchema = new mongoose.Schema({
  targetModel: String,
  targetId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  ingredients: [new mongoose.Schema({
    itemModel: String,
    itemId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  })]
});
const Recipe = mongoose.model('Recipe', RecipeSchema);

const DishSchema = new mongoose.Schema({
  name: String,
  userId: mongoose.Schema.Types.ObjectId
});
const Dish = mongoose.model('Dish', DishSchema);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const uid = new mongoose.Types.ObjectId('6a89e91137933856f5dd1e7b');
  const uidStr = '6a89e91137933856f5dd1e7b';
  
  const validRecipes = await Recipe.find({ 
    userId: uidStr,
    targetModel: 'Dish',
    ingredients: { $exists: true, $type: 'array', $ne: [] },
    'ingredients.itemId': { $exists: true, $ne: null }
  }).select('targetId').lean();
  
  const validDishIds = validRecipes.map(r => r.targetId);
  console.log('Mongoose Model Valid dish Ids length:', validDishIds.length);

  const dishes = await Dish.find({
    userId: uidStr,
    _id: { $in: validDishIds }
  }).lean();

  console.log('Dishes found with query:', dishes.length);
  
  const allUserDishes = await Dish.find({ userId: uidStr }).lean();
  console.log('Total User Dishes:', allUserDishes.length);

  process.exit(0);
});
