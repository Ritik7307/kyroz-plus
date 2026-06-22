import mongoose from 'mongoose';
import Dish from './src/models/Dish';
import Recipe from './src/models/Recipe';
import SemiFinishedGood from './src/models/SemiFinishedGood';

mongoose.connect('mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0').then(async () => {
  let updatedCount = 0;

  // 1. Update Legacy Users (Recipe on Dish directly)
  const pizzas = await Dish.find({ name: /Chicken Pizza/i });
  for (const p of pizzas) {
    const r = await Recipe.findOne({ targetModel: 'Dish', targetId: p._id });
    if (!r) continue;
    
    let newQuantity = 0;
    if (p.name === 'Personal Chicken Pizza') newQuantity = 40;
    else if (p.name === 'Medium Chicken Pizza') newQuantity = 60;
    else if (p.name === 'Large Chicken Pizza') newQuantity = 100;
    
    if (newQuantity === 0) continue;

    let modified = false;
    for (let ing of r.ingredients) {
      if (ing.itemModel === 'SemiFinishedGood') {
        const sfg = await SemiFinishedGood.findById(ing.itemId);
        if (sfg && sfg.name.includes('Marinated Chicken')) {
          ing.quantity = newQuantity;
          modified = true;
        }
      }
    }

    if (modified) {
      await r.save();
      updatedCount++;
      console.log(`Updated legacy recipe for ${p.name} (User: ${p.userId}) to ${newQuantity}gm`);
    }
  }

  // 2. Update New Architecture Users (Recipe on SFG Portions)
  const portions = await SemiFinishedGood.find({ name: /Chicken Portion/i });
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
        if (sfg && sfg.name.includes('Marinated Chicken')) {
          ing.quantity = newQuantity;
          modified = true;
        }
      }
    }

    if (modified) {
      await r.save();
      updatedCount++;
      console.log(`Updated portion recipe for ${p.name} (User: ${p.userId}) to ${newQuantity}gm`);
    }
  }

  console.log(`Successfully updated ${updatedCount} recipes.`);
  mongoose.disconnect();
});
