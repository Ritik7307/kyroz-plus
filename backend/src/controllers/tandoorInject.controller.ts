import { Request, Response } from 'express';
import Dish from '../models/Dish';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const injectTandoor = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = "test_user_id"; 
    const User = require('../models/User').default;
    const testUser = await User.findOne();
    const activeUserId = testUser ? testUser._id : "test_user_id";

    console.log(`Injecting Tandoor Architecture for user: ${activeUserId}`);

    const newRawMaterials = [
      { name: "Raw Chicken", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Hang Curd", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Mustard Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Besan", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Ginger Garlic Paste", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "T-604 CRIMSON COAT", unit: "kg", costPerPurchaseUnit: 500, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "T-605 SILK INFUSION", unit: "kg", costPerPurchaseUnit: 600, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fresh Cream", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Melted Butter", unit: "kg", costPerPurchaseUnit: 600, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Lemon Juice", unit: "L", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Chat Masala", unit: "kg", costPerPurchaseUnit: 300, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Lemon", unit: "pcs", costPerPurchaseUnit: 5, conversionFactor: 1, consumptionUnit: "pc" },
      
      { name: "Chicken Meat", unit: "kg", costPerPurchaseUnit: 280, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Chicken/Mutton Fat", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "T-606 MINCE MASTER", unit: "kg", costPerPurchaseUnit: 550, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Onion (de-watered)", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Green Chilli", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Ginger Garlic", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Whole Chicken (800-900 gm)", unit: "pc", costPerPurchaseUnit: 250, conversionFactor: 1, consumptionUnit: "pc" },
      { name: "T-607 ARABIAN SMOKE", unit: "kg", costPerPurchaseUnit: 650, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Olive Oil", unit: "L", costPerPurchaseUnit: 800, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Garlic Mayo/Hummus", unit: "L", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Paneer", unit: "kg", costPerPurchaseUnit: 350, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Soya Chaap", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Button Mushroom", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Veg Momos", unit: "pcs", costPerPurchaseUnit: 5, conversionFactor: 1, consumptionUnit: "pc" },
      { name: "T-601 CLASSIC CHAR", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "T-602 WHITE VELVET", unit: "kg", costPerPurchaseUnit: 500, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "T-603 VERDANT RUB", unit: "kg", costPerPurchaseUnit: 450, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Achari Mix", unit: "L", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Prepared Momo Chutney", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" }
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
        name: "12-Hour Marinated Chicken (T-604)",
        category: "Marination",
        batchYield: 2000, 
        yieldUnit: "gm",
        ingredients: [
          { name: "Raw Chicken", qty: 2000, unit: "gm" },
          { name: "T-604 CRIMSON COAT", qty: 100, unit: "gm" },
          { name: "Hang Curd", qty: 200, unit: "gm" },
          { name: "Mustard Oil", qty: 50, unit: "ml" },
          { name: "Besan", qty: 50, unit: "gm" },
          { name: "Ginger Garlic Paste", qty: 50, unit: "gm" }
        ]
      },
      {
        name: "12-Hour Marinated Chicken (T-605)",
        category: "Marination",
        batchYield: 2000, 
        yieldUnit: "gm",
        ingredients: [
          { name: "Raw Chicken", qty: 2000, unit: "gm" },
          { name: "T-605 SILK INFUSION", qty: 100, unit: "gm" },
          { name: "Hang Curd", qty: 200, unit: "gm" },
          { name: "Fresh Cream", qty: 100, unit: "gm" },
          { name: "Melted Butter", qty: 50, unit: "gm" },
          { name: "Ginger Garlic Paste", qty: 50, unit: "gm" },
          { name: "Lemon Juice", qty: 20, unit: "ml" }
        ]
      },
      {
        name: "Marinated Seekh Kebab Mix",
        category: "Mince",
        batchYield: 1000, 
        yieldUnit: "gm",
        ingredients: [
          { name: "Chicken Meat", qty: 700, unit: "gm" },
          { name: "Chicken/Mutton Fat", qty: 150, unit: "gm" },
          { name: "T-606 MINCE MASTER", qty: 50, unit: "gm" },
          { name: "Onion (de-watered)", qty: 50, unit: "gm" },
          { name: "Green Chilli", qty: 20, unit: "gm" },
          { name: "Ginger Garlic", qty: 30, unit: "gm" }
        ]
      },
      {
        name: "Marinated Al Faham Chicken",
        category: "Marination",
        batchYield: 1, 
        yieldUnit: "pc",
        ingredients: [
          { name: "Whole Chicken (800-900 gm)", qty: 1, unit: "pc" },
          { name: "T-607 ARABIAN SMOKE", qty: 50, unit: "gm" },
          { name: "Hang Curd", qty: 100, unit: "gm" },
          { name: "Olive Oil", qty: 20, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 30, unit: "gm" },
          { name: "Lemon Juice", qty: 10, unit: "ml" }
        ]
      },
      {
        name: "T-601 Ready Paste",
        category: "Paste",
        batchYield: 600, 
        yieldUnit: "gm",
        ingredients: [
          { name: "T-601 CLASSIC CHAR", qty: 200, unit: "gm" },
          { name: "Hang Curd", qty: 300, unit: "gm" },
          { name: "Mustard Oil", qty: 100, unit: "ml" }
        ]
      },
      {
        name: "T-602 Ready Paste",
        category: "Paste",
        batchYield: 600, 
        yieldUnit: "gm",
        ingredients: [
          { name: "T-602 WHITE VELVET", qty: 200, unit: "gm" },
          { name: "Hang Curd", qty: 200, unit: "gm" },
          { name: "Fresh Cream", qty: 200, unit: "gm" }
        ]
      },
      {
        name: "T-603 Ready Paste",
        category: "Paste",
        batchYield: 600, 
        yieldUnit: "gm",
        ingredients: [
          { name: "T-603 VERDANT RUB", qty: 200, unit: "gm" },
          { name: "Hang Curd", qty: 200, unit: "gm" },
          { name: "Fresh Cream", qty: 200, unit: "gm" }
        ]
      }
    ];

    for (const d of sfgs) {
      let sfg = await SemiFinishedGood.findOne({ name: d.name, userId: activeUserId });
      if (!sfg) {
        sfg = new SemiFinishedGood({
          name: d.name,
          category: d.category,
          costPerUnit: 100,
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
        name: "Chicken Tikka",
        category: "Tandoor",
        price: 249,
        ingredients: [
          { name: "12-Hour Marinated Chicken (T-604)", qty: 210, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" },
          { name: "Chat Masala", qty: 2, unit: "gm" },
          { name: "Lemon", qty: 1, unit: "pc" }
        ]
      },
      {
        name: "Tandoori Chicken Half",
        category: "Tandoor",
        price: 349,
        ingredients: [
          { name: "12-Hour Marinated Chicken (T-604)", qty: 500, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" },
          { name: "Chat Masala", qty: 2, unit: "gm" },
          { name: "Lemon", qty: 1, unit: "pc" }
        ]
      },
      {
        name: "Tandoori Chicken Full",
        category: "Tandoor",
        price: 649,
        ingredients: [
          { name: "12-Hour Marinated Chicken (T-604)", qty: 1000, unit: "gm" },
          { name: "Melted Butter", qty: 10, unit: "gm" },
          { name: "Fresh Cream", qty: 10, unit: "gm" },
          { name: "Chat Masala", qty: 4, unit: "gm" },
          { name: "Lemon", qty: 1, unit: "pc" }
        ]
      },
      
      {
        name: "Chicken Malai Tikka",
        category: "Tandoor",
        price: 279,
        ingredients: [
          { name: "12-Hour Marinated Chicken (T-605)", qty: 210, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Afghani Chicken Half",
        category: "Tandoor",
        price: 379,
        ingredients: [
          { name: "12-Hour Marinated Chicken (T-605)", qty: 500, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Afghani Chicken Full",
        category: "Tandoor",
        price: 699,
        ingredients: [
          { name: "12-Hour Marinated Chicken (T-605)", qty: 1000, unit: "gm" },
          { name: "Melted Butter", qty: 10, unit: "gm" },
          { name: "Fresh Cream", qty: 10, unit: "gm" }
        ]
      },
      
      {
        name: "Chicken Seekh Kebab",
        category: "Tandoor",
        price: 299,
        ingredients: [
          { name: "Marinated Seekh Kebab Mix", qty: 90, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Chat Masala", qty: 2, unit: "gm" },
          { name: "Lemon", qty: 1, unit: "pc" }
        ]
      },
      
      {
        name: "Al Faham Chicken",
        category: "Tandoor",
        price: 699,
        ingredients: [
          { name: "Marinated Al Faham Chicken", qty: 1, unit: "pc" },
          { name: "Olive Oil", qty: 15, unit: "ml" },
          { name: "Garlic Mayo/Hummus", qty: 40, unit: "ml" },
          { name: "Lemon", qty: 1, unit: "pc" } // Used wedges mapped to 1 pc
        ]
      },
      
      {
        name: "Tandoori Paneer",
        category: "Veg Tandoor",
        price: 249,
        ingredients: [
          { name: "Paneer", qty: 150, unit: "gm" },
          { name: "T-601 Ready Paste", qty: 60, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Tandoori Chaap",
        category: "Veg Tandoor",
        price: 199,
        ingredients: [
          { name: "Soya Chaap", qty: 150, unit: "gm" },
          { name: "T-601 Ready Paste", qty: 60, unit: "gm" }
        ]
      },
      {
        name: "Malai Paneer",
        category: "Veg Tandoor",
        price: 269,
        ingredients: [
          { name: "Paneer", qty: 150, unit: "gm" },
          { name: "T-602 Ready Paste", qty: 60, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Hariyali Paneer",
        category: "Veg Tandoor",
        price: 259,
        ingredients: [
          { name: "Paneer", qty: 150, unit: "gm" },
          { name: "T-603 Ready Paste", qty: 60, unit: "gm" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Achari Paneer",
        category: "Veg Tandoor",
        price: 259,
        ingredients: [
          { name: "Paneer", qty: 150, unit: "gm" },
          { name: "T-602 Ready Paste", qty: 60, unit: "gm" },
          { name: "Achari Mix", qty: 15, unit: "ml" },
          { name: "Melted Butter", qty: 5, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Tandoori Momos",
        category: "Veg Tandoor",
        price: 189,
        ingredients: [
          { name: "Veg Momos", qty: 6, unit: "pcs" },
          { name: "T-601 Ready Paste", qty: 60, unit: "gm" },
          { name: "Prepared Momo Chutney", qty: 20, unit: "ml" }
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

    res.status(200).json({ message: "Tandoor architecture injected successfully!" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
