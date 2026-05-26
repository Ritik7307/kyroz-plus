import mongoose from 'mongoose';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Premix from '../models/Premix';
import Packaging from '../models/Packaging';
import SopPacketStock from '../models/SopPacketStock';
import Recipe from '../models/Recipe';
import Dish from '../models/Dish';
import Inventory from '../models/Inventory';
import Notification from '../models/Notification';

const createStockNotification = async (
  userId: any,
  itemName: string,
  currentStock: number,
  unit: string
): Promise<void> => {
  try {
    // Check if an unread notification for this item already exists
    const existing = await Notification.findOne({
      userId,
      title: 'Low Stock Alert',
      message: { $regex: new RegExp(itemName, 'i') },
      isRead: false
    });

    if (!existing) {
      await Notification.create({
        userId,
        title: 'Low Stock Alert',
        message: `Your stock for ${itemName} is low (${currentStock.toFixed(2)} ${unit} remaining). Please refill.`,
        type: 'warning',
        category: 'inventory',
        isRead: false
      });
      console.log(`Created low stock notification for ${itemName}`);
    }
  } catch (err) {
    console.error('Failed to create stock notification:', err);
  }
};

/**
 * Recursively deducts inventory based on recipes.
 * @param targetModel 'Dish' | 'SemiFinishedGood' | 'Premix' | 'RawMaterial' | 'SopPacket' | 'Packaging'
 * @param targetId The ID of the item being consumed
 * @param quantity The amount consumed (e.g., number of plates, or grams)
 * @param userId The user's ID to ensure they only affect their own stock
 */
export const deductInventory = async (
  targetModel: string,
  targetId: mongoose.Types.ObjectId | string,
  quantity: number,
  userId: mongoose.Types.ObjectId | string
): Promise<void> => {
  if (quantity <= 0) return;

  // 1. Deduct the item itself if it has direct stock tracking (excluding Dish which relies on legacy Inventory)
  if (targetModel === 'RawMaterial') {
    const item = await RawMaterial.findOneAndUpdate(
      { _id: targetId, userId },
      { $inc: { currentStock: -quantity } },
      { new: true }
    );
    if (item && item.currentStock <= 20) {
      await createStockNotification(userId, item.name, item.currentStock, item.consumptionUnit);
    }
    return; // Raw materials have no sub-recipe
  } else if (targetModel === 'SemiFinishedGood') {
    const sfg = await SemiFinishedGood.findOne({ _id: targetId, userId });
    if (sfg) {
      const availableStock = sfg.currentStock || 0;
      if (availableStock >= quantity) {
        sfg.currentStock -= quantity;
        await sfg.save();
        if (sfg.currentStock <= 20) {
          await createStockNotification(userId, sfg.name, sfg.currentStock, sfg.yieldUnit);
        }
      } else {
        const consumedFromStock = Math.max(0, availableStock);
        const deficit = quantity - consumedFromStock;
        sfg.currentStock = 0;
        await sfg.save();

        // Recursively deduct the remaining deficit from the SFG's recipe
        const recipe = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId, userId });
        if (recipe) {
          const multiplier = deficit / recipe.operationalYield;
          for (const ingredient of recipe.ingredients) {
            const requiredQty = ingredient.quantity * multiplier;
            await deductInventory(ingredient.itemModel, ingredient.itemId, requiredQty, userId);
          }
        }
      }
    }
    return;
  } else if (targetModel === 'Premix') {
    const item = await Premix.findOneAndUpdate(
      { _id: targetId, userId },
      { $inc: { currentStock: -quantity } },
      { new: true }
    );
    if (item && item.currentStock <= 20) {
      await createStockNotification(userId, item.name, item.currentStock, 'packets');
    }
    return; // STOP RECURSION: Premixes are stocked directly.
  } else if (targetModel === 'Packaging') {
    const item = await Packaging.findOneAndUpdate(
      { _id: targetId, userId },
      { $inc: { currentStock: -quantity } },
      { new: true }
    );
    if (item && item.currentStock <= 20) {
      await createStockNotification(userId, item.name, item.currentStock, item.unit);
    }
    return; // Packaging has no sub-recipe
  } else if (targetModel === 'SopPacket') {
    await SopPacketStock.findOneAndUpdate(
      { packetId: targetId, userId },
      { $inc: { currentStock: -quantity } }
    );
    return; // SOP Packets have no sub-recipe here
  }

  // 2. Recursive deduction: If this item has a recipe, break it down further
  if (targetModel === 'Dish') {
    const recipe = await Recipe.findOne({ targetModel, targetId, userId });
    
    if (recipe) {
      // Calculate how many recipe batches we are consuming
      const multiplier = quantity / recipe.operationalYield;

      for (const ingredient of recipe.ingredients) {
        const requiredQty = ingredient.quantity * multiplier;
        await deductInventory(ingredient.itemModel, ingredient.itemId, requiredQty, userId);
      }
    }
  }
};

/**
 * Seeder to initialize all Kyroz restaurant raw materials, packaging, SFGs, dishes, recipes, and portions.
 */
export const seedAllKyrozRestaurantData = async (userId: string | mongoose.Types.ObjectId): Promise<void> => {
  // 1. Seed Raw Materials
  const rawMaterialsData = [
    { code: 'RM001', name: 'Chicken', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 10, costPerPurchaseUnit: 250 },
    { code: 'RM002', name: 'Basmati Rice', category: 'Grain', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 10, costPerPurchaseUnit: 120 },
    { code: 'RM003', name: 'Dahi', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 5, costPerPurchaseUnit: 80 },
    { code: 'RM004', name: 'Oil/Ghee', category: 'Fat', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 10, costPerPurchaseUnit: 180 },
    { code: 'RM005', name: 'B-401 Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'packet', conversionFactor: 1, currentStock: 20, costPerPurchaseUnit: 150 },
    { code: 'RM006', name: 'Packaging', category: 'Packaging', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 5 },
    { code: 'RM007', name: 'B-404 A Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'packet', conversionFactor: 1, currentStock: 20, costPerPurchaseUnit: 160 },
    { code: 'RM008', name: 'B-404 B Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'packet', conversionFactor: 1, currentStock: 20, costPerPurchaseUnit: 140 },
    { code: 'RM009', name: 'Potato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 30 },
    { code: 'RM010', name: 'S-302 Yellow Temper', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 10, costPerPurchaseUnit: 200 },
    { code: 'RM011', name: 'S-301 Coastal Crust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 150 },
    { code: 'RM012', name: 'S-305 Steam Cloud', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 140 },
    { code: 'RM013', name: 'S-304 Crunch Core', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 160 },
    { code: 'RM014', name: 'S-303 Rava Pearl', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 120 },
    { code: 'RM015', name: 'S-308 Lentil Lava', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 180 },
    { code: 'RM016', name: 'Mixed Veggies', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 20, costPerPurchaseUnit: 60 },
    { code: 'RM017', name: 'S-307 Kerala Kernel', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 220 },
    { code: 'RM018', name: 'S-306 Tangy Tropic', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'kg', conversionFactor: 1, currentStock: 15, costPerPurchaseUnit: 190 }
  ];

  const rmIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const rm of rawMaterialsData) {
    const existing = await RawMaterial.findOne({ code: rm.code, userId });
    if (!existing) {
      const doc = new RawMaterial({ ...rm, userId });
      await doc.save();
      rmIds[rm.code] = doc._id as mongoose.Types.ObjectId;
    } else {
      rmIds[rm.code] = existing._id as mongoose.Types.ObjectId;
    }
  }

  // 2. Seed Packaging
  const packagingData = [
    { code: 'PKG001', name: 'Container', unit: 'pcs', currentStock: 100, costPerUnit: 5 },
    { code: 'PKG002', name: 'Spoon', unit: 'pcs', currentStock: 100, costPerUnit: 1 },
    { code: 'PKG003', name: 'Foil', unit: 'pcs', currentStock: 100, costPerUnit: 2 },
    { code: 'PKG004', name: 'Carry Bag', unit: 'pcs', currentStock: 100, costPerUnit: 3 },
    { code: 'PKG005', name: 'Dosa Box', unit: 'pcs', currentStock: 100, costPerUnit: 8 },
    { code: 'PKG006', name: 'Butter Paper', unit: 'pcs', currentStock: 100, costPerUnit: 2 },
    { code: 'PKG007', name: 'Idli Container', unit: 'pcs', currentStock: 100, costPerUnit: 6 },
    { code: 'PKG008', name: 'Chutney Container', unit: 'pcs', currentStock: 100, costPerUnit: 3 },
    { code: 'PKG009', name: 'Sambhar Container', unit: 'pcs', currentStock: 100, costPerUnit: 4 },
    { code: 'PKG010', name: 'Vada Box', unit: 'pcs', currentStock: 100, costPerUnit: 7 },
    { code: 'PKG011', name: 'Uttapam Box', unit: 'pcs', currentStock: 100, costPerUnit: 8 }
  ];

  const pkgIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const pkg of packagingData) {
    const existing = await Packaging.findOneAndUpdate(
      { code: pkg.code, userId },
      { $setOnInsert: { ...pkg, userId } },
      { upsert: true, new: true }
    );
    pkgIds[pkg.code] = existing._id as mongoose.Types.ObjectId;
  }

  // 3. Seed Semi-Finished Goods (SFGs)
  const sfgData = [
    { code: 'SFG001', name: 'Dosa Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG002', name: 'Idli Batter', batchYield: 2200, yieldUnit: 'gm', currentStock: 4400, costPerUnit: 0.07 },
    { code: 'SFG003', name: 'Aloo Masala Stuffing', batchYield: 1270, yieldUnit: 'gm', currentStock: 2540, costPerUnit: 0.05 },
    { code: 'SFG004', name: 'Coconut Chutney', batchYield: 3500, yieldUnit: 'gm', currentStock: 7000, costPerUnit: 0.07 },
    { code: 'SFG005', name: 'Red Chutney', batchYield: 3500, yieldUnit: 'gm', currentStock: 7000, costPerUnit: 0.06 },
    { code: 'SFG006', name: 'Premium Sambhar', batchYield: 10000, yieldUnit: 'ml', currentStock: 20000, costPerUnit: 0.03 },
    { code: 'SFG007', name: 'Medu Vada Batter', batchYield: 18, yieldUnit: 'portions', currentStock: 36, costPerUnit: 9 },
    { code: 'SFG008', name: 'Uttapam Batter', batchYield: 2400, yieldUnit: 'gm', currentStock: 4800, costPerUnit: 0.07 }
  ];

  const sfgIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const sfg of sfgData) {
    const existing = await SemiFinishedGood.findOneAndUpdate(
      { code: sfg.code, userId },
      { $setOnInsert: { ...sfg, userId } },
      { upsert: true, new: true }
    );
    sfgIds[sfg.code] = existing._id as mongoose.Types.ObjectId;
  }

  // 4. Seed Recipes for Semi-Finished Goods (SFGs)
  const sfgRecipes = [
    {
      sfgCode: 'SFG001',
      ingredients: [{ itemModel: 'RawMaterial' as const, itemId: rmIds['RM011'], quantity: 1 }]
    },
    {
      sfgCode: 'SFG002',
      ingredients: [{ itemModel: 'RawMaterial' as const, itemId: rmIds['RM012'], quantity: 1 }]
    },
    {
      sfgCode: 'SFG003',
      ingredients: [
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM009'], quantity: 1 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM010'], quantity: 0.12 }
      ]
    },
    {
      sfgCode: 'SFG004',
      ingredients: [{ itemModel: 'RawMaterial' as const, itemId: rmIds['RM017'], quantity: 1 }]
    },
    {
      sfgCode: 'SFG005',
      ingredients: [{ itemModel: 'RawMaterial' as const, itemId: rmIds['RM018'], quantity: 1 }]
    },
    {
      sfgCode: 'SFG006',
      ingredients: [
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM015'], quantity: 1 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM016'], quantity: 1.5 }
      ]
    },
    {
      sfgCode: 'SFG007',
      ingredients: [{ itemModel: 'RawMaterial' as const, itemId: rmIds['RM013'], quantity: 1 }]
    },
    {
      sfgCode: 'SFG008',
      ingredients: [{ itemModel: 'RawMaterial' as const, itemId: rmIds['RM012'], quantity: 1 }]
    }
  ];

  for (const sfgRec of sfgRecipes) {
    const sfgId = sfgIds[sfgRec.sfgCode];
    if (sfgId) {
      const sfgItem = sfgData.find(s => s.code === sfgRec.sfgCode);
      const yieldVal = sfgItem ? sfgItem.batchYield : 1;
      await Recipe.findOneAndUpdate(
        { targetModel: 'SemiFinishedGood', targetId: sfgId, userId },
        {
          targetYield: yieldVal,
          operationalYield: yieldVal,
          ingredients: sfgRec.ingredients,
          userId
        },
        { upsert: true }
      );
    }
  }

  // 5. Seed Dishes
  const dishesData = [
    { name: 'Kyroz Shahi Lucknowi Biryani', price: 220, ingredientPrice: 70, category: 'Biryani' },
    { name: 'Kyroz Indo Arabic White Mandi', price: 260, ingredientPrice: 90, category: 'Mandi' },
    { name: 'Small Masala Dosa', price: 80, ingredientPrice: 22, category: 'Dosa' },
    { name: 'Regular Masala Dosa', price: 120, ingredientPrice: 34, category: 'Dosa' },
    { name: 'Large Masala Dosa', price: 160, ingredientPrice: 46, category: 'Dosa' },
    { name: 'Mini Rice Idli', price: 60, ingredientPrice: 15, category: 'Idli' },
    { name: 'Regular Rice Idli', price: 80, ingredientPrice: 20, category: 'Idli' },
    { name: 'Large Rice Idli', price: 100, ingredientPrice: 25, category: 'Idli' },
    { name: 'Medu Vada Portion', price: 90, ingredientPrice: 25, category: 'Vada' },
    { name: 'Small Onion Rava Dosa', price: 90, ingredientPrice: 20, category: 'Rava Dosa' },
    { name: 'Regular Onion Rava Dosa', price: 130, ingredientPrice: 28, category: 'Rava Dosa' },
    { name: 'Large Onion Rava Dosa', price: 170, ingredientPrice: 36, category: 'Rava Dosa' },
    { name: 'Small Mix Veg Uttapam', price: 90, ingredientPrice: 22, category: 'Uttapam' },
    { name: 'Regular Mix Veg Uttapam', price: 130, ingredientPrice: 30, category: 'Uttapam' },
    { name: 'Large Mix Veg Uttapam', price: 170, ingredientPrice: 38, category: 'Uttapam' }
  ];

  const dishIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const dish of dishesData) {
    const existing = await Dish.findOne({ name: dish.name, userId });
    if (!existing) {
      const doc = new Dish({ ...dish, userId });
      await doc.save();
      dishIds[dish.name] = doc._id as mongoose.Types.ObjectId;
    } else {
      dishIds[dish.name] = existing._id as mongoose.Types.ObjectId;
    }
  }

  // 6. Seed Recipes for Dishes
  const dishRecipes = [
    {
      dishName: 'Kyroz Shahi Lucknowi Biryani',
      targetYield: 9,
      ingredients: [
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM001'], quantity: 1 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM002'], quantity: 1 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM003'], quantity: 0.15 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM004'], quantity: 0.25 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM005'], quantity: 1 }
      ]
    },
    {
      dishName: 'Kyroz Indo Arabic White Mandi',
      targetYield: 6,
      ingredients: [
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM001'], quantity: 1 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM002'], quantity: 1 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM004'], quantity: 0.18 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM007'], quantity: 1 },
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM008'], quantity: 1 }
      ]
    },
    {
      dishName: 'Small Masala Dosa',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG001'], quantity: 75 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG003'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Regular Masala Dosa',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG001'], quantity: 95 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG003'], quantity: 80 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Large Masala Dosa',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG001'], quantity: 115 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG003'], quantity: 120 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Mini Rice Idli',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG002'], quantity: 95 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Regular Rice Idli',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG002'], quantity: 90 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Large Rice Idli',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG002'], quantity: 115 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Medu Vada Portion',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG007'], quantity: 1 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG005'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Small Onion Rava Dosa',
      targetYield: 1,
      ingredients: [
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM014'], quantity: 1 / 36 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG005'], quantity: 40 }
      ]
    },
    {
      dishName: 'Regular Onion Rava Dosa',
      targetYield: 1,
      ingredients: [
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM014'], quantity: 1 / 26 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG005'], quantity: 40 }
      ]
    },
    {
      dishName: 'Large Onion Rava Dosa',
      targetYield: 1,
      ingredients: [
        { itemModel: 'RawMaterial' as const, itemId: rmIds['RM014'], quantity: 1 / 20 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG005'], quantity: 40 }
      ]
    },
    {
      dishName: 'Small Mix Veg Uttapam',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG008'], quantity: 95 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG005'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Regular Mix Veg Uttapam',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG008'], quantity: 130 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG005'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    },
    {
      dishName: 'Large Mix Veg Uttapam',
      targetYield: 1,
      ingredients: [
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG008'], quantity: 170 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG004'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG005'], quantity: 40 },
        { itemModel: 'SemiFinishedGood' as const, itemId: sfgIds['SFG006'], quantity: 80 }
      ]
    }
  ];

  for (const rec of dishRecipes) {
    const dishId = dishIds[rec.dishName];
    if (dishId) {
      await Recipe.findOneAndUpdate(
        { targetModel: 'Dish', targetId: dishId, userId },
        {
          targetYield: rec.targetYield,
          operationalYield: rec.targetYield,
          ingredients: rec.ingredients.filter(i => i.itemId !== undefined),
          userId
        },
        { upsert: true }
      );
    }
  }

  // 7. Seed Portion Stock (Inventory) ONLY for portion-tracked dishes
  const portionTrackedDishes = [
    { name: 'Kyroz Shahi Lucknowi Biryani', yield: 9 },
    { name: 'Kyroz Indo Arabic White Mandi', yield: 6 }
  ];

  for (const track of portionTrackedDishes) {
    const dishId = dishIds[track.name];
    if (dishId) {
      await Inventory.findOneAndUpdate(
        { dishId, userId },
        {
          $setOnInsert: {
            platesPerPacket: track.yield,
            totalPlates: track.yield * 2,
            lowStockThreshold: 5,
            userId
          }
        },
        { upsert: true }
      );
    }
  }
};

