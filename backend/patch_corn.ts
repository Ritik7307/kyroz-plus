import mongoose from 'mongoose';
import Dish from './src/models/Dish';
import Recipe from './src/models/Recipe';
import SemiFinishedGood from './src/models/SemiFinishedGood';

mongoose.connect('mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0').then(async () => {
  let updatedPizzaCount = 0;

  // Legacy Users
  const pizzas = await Dish.find({ name: /Corn Cheese Pizza/i });
  for (const p of pizzas) {
    const r = await Recipe.findOne({ targetModel: 'Dish', targetId: p._id });
    if (!r) continue;
    
    let newQuantity = 0;
    if (p.name === 'Personal Corn Cheese Pizza') newQuantity = 40;
    else if (p.name === 'Medium Corn Cheese Pizza') newQuantity = 60;
    else if (p.name === 'Large Corn Cheese Pizza') newQuantity = 100;
    
    if (newQuantity === 0) continue;

    let modified = false;
    for (let ing of r.ingredients) {
      if (ing.itemModel === 'SemiFinishedGood') {
        const sfg = await SemiFinishedGood.findById(ing.itemId);
        if (sfg && sfg.name.includes('Corn Filling')) {
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

  // Portion Architecture Users
  const portions = await SemiFinishedGood.find({ name: /Corn Portion/i });
  for (const p of portions) {
    const r = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: p._id });
    if (!r) continue;
    
    let newQuantity = 0;
    if (p.name.includes('Personal')) newQuantity = 40;
    else if (p.name.includes('Medium')) newQuantity = 60;
    else if (p.name.includes('Large')) newQuantity = 100;
    
    if (newQuantity === 0) continue;

    let modified = false;
    for (let ing of r.ingredients) {
      if (ing.itemModel === 'SemiFinishedGood') {
        const sfg = await SemiFinishedGood.findById(ing.itemId);
        if (sfg && sfg.name.includes('Corn Filling')) {
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

  console.log(`Successfully updated ${updatedPizzaCount} Corn Cheese Pizza/Corn Portion recipes.`);
  mongoose.disconnect();
});
