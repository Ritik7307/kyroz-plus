import mongoose from 'mongoose';
import Dish from './src/models/Dish';
import Recipe from './src/models/Recipe';
import SemiFinishedGood from './src/models/SemiFinishedGood';

mongoose.connect('mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0').then(async () => {
  let updatedPizzaCount = 0;

  // Legacy Users
  const pizzas = await Dish.find({ name: /Classic Veg Pizza/i });
  for (const p of pizzas) {
    const r = await Recipe.findOne({ targetModel: 'Dish', targetId: p._id });
    if (!r) continue;
    
    let newQuantity = 0;
    if (p.name === 'Personal Classic Veg Pizza') newQuantity = 40;
    else if (p.name === 'Medium Classic Veg Pizza') newQuantity = 60;
    else if (p.name === 'Large Classic Veg Pizza') newQuantity = 100;
    
    if (newQuantity === 0) continue;

    let modified = false;
    for (let ing of r.ingredients) {
      if (ing.itemModel === 'SemiFinishedGood') {
        const sfg = await SemiFinishedGood.findById(ing.itemId);
        if (sfg && sfg.name.includes('Topping Mix')) {
          ing.quantity = newQuantity;
          modified = true;
        }
      }
    }

    if (modified) {
      await r.save();
      updatedPizzaCount++;
    }
  }

  console.log(`Successfully updated ${updatedPizzaCount} Classic Veg Pizza recipes for legacy accounts.`);
  mongoose.disconnect();
});
