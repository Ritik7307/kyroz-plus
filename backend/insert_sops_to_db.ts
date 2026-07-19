import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RawMaterial from './src/models/RawMaterial';
import SemiFinishedGood from './src/models/SemiFinishedGood';
import PortionMaster from './src/models/PortionMaster';
import Recipe from './src/models/Recipe';
import Dish from './src/models/Dish';
import Packaging from './src/models/Packaging';
import User from './src/models/User';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const user = await User.findOne();
    if (!user) throw new Error('No user found');
    const userId = user._id;

    console.log('Connected. Seeding 7 SOPs...');

    // Define all new RMs (just upsert them)
    const rms = [
      { code: 'RM_PANEER_CUBES', name: 'Paneer Cubes', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 300, conversionFactor: 1000 },
      { code: 'RM_GINGER_JULIENNES', name: 'Ginger Juliennes', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 120, conversionFactor: 1000 },
      { code: 'RM_STUFFED_PANEER_SANDWICH', name: 'Stuffed Paneer Sandwich', consumptionUnit: 'pcs', purchaseUnit: 'pcs', costPerPurchaseUnit: 15, conversionFactor: 1 },
      { code: 'RM_FRESH_PANEER', name: 'Fresh Paneer', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 300, conversionFactor: 1000 },
      { code: 'RM_MILK', name: 'Milk', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_BUTTON_MUSHROOM', name: 'Button Mushroom', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 150, conversionFactor: 1000 },
      { code: 'RM_SWEET_CORN', name: 'Sweet Corn', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_GREEN_PEAS', name: 'Green Peas', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 80, conversionFactor: 1000 },
      { code: 'RM_ROASTED_MAKHANA', name: 'Roasted Makhana', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 800, conversionFactor: 1000 },
      { code: 'RM_HONEY_SUGAR', name: 'Honey/Sugar', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 60, conversionFactor: 1000 },
      { code: 'RM_PRE_STEAMED_MIX_VEG', name: 'Pre-steamed Mix Veg', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_BLANCHED_MIX_VEG', name: 'Blanched Mix Vegetables', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_PANEER_STICKS', name: 'Paneer Sticks', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 300, conversionFactor: 1000 },
      { code: 'RM_VINEGAR_LEMON_JUICE', name: 'Vinegar/Lemon Juice', consumptionUnit: 'ml', purchaseUnit: 'L', costPerPurchaseUnit: 100, conversionFactor: 1000 },
      { code: 'RM_BUTTER', name: 'Butter', consumptionUnit: 'gm', purchaseUnit: 'kg', costPerPurchaseUnit: 500, conversionFactor: 1000 },
    ];

    for (const rm of rms) {
      await RawMaterial.findOneAndUpdate(
        { name: rm.name, userId },
        { ...rm, category: 'Ingredient', currentStock: 1000, userId },
        { upsert: true, new: true }
      );
    }

    const resolveIng = async (name: string) => {
      let r = await RawMaterial.findOne({ name, userId });
      if (r) return { id: r._id, model: 'RawMaterial' };
      let s = await SemiFinishedGood.findOne({ name, userId });
      if (s) return { id: s._id, model: 'SemiFinishedGood' };
      console.log('Not found:', name);
      return null;
    };

    // PANEER DHANIYA ADRAKI
    let pt1 = new PortionMaster({ name: 'Paneer Dhaniya Adraki Portion', userId, ingredients: [] });
    await pt1.save();
    pt1.ingredients = [
      { sfgId: (await resolveIng('G-205 ROYAL ROGAN'))?.id, quantity: 140, unit: 'gm' },
      { sfgId: (await resolveIng('G-202 IVORY BASE'))?.id, quantity: 60, unit: 'gm' },
      { sfgId: (await resolveIng('Paneer Cubes'))?.id, quantity: 150, unit: 'gm' },
      { sfgId: (await resolveIng('Refined Oil'))?.id, quantity: 10, unit: 'ml' },
      { sfgId: (await resolveIng('Desi Ghee'))?.id, quantity: 3, unit: 'gm' },
      { sfgId: (await resolveIng('Ginger Juliennes'))?.id, quantity: 10, unit: 'gm' },
      { sfgId: (await resolveIng('Ginger Garlic Paste'))?.id, quantity: 3, unit: 'gm' },
      { sfgId: (await resolveIng('Fresh Coriander'))?.id, quantity: 10, unit: 'gm' },
      { sfgId: (await resolveIng('Fresh Cream'))?.id, quantity: 15, unit: 'ml' },
      { sfgId: (await resolveIng('Kasoori Methi'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('K-801 ROYAL PUNCH'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('K-802 WOK SPICE'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('K-806 ZESTFUL ZING'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('Kashmiri Chilli'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('Water'))?.id || (await resolveIng('Hot Water'))?.id, quantity: 30, unit: 'ml' }
    ].filter(i => i.sfgId) as any;
    await pt1.save();

    let dish1 = await Dish.findOneAndUpdate(
      { name: 'Paneer Dhaniya Adraki', userId },
      { price: 300, category: 'Main Course', status: 'active' },
      { upsert: true, new: true }
    );
    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish1._id },
      { targetModel: 'Dish', targetId: dish1._id, targetYield: 1, operationalYield: 1, userId, ingredients: [
        { itemModel: 'PortionMaster', itemId: pt1._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: '500 ml Bowl' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Lid' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Carry Bag' }))?._id, quantity: 1 }
      ].filter(i => i.itemId) },
      { upsert: true }
    );

    // PANEER LABABDAR
    let pt2 = new PortionMaster({ name: 'Paneer Lababdar Portion', userId, ingredients: [] });
    await pt2.save();
    pt2.ingredients = [
      { sfgId: (await resolveIng('G-201 SUNSET BASE'))?.id, quantity: 140, unit: 'gm' },
      { sfgId: (await resolveIng('G-205 ROYAL ROGAN'))?.id, quantity: 60, unit: 'gm' },
      { sfgId: (await resolveIng('Paneer Cubes'))?.id, quantity: 150, unit: 'gm' },
      { sfgId: (await resolveIng('Butter'))?.id, quantity: 8, unit: 'gm' },
      { sfgId: (await resolveIng('Refined Oil'))?.id, quantity: 3, unit: 'ml' },
      { sfgId: (await resolveIng('Ginger Juliennes'))?.id, quantity: 3, unit: 'gm' },
      { sfgId: (await resolveIng('Fresh Coriander'))?.id, quantity: 2, unit: 'gm' },
      { sfgId: (await resolveIng('Water'))?.id || (await resolveIng('Hot Water'))?.id, quantity: 30, unit: 'ml' },
      { sfgId: (await resolveIng('Fresh Cream'))?.id, quantity: 15, unit: 'ml' },
      { sfgId: (await resolveIng('Kasoori Methi'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('Kashmiri Chilli'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('K-801 ROYAL PUNCH'))?.id, quantity: 0.5, unit: 'gm' }
    ].filter(i => i.sfgId) as any;
    await pt2.save();

    let dish2 = await Dish.findOneAndUpdate(
      { name: 'Paneer Lababdar', userId },
      { price: 320, category: 'Main Course', status: 'active' },
      { upsert: true, new: true }
    );
    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish2._id },
      { targetModel: 'Dish', targetId: dish2._id, targetYield: 1, operationalYield: 1, userId, ingredients: [
        { itemModel: 'PortionMaster', itemId: pt2._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: '500 ml Bowl' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Lid' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Carry Bag' }))?._id, quantity: 1 }
      ].filter(i => i.itemId) },
      { upsert: true }
    );

    // PANEER PASANDA
    let pt3 = new PortionMaster({ name: 'Paneer Pasanda Portion', userId, ingredients: [] });
    await pt3.save();
    pt3.ingredients = [
      { sfgId: (await resolveIng('G-202 IVORY BASE'))?.id, quantity: 160, unit: 'gm' },
      { sfgId: (await resolveIng('G-201 SUNSET BASE'))?.id, quantity: 40, unit: 'gm' },
      { sfgId: (await resolveIng('Stuffed Paneer Sandwich'))?.id, quantity: 2, unit: 'pcs' },
      { sfgId: (await resolveIng('Butter'))?.id, quantity: 8, unit: 'gm' },
      { sfgId: (await resolveIng('Refined Oil'))?.id, quantity: 3, unit: 'ml' },
      { sfgId: (await resolveIng('Ginger Garlic Paste'))?.id, quantity: 2, unit: 'gm' },
      { sfgId: (await resolveIng('Milk'))?.id, quantity: 35, unit: 'ml' },
      { sfgId: (await resolveIng('Fresh Cream'))?.id, quantity: 15, unit: 'ml' },
      { sfgId: (await resolveIng('Kasoori Methi'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('K-801 ROYAL PUNCH'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('K-806 ZESTFUL ZING'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('Fresh Coriander'))?.id, quantity: 2, unit: 'gm' }
    ].filter(i => i.sfgId) as any;
    await pt3.save();

    let dish3 = await Dish.findOneAndUpdate(
      { name: 'Paneer Pasanda', userId },
      { price: 340, category: 'Main Course', status: 'active' },
      { upsert: true, new: true }
    );
    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish3._id },
      { targetModel: 'Dish', targetId: dish3._id, targetYield: 1, operationalYield: 1, userId, ingredients: [
        { itemModel: 'PortionMaster', itemId: pt3._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: '500 ml Bowl' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Lid' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Carry Bag' }))?._id, quantity: 1 }
      ].filter(i => i.itemId) },
      { upsert: true }
    );

    // SHAHI PANEER
    let pt4 = new PortionMaster({ name: 'Shahi Paneer Portion', userId, ingredients: [] });
    await pt4.save();
    pt4.ingredients = [
      { sfgId: (await resolveIng('G-202 IVORY BASE'))?.id, quantity: 200, unit: 'gm' },
      { sfgId: (await resolveIng('Fresh Paneer'))?.id, quantity: 180, unit: 'gm' },
      { sfgId: (await resolveIng('Desi Ghee'))?.id, quantity: 15, unit: 'gm' },
      { sfgId: (await resolveIng('Milk'))?.id, quantity: 40, unit: 'ml' },
      { sfgId: (await resolveIng('Fresh Cream'))?.id, quantity: 15, unit: 'ml' },
      { sfgId: (await resolveIng('K-801 ROYAL PUNCH'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('K-806 ZESTFUL ZING'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('Kasoori Methi'))?.id, quantity: 1, unit: 'gm' }
    ].filter(i => i.sfgId) as any;
    await pt4.save();

    let dish4 = await Dish.findOneAndUpdate(
      { name: 'Shahi Paneer', userId },
      { price: 290, category: 'Main Course', status: 'active' },
      { upsert: true, new: true }
    );
    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish4._id },
      { targetModel: 'Dish', targetId: dish4._id, targetYield: 1, operationalYield: 1, userId, ingredients: [
        { itemModel: 'PortionMaster', itemId: pt4._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: '500 ml Bowl' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Lid' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Carry Bag' }))?._id, quantity: 1 }
      ].filter(i => i.itemId) },
      { upsert: true }
    );

    // SIGNATURE PANCH-RATAN
    let pt5 = new PortionMaster({ name: 'Panch-Ratan Curry Portion', userId, ingredients: [] });
    await pt5.save();
    pt5.ingredients = [
      { sfgId: (await resolveIng('G-201 SUNSET BASE'))?.id, quantity: 80, unit: 'gm' },
      { sfgId: (await resolveIng('G-202 IVORY BASE'))?.id, quantity: 60, unit: 'gm' },
      { sfgId: (await resolveIng('G-205 ROYAL ROGAN'))?.id, quantity: 60, unit: 'gm' },
      { sfgId: (await resolveIng('Paneer Cubes'))?.id, quantity: 40, unit: 'gm' },
      { sfgId: (await resolveIng('Button Mushroom'))?.id, quantity: 40, unit: 'gm' },
      { sfgId: (await resolveIng('Sweet Corn'))?.id, quantity: 30, unit: 'gm' },
      { sfgId: (await resolveIng('Green Peas'))?.id, quantity: 30, unit: 'gm' },
      { sfgId: (await resolveIng('Roasted Makhana'))?.id, quantity: 20, unit: 'gm' },
      { sfgId: (await resolveIng('Desi Ghee'))?.id || (await resolveIng('Ghee'))?.id, quantity: 10, unit: 'gm' },
      { sfgId: (await resolveIng('Butter'))?.id, quantity: 5, unit: 'gm' },
      { sfgId: (await resolveIng('Ginger Garlic Paste'))?.id, quantity: 3, unit: 'gm' },
      { sfgId: (await resolveIng('K-802 WOK SPICE'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('K-801 ROYAL PUNCH'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('Kashmiri Chilli'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('Fresh Cream'))?.id, quantity: 15, unit: 'ml' },
      { sfgId: (await resolveIng('Milk'))?.id, quantity: 40, unit: 'ml' },
      { sfgId: (await resolveIng('Honey/Sugar'))?.id, quantity: 3, unit: 'gm' }
    ].filter(i => i.sfgId) as any;
    await pt5.save();

    let dish5 = await Dish.findOneAndUpdate(
      { name: 'Signature Panch-Ratan Curry Veg', userId },
      { price: 350, category: 'Main Course', status: 'active' },
      { upsert: true, new: true }
    );
    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish5._id },
      { targetModel: 'Dish', targetId: dish5._id, targetYield: 1, operationalYield: 1, userId, ingredients: [
        { itemModel: 'PortionMaster', itemId: pt5._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: '500 ml Bowl' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Lid' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Carry Bag' }))?._id, quantity: 1 }
      ].filter(i => i.itemId) },
      { upsert: true }
    );

    // VEG HANDI
    let pt6 = new PortionMaster({ name: 'Veg Handi Portion', userId, ingredients: [] });
    await pt6.save();
    pt6.ingredients = [
      { sfgId: (await resolveIng('G-204 ROASTED RUST'))?.id, quantity: 80, unit: 'gm' },
      { sfgId: (await resolveIng('G-201 SUNSET BASE'))?.id, quantity: 60, unit: 'gm' },
      { sfgId: (await resolveIng('G-205 ROYAL ROGAN'))?.id, quantity: 60, unit: 'gm' },
      { sfgId: (await resolveIng('Pre-steamed Mix Veg'))?.id, quantity: 100, unit: 'gm' },
      { sfgId: (await resolveIng('Paneer Cubes'))?.id, quantity: 40, unit: 'gm' },
      { sfgId: (await resolveIng('Butter'))?.id, quantity: 15, unit: 'gm' },
      { sfgId: (await resolveIng('Refined Oil'))?.id, quantity: 3, unit: 'ml' },
      { sfgId: (await resolveIng('Ginger Garlic Paste'))?.id, quantity: 3, unit: 'gm' },
      { sfgId: (await resolveIng('K-802 WOK SPICE'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('K-801 ROYAL PUNCH'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('K-806 ZESTFUL ZING'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('Curd'))?.id, quantity: 15, unit: 'gm' },
      { sfgId: (await resolveIng('Fresh Cream'))?.id, quantity: 15, unit: 'ml' },
      { sfgId: (await resolveIng('Kasoori Methi'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('Water'))?.id || (await resolveIng('Hot Water'))?.id, quantity: 40, unit: 'ml' }
    ].filter(i => i.sfgId) as any;
    await pt6.save();

    let dish6 = await Dish.findOneAndUpdate(
      { name: 'Veg Handi', userId },
      { price: 280, category: 'Main Course', status: 'active' },
      { upsert: true, new: true }
    );
    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish6._id },
      { targetModel: 'Dish', targetId: dish6._id, targetYield: 1, operationalYield: 1, userId, ingredients: [
        { itemModel: 'PortionMaster', itemId: pt6._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: '500 ml Bowl' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Lid' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Carry Bag' }))?._id, quantity: 1 }
      ].filter(i => i.itemId) },
      { upsert: true }
    );

    // VEG JALFREZI
    let pt7 = new PortionMaster({ name: 'Veg Jalfrezi Portion', userId, ingredients: [] });
    await pt7.save();
    pt7.ingredients = [
      { sfgId: (await resolveIng('G-204 ROASTED RUST'))?.id, quantity: 120, unit: 'gm' },
      { sfgId: (await resolveIng('G-205 ROYAL ROGAN'))?.id, quantity: 80, unit: 'gm' },
      { sfgId: (await resolveIng('Blanched Mix Vegetables'))?.id, quantity: 100, unit: 'gm' },
      { sfgId: (await resolveIng('Paneer Sticks'))?.id, quantity: 40, unit: 'gm' },
      { sfgId: (await resolveIng('Refined Oil'))?.id, quantity: 10, unit: 'ml' },
      { sfgId: (await resolveIng('Ginger Garlic Paste'))?.id, quantity: 3, unit: 'gm' },
      { sfgId: (await resolveIng('K-802 WOK SPICE'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('K-801 ROYAL PUNCH'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('K-806 ZESTFUL ZING'))?.id, quantity: 0.5, unit: 'gm' },
      { sfgId: (await resolveIng('Curd'))?.id, quantity: 15, unit: 'gm' },
      { sfgId: (await resolveIng('Kashmiri Chilli'))?.id, quantity: 1, unit: 'gm' },
      { sfgId: (await resolveIng('Honey/Sugar'))?.id || (await resolveIng('Sugar'))?.id, quantity: 2, unit: 'gm' },
      { sfgId: (await resolveIng('Vinegar/Lemon Juice'))?.id, quantity: 5, unit: 'ml' },
      { sfgId: (await resolveIng('Water'))?.id || (await resolveIng('Hot Water'))?.id, quantity: 20, unit: 'ml' }
    ].filter(i => i.sfgId) as any;
    await pt7.save();

    let dish7 = await Dish.findOneAndUpdate(
      { name: 'Veg Jalfrezi', userId },
      { price: 270, category: 'Main Course', status: 'active' },
      { upsert: true, new: true }
    );
    await Recipe.findOneAndUpdate(
      { targetModel: 'Dish', targetId: dish7._id },
      { targetModel: 'Dish', targetId: dish7._id, targetYield: 1, operationalYield: 1, userId, ingredients: [
        { itemModel: 'PortionMaster', itemId: pt7._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: '500 ml Bowl' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Lid' }))?._id, quantity: 1 },
        { itemModel: 'Packaging', itemId: (await Packaging.findOne({ name: 'Carry Bag' }))?._id, quantity: 1 }
      ].filter(i => i.itemId) },
      { upsert: true }
    );

    console.log('Successfully injected all 7 SOPs!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
