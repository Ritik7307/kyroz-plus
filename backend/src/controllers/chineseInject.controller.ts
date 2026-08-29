import { Request, Response } from 'express';
import Dish from '../models/Dish';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const injectChinese = async (req: Request, res: Response): Promise<void> => {
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

    console.log(`Injecting Chinese dishes for user: ${activeUserId}`);

    const newRawMaterials = [
      { name: "Z-105 TANGY COAT Premix", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Master Sweet & Sour Gravy", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Crispy Fried Noodle Nest", unit: "pcs", costPerPurchaseUnit: 15, conversionFactor: 1, consumptionUnit: "pc" },
      { name: "Mixed Vegetables", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Tomato Ketchup", unit: "L", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Cornflour Slurry", unit: "L", costPerPurchaseUnit: 40, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Pineapple Pieces", unit: "kg", costPerPurchaseUnit: 120, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Egg Bullseye / Boiled Egg", unit: "pcs", costPerPurchaseUnit: 10, conversionFactor: 1, consumptionUnit: "pc" },
      { name: "Refined Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },

      { name: "Z-102 CRYSTAL GLAZE Premix", unit: "kg", costPerPurchaseUnit: 350, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Master Chilli Liquid Base", unit: "L", costPerPurchaseUnit: 120, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Fried Paneer / Fried Chicken / Fried Soya Chaap", unit: "kg", costPerPurchaseUnit: 300, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Capsicum Cubes", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Onion Cubes", unit: "kg", costPerPurchaseUnit: 60, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Slit Green Chilli", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Spring Onion", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Z-101 DARK MASTER Premix", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Master Manchurian Liquid Base", unit: "L", costPerPurchaseUnit: 140, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Fried Veg Manchurian Balls / Fried Chicken Manchurian", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Z-105 TANGY COAT Powder", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Double Fried Potato Fingers", unit: "kg", costPerPurchaseUnit: 120, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Honey", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "ml" }, // Unit says L, but using ml for portion
      { name: "Chopped Garlic", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "White Sesame", unit: "kg", costPerPurchaseUnit: 300, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Water", unit: "L", costPerPurchaseUnit: 10, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Z-102 CRYSTAL GLAZE LIQUID", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Mixed Soup Vegetables", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Vinegar", unit: "L", costPerPurchaseUnit: 60, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Red Chilli Paste", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Z-101 DARK MASTER Liquid", unit: "L", costPerPurchaseUnit: 180, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Fresh Garlic", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fresh Ginger", unit: "kg", costPerPurchaseUnit: 180, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Coriander Stems", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Black Pepper", unit: "kg", costPerPurchaseUnit: 800, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fried Noodles", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Teja Chilli Flakes", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Kashmiri Chilli Powder", unit: "kg", costPerPurchaseUnit: 500, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Star Anise", unit: "kg", costPerPurchaseUnit: 1200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Cinnamon", unit: "kg", costPerPurchaseUnit: 800, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Salt", unit: "kg", costPerPurchaseUnit: 30, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Fresh Chopped Garlic", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" }
    ];

    const rmMap: Record<string, any> = {};
    for (const rm of newRawMaterials) {
      let doc = await RawMaterial.findOne({ name: rm.name, userId: activeUserId });
      if (!doc) {
        doc = new RawMaterial({ ...rm, userId: activeUserId, purchaseUnit: rm.unit || 'kg', category: 'General', code: 'RM_' + Date.now() + Math.floor(Math.random()*1000) });
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
        // Mock it if not found
        doc = new RawMaterial({ name, unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm", userId: activeUserId, purchaseUnit: "kg", category: "General", code: "RM_" + Date.now() + Math.floor(Math.random()*1000) });
        await doc.save();
        rmMap[name] = doc;
        return doc;
    };

    const dishesToCreate = [
      {
        name: "AMERICAN CHOPSUEY",
        category: "Chinese",
        price: 249,
        ingredients: [
          { name: "Master Sweet & Sour Gravy", qty: 350, unit: "ml" },
          { name: "Mixed Vegetables", qty: 120, unit: "gm" },
          { name: "Crispy Fried Noodle Nest", qty: 1, unit: "pc" },
          { name: "Tomato Ketchup", qty: 30, unit: "ml" },
          { name: "Cornflour Slurry", qty: 45, unit: "ml" },
          { name: "Pineapple Pieces", qty: 20, unit: "gm" },
          { name: "Egg Bullseye / Boiled Egg", qty: 1, unit: "pc" },
          { name: "Refined Oil", qty: 20, unit: "ml" }
        ]
      },
      {
        name: "CHILLI PANEER / CHICKEN / SOYA CHAAP (Dry)",
        category: "Chinese",
        price: 229,
        ingredients: [
          { name: "Master Chilli Liquid Base", qty: 100, unit: "ml" },
          { name: "Fried Paneer / Fried Chicken / Fried Soya Chaap", qty: 180, unit: "gm" },
          { name: "Capsicum Cubes", qty: 50, unit: "gm" },
          { name: "Onion Cubes", qty: 50, unit: "gm" },
          { name: "Refined Oil", qty: 10, unit: "ml" },
          { name: "Slit Green Chilli", qty: 5, unit: "gm" },
          { name: "Spring Onion", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "CHILLI PANEER / CHICKEN / SOYA CHAAP (Gravy)",
        category: "Chinese",
        price: 249,
        ingredients: [
          { name: "Master Chilli Liquid Base", qty: 300, unit: "ml" },
          { name: "Cornflour Slurry", qty: 30, unit: "ml" },
          { name: "Fried Paneer / Fried Chicken / Fried Soya Chaap", qty: 180, unit: "gm" },
          { name: "Capsicum Cubes", qty: 50, unit: "gm" },
          { name: "Onion Cubes", qty: 50, unit: "gm" },
          { name: "Refined Oil", qty: 10, unit: "ml" },
          { name: "Slit Green Chilli", qty: 5, unit: "gm" },
          { name: "Spring Onion", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "MANCHURIAN (Veg / Chicken) (Dry)",
        category: "Chinese",
        price: 199,
        ingredients: [
          { name: "Master Manchurian Liquid Base", qty: 100, unit: "ml" },
          { name: "Cornflour Slurry", qty: 15, unit: "ml" },
          { name: "Fried Veg Manchurian Balls / Fried Chicken Manchurian", qty: 180, unit: "gm" },
          { name: "Refined Oil", qty: 10, unit: "ml" },
          { name: "Spring Onion", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "MANCHURIAN (Veg / Chicken) (Gravy)",
        category: "Chinese",
        price: 219,
        ingredients: [
          { name: "Master Manchurian Liquid Base", qty: 275, unit: "ml" },
          { name: "Cornflour Slurry", qty: 45, unit: "ml" },
          { name: "Fried Veg Manchurian Balls / Fried Chicken Manchurian", qty: 180, unit: "gm" },
          { name: "Refined Oil", qty: 10, unit: "ml" },
          { name: "Spring Onion", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "HONEY CHILLI POTATO",
        category: "Chinese",
        price: 189,
        ingredients: [
          { name: "Double Fried Potato Fingers", qty: 180, unit: "gm" },
          { name: "Master Sweet & Sour Gravy", qty: 120, unit: "ml" }, // Replaced "Honey Chilli Glaze Base" with the Z-105 equivalent
          { name: "Tomato Ketchup", qty: 15, unit: "ml" },
          { name: "Honey", qty: 15, unit: "ml" },
          { name: "Cornflour Slurry", qty: 15, unit: "ml" },
          { name: "Chopped Garlic", qty: 5, unit: "gm" },
          { name: "White Sesame", qty: 3, unit: "gm" },
          { name: "Spring Onion", qty: 5, unit: "gm" },
          { name: "Refined Oil", qty: 10, unit: "ml" }
        ]
      },
      {
        name: "HOT & SOUR SOUP",
        category: "Chinese",
        price: 149,
        ingredients: [
          { name: "Z-102 CRYSTAL GLAZE LIQUID", qty: 120, unit: "ml" }, // They call it Z-102 Soup Base, but maps to this
          { name: "Water", qty: 180, unit: "ml" },
          { name: "Mixed Soup Vegetables", qty: 40, unit: "gm" },
          { name: "Cornflour Slurry", qty: 30, unit: "ml" },
          { name: "Vinegar", qty: 2.5, unit: "ml" },
          { name: "Red Chilli Paste", qty: 2, unit: "gm" },
          { name: "Spring Onion", qty: 5, unit: "gm" },
          { name: "Refined Oil", qty: 5, unit: "ml" }
        ]
      },
      {
        name: "MANCHOW SOUP",
        category: "Chinese",
        price: 159,
        ingredients: [
          { name: "Z-101 DARK MASTER Liquid", qty: 100, unit: "ml" },
          { name: "Water", qty: 200, unit: "ml" },
          { name: "Mixed Soup Vegetables", qty: 40, unit: "gm" }, // Mixed Vegetables mapping
          { name: "Cornflour Slurry", qty: 30, unit: "ml" },
          { name: "Fresh Garlic", qty: 5, unit: "gm" },
          { name: "Fresh Ginger", qty: 2, unit: "gm" },
          { name: "Coriander Stems", qty: 3, unit: "gm" },
          { name: "Black Pepper", qty: 0.5, unit: "gm" },
          { name: "Vinegar", qty: 1, unit: "ml" },
          { name: "Fried Noodles", qty: 10, unit: "gm" },
          { name: "Spring Onion", qty: 5, unit: "gm" },
          { name: "Refined Oil", qty: 5, unit: "ml" }
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

      // Ingredients mapping
      const mappedIngredients: any[] = [];
      for (const ingDef of d.ingredients) {
        const rmDoc = await getIng(ingDef.name);
        mappedIngredients.push({
          itemId: rmDoc._id, itemModel: rmDoc.code && rmDoc.code.includes('SFG') ? 'SemiFinishedGood' : 'RawMaterial',
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
    
    // Also inject the Master Chilli/Garlic Oil SFGs if possible, or just raw materials.
    // They are used as components.
    const oils = [
      {
        name: "F-301 MASTER CHILLI OIL",
        category: "Chinese Component",
        price: 0, // It's a finishing component, maybe keep as SFG in reality, but we store as dish for reference or they can just be SFG?
        ingredients: [
          { name: "Refined Oil", qty: 1000, unit: "ml" },
          { name: "Teja Chilli Flakes", qty: 10, unit: "gm" }, // Assume 10g for 1L
          { name: "Kashmiri Chilli Powder", qty: 10, unit: "gm" },
          { name: "Star Anise", qty: 2, unit: "gm" },
          { name: "Cinnamon", qty: 5, unit: "gm" },
          { name: "Salt", qty: 10, unit: "gm" }
        ]
      },
      {
        name: "F-302 MASTER GARLIC OIL",
        category: "Chinese Component",
        price: 0,
        ingredients: [
          { name: "Refined Oil", qty: 500, unit: "ml" },
          { name: "Fresh Chopped Garlic", qty: 200, unit: "gm" },
          { name: "Salt", qty: 5, unit: "gm" }
        ]
      }
    ];
    
    // Create SFGs for the oils instead of Dishes
    for (const d of oils) {
      let sfg = await SemiFinishedGood.findOne({ name: d.name, userId: activeUserId });
      if (!sfg) {
        sfg = new SemiFinishedGood({ code: 'SFG_INJ_' + Date.now() + Math.floor(Math.random()*1000),
          name: d.name,
          category: d.category,
          costPerUnit: 100, // mock
          unitCost: 100,
          yieldUnit: "ml",
          batchYield: d.name === "F-301 MASTER CHILLI OIL" ? 1000 : 500,
          userId: activeUserId
        });
        await sfg.save();
      }
      
      const mappedIngredients: any[] = [];
      for (const ingDef of d.ingredients) {
        const rmDoc = await getIng(ingDef.name);
        mappedIngredients.push({
          itemId: rmDoc._id, itemModel: rmDoc.code && rmDoc.code.includes('SFG') ? 'SemiFinishedGood' : 'RawMaterial',
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

    res.status(200).json({ message: "Chinese dishes injected successfully!" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
