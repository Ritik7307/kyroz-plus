require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Recipe = mongoose.connection.collection('recipes');
  
  const all = await Recipe.find({ targetModel: 'Dish' }).toArray();
  console.log('Total Dish Recipes in Atlas:', all.length);
  
  const valid = await Recipe.find({
    targetModel: 'Dish',
    ingredients: { $exists: true, $type: 'array', $ne: [] }
  }).toArray();
  console.log('Valid with old filter:', valid.length);
  
  const validNew = await Recipe.find({
    targetModel: 'Dish',
    ingredients: { $exists: true, $type: 'array', $ne: [] },
    'ingredients.itemId': { $exists: true, $ne: null }
  }).toArray();
  console.log('Valid with new filter:', validNew.length);
  
  if (valid.length > 0) {
    console.log('Sample ingredient without new filter:', JSON.stringify(valid[0].ingredients[0]));
  }
  process.exit(0);
});
