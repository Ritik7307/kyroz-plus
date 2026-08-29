const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/kyroz').then(async () => {
  const Recipe = mongoose.connection.collection('recipes');
  const recipes = await Recipe.find({
    targetModel: 'Dish',
    ingredients: { $exists: true, $type: 'array', $ne: [] }
  }).toArray();
  
  console.log('Total Dish Recipes with ingredients:', recipes.length);
  
  const valid = recipes.filter(x => x.ingredients && x.ingredients.some(i => i.itemId != null));
  console.log('Valid Recipes (with non-null itemId):', valid.length);
  
  const dbMatched = await Recipe.find({
    targetModel: 'Dish',
    ingredients: { $exists: true, $type: 'array', $ne: [] },
    'ingredients.itemId': { $exists: true, $ne: null }
  }).toArray();
  
  console.log('DB Matched with ingredients.itemId query:', dbMatched.length);
  
  if (recipes.length > 0) {
    console.log('Sample ingredient 0:', recipes[0].ingredients[0]);
  }
  process.exit(0);
});
