import mongoose from 'mongoose';
import Dish from './src/models/Dish';
import Recipe from './src/models/Recipe';
import RawMaterial from './src/models/RawMaterial';
import SemiFinishedGood from './src/models/SemiFinishedGood';

mongoose.connect('mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0').then(async () => {
  let updatedSFGCount = 0;
  let updatedPizzaCount = 0;

  console.log('Fetching SFG Marinated Chicken...');
  const sfgs = await SemiFinishedGood.find({ name: /Marinated Chicken/i });
  console.log(`Found ${sfgs.length} SFGs.`);
  for (const sfg of sfgs) {
    const r = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: sfg._id });
    if (!r) continue;

    let modified = false;
    for (let ing of r.ingredients) {
      if (ing.itemModel === 'RawMaterial') {
        const rm = await RawMaterial.findById(ing.itemId);
        if (rm && rm.name.includes('C-510')) {
          ing.quantity = 40;
          modified = true;
        }
      }
    }

    if (modified) {
      r.operationalYield = 1040; // 1000g chicken + 40g powder
      await r.save();
      updatedSFGCount++;
    }
  }

  // 2. Update all Chicken Pizza recipes to precisely match the raw chicken requirement
  // 100g raw = 104g marinated, 60g raw = 62.4g marinated, 40g raw = 41.6g marinated
  
  // 2a. Legacy Users
  const pizzas = await Dish.find({ name: /Chicken Pizza/i });
  for (const p of pizzas) {
    const r = await Recipe.findOne({ targetModel: 'Dish', targetId: p._id });
    if (!r) continue;
    
    let newQuantity = 0;
    if (p.name === 'Personal Chicken Pizza') newQuantity = 41.6;
    else if (p.name === 'Medium Chicken Pizza') newQuantity = 62.4;
    else if (p.name === 'Large Chicken Pizza') newQuantity = 104;
    
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
      updatedPizzaCount++;
    }
  }

  // 2b. Portion Architecture Users
  const portions = await SemiFinishedGood.find({ name: /Chicken Portion/i });
  for (const p of portions) {
    const r = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: p._id });
    if (!r) continue;
    
    let newQuantity = 0;
    if (p.name.includes('Personal')) newQuantity = 41.6;
    else if (p.name.includes('Medium')) newQuantity = 62.4;
    else if (p.name.includes('Large')) newQuantity = 104;
    
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
      updatedPizzaCount++;
    }
  }

  console.log(`Successfully updated ${updatedSFGCount} Marinated Chicken recipes.`);
  console.log(`Successfully updated ${updatedPizzaCount} Chicken Pizza/Portion recipes.`);
  mongoose.disconnect();
});
