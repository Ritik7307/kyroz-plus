import { Request, Response } from 'express';
import Dish from '../models/Dish';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const injectMandi = async (req: Request, res: Response): Promise<void> => {
  try {
    let activeUserId = req.body.userId || (req as any).user?.userId;
    if (!activeUserId) {
      const User = require('../models/User').default;
      const user = await User.findOne({ email: 'vijayshankarprajapati29@gmail.com' });
      if (!user) {
        res.status(400).json({ error: 'userId required' });
        return;
      }
      activeUserId = user._id;
    }

    console.log(`Injecting Mandi Architecture for user: ${activeUserId}`);

    const newRawMaterials = [
      { name: "Chicken LG + Thigh", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Mutton", unit: "kg", costPerPurchaseUnit: 800, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Long Grain/Sella Rice", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Onion", unit: "kg", costPerPurchaseUnit: 60, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Ginger Garlic Paste", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Lemon", unit: "pcs", costPerPurchaseUnit: 5, conversionFactor: 15, consumptionUnit: "ml" }, // Approx 15ml juice per lemon
      { name: "Green Chilli", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "B-404 A packet", unit: "kg", costPerPurchaseUnit: 500, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "B-404 B packet", unit: "kg", costPerPurchaseUnit: 500, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Coal", unit: "kg", costPerPurchaseUnit: 50, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Water", unit: "L", costPerPurchaseUnit: 10, conversionFactor: 1000, consumptionUnit: "ml" }
    ];

    const rmMap: Record<string, any> = {};
    for (const rm of newRawMaterials) {
      let doc = await RawMaterial.findOne({ name: rm.name, userId: activeUserId });
      if (!doc) {
        doc = new RawMaterial({ ...rm, userId: activeUserId });
        await doc.save();
      }
      rmMap[rm.name] = doc;
    }
    
    const getDoc = async (model: any, name: string) => {
      return await model.findOne({ name, userId: activeUserId });
    };

    const getIng = async (name: string) => {
        let doc = rmMap[name];
        if (doc) return doc;
        doc = await getDoc(SemiFinishedGood, name);
        if (doc) return doc;
        doc = await getDoc(RawMaterial, name);
        if (doc) return doc;
        doc = new RawMaterial({ name, unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm", userId: activeUserId });
        await doc.save();
        rmMap[name] = doc;
        return doc;
    };

    // 1. Create SFGs
    const sfgs = [
      {
        name: "Mandi Stock",
        category: "Base",
        batchYield: 2000, // 2 Litres
        yieldUnit: "ml",
        ingredients: [
          { name: "Water", qty: 2000, unit: "ml" },
          { name: "Onion", qty: 100, unit: "gm" } // basic mock stock
        ]
      },
      {
        name: "Steamed Chicken",
        category: "Protein",
        batchYield: 6, // 6 pcs
        yieldUnit: "pc",
        ingredients: [
          { name: "Chicken LG + Thigh", qty: 1300, unit: "gm" },
          { name: "B-404 A packet", qty: 50, unit: "gm" },
          { name: "Ginger Garlic Paste", qty: 30, unit: "gm" },
          { name: "Lemon", qty: 30, unit: "ml" },
          { name: "Oil", qty: 20, unit: "ml" },
          { name: "Coal", qty: 50, unit: "gm" } // Smoking
        ]
      },
      {
        name: "Steamed Mutton",
        category: "Protein",
        batchYield: 6, // Treating 650gm as 6 pcs/portions for easy portioning
        yieldUnit: "pc",
        ingredients: [
          { name: "Mutton", qty: 1000, unit: "gm" },
          { name: "B-404 A packet", qty: 50, unit: "gm" },
          { name: "Ginger Garlic Paste", qty: 30, unit: "gm" },
          { name: "Lemon", qty: 30, unit: "ml" },
          { name: "Oil", qty: 20, unit: "ml" },
          { name: "Coal", qty: 50, unit: "gm" }
        ]
      },
      {
        name: "Mandi Rice",
        category: "Rice",
        batchYield: 3200, // 3.2 kg
        yieldUnit: "gm",
        ingredients: [
          { name: "Long Grain/Sella Rice", qty: 1000, unit: "gm" },
          { name: "Mandi Stock", qty: 1000, unit: "ml" },
          { name: "B-404 B packet", qty: 50, unit: "gm" },
          { name: "Onion", qty: 150, unit: "gm" },
          { name: "Green Chilli", qty: 20, unit: "gm" },
          { name: "Oil", qty: 50, unit: "ml" },
          { name: "Coal", qty: 50, unit: "gm" }
        ]
      }
    ];

    for (const d of sfgs) {
      let sfg = await SemiFinishedGood.findOne({ name: d.name, userId: activeUserId });
      if (!sfg) {
        sfg = new SemiFinishedGood({
          name: d.name,
          category: d.category,
          costPerUnit: 100, // mock
          unitCost: 100,
          yieldUnit: d.yieldUnit,
          batchYield: d.batchYield,
          userId: activeUserId
        });
        await sfg.save();
      }
      
      const mappedIngredients: any[] = [];
      for (const ingDef of d.ingredients) {
        const rmDoc = await getIng(ingDef.name);
        mappedIngredients.push({
          sfgId: rmDoc._id,
          name: rmDoc.name,
          quantity: ingDef.qty,
          unit: ingDef.unit
        });
      }
      
      let recipe = await Recipe.findOne({ targetModel: 'SemiFinishedGood', targetId: sfg._id, userId: activeUserId });
      if (!recipe) {
        recipe = new Recipe({
          targetModel: 'SemiFinishedGood',
          targetId: sfg._id,
          targetYield: sfg.batchYield,
          operationalYield: sfg.batchYield,
          ingredients: mappedIngredients,
          userId: activeUserId
        });
        await recipe.save();
      } else {
        recipe.ingredients = mappedIngredients;
        await recipe.save();
      }
    }

    // 2. Create Final Dishes
    const dishesToCreate = [
      {
        name: "Chicken White Mandi",
        category: "Arabic",
        price: 399,
        ingredients: [
          { name: "Mandi Rice", qty: 500, unit: "gm" },
          { name: "Steamed Chicken", qty: 1, unit: "pc" }
        ]
      },
      {
        name: "Mutton White Mandi",
        category: "Arabic",
        price: 499,
        ingredients: [
          { name: "Mandi Rice", qty: 500, unit: "gm" },
          { name: "Steamed Mutton", qty: 1, unit: "pc" }
        ]
      }
    ];

    for (const d of dishesToCreate) {
      let dish = await Dish.findOne({ name: d.name, userId: activeUserId });
      if (!dish) {
        dish = new Dish({
          name: d.name,
          category: d.category,
          price: d.price,
          imageUrl: "",
          userId: activeUserId
        });
        await dish.save();
      }

      const mappedIngredients: any[] = [];
      for (const ingDef of d.ingredients) {
        const rmDoc = await getIng(ingDef.name);
        mappedIngredients.push({
          sfgId: rmDoc._id,
          name: rmDoc.name,
          quantity: ingDef.qty,
          unit: ingDef.unit
        });
      }

      let recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dish._id, userId: activeUserId });
      if (!recipe) {
        recipe = new Recipe({
          targetModel: 'Dish',
          targetId: dish._id,
          targetYield: 1,
          operationalYield: 1,
          ingredients: mappedIngredients,
          userId: activeUserId
        });
        await recipe.save();
      } else {
        recipe.ingredients = mappedIngredients;
        await recipe.save();
      }

      let inventory = await Inventory.findOne({ dishId: dish._id, userId: activeUserId });
      if (!inventory) {
        inventory = new Inventory({
          dishId: dish._id,
          platesPerPacket: 10,
          totalPlates: 0,
          lowStockThreshold: 5,
          userId: activeUserId
        });
        await inventory.save();
      }
    }

    res.status(200).json({ message: "Mandi architecture injected successfully!" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
