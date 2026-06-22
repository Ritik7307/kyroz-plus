import mongoose from 'mongoose';
import Dish from './src/models/Dish';
import Recipe from './src/models/Recipe';
import RawMaterial from './src/models/RawMaterial';
import SemiFinishedGood from './src/models/SemiFinishedGood';

mongoose.connect('mongodb+srv://vijayshankarprajapati29_db_user:3FxmRRA5ReXi2BqV@cluster0.wf2za1x.mongodb.net/?appName=Cluster0').then(async () => {
  const pizzas = await Dish.find({ name: /Chicken Pizza/i });
  for (const p of pizzas) {
    const r = await Recipe.findOne({ targetModel: 'Dish', targetId: p._id }).lean();
    if (!r) continue;
    
    console.log('\nPizza:', p.name, 'userId:', p.userId);
    for (const ing of r.ingredients) {
      if (ing.itemModel === 'RawMaterial') {
        const rm = await RawMaterial.findById(ing.itemId);
        console.log(`  - [RM] ${rm?.name}: ${ing.quantity}`);
      } else if (ing.itemModel === 'SemiFinishedGood') {
        const sfg = await SemiFinishedGood.findById(ing.itemId);
        console.log(`  - [SFG] ${sfg?.name}: ${ing.quantity}`);
      } else {
        console.log(`  - [${ing.itemModel}]: ${ing.quantity}`);
      }
    }
  }
  mongoose.disconnect();
});
