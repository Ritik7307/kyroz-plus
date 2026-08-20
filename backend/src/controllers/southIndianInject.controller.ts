import { Request, Response } from 'express';
import Dish from '../models/Dish';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const injectSouthIndian = async (req: Request, res: Response): Promise<void> => {
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

    console.log(`Injecting South Indian Architecture for user: ${activeUserId}`);

    const newRawMaterials = [
      { name: "S-305 STEAM CLOUD", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Onion", unit: "kg", costPerPurchaseUnit: 60, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Tomato", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Green Chilli", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fresh Coriander", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Oil / Butter", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "RO Water", unit: "L", costPerPurchaseUnit: 5, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "S-301 COASTAL CRUST", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "S-302 YELLOW TEMPER", unit: "kg", costPerPurchaseUnit: 450, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Boiled Potatoes", unit: "kg", costPerPurchaseUnit: 50, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Cooking Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "S-303 RAVA PEARL", unit: "kg", costPerPurchaseUnit: 350, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Oil/Ghee", unit: "L", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "S-304 CRUNCH CORE", unit: "kg", costPerPurchaseUnit: 380, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Refined Frying Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Mould Greasing Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "S-306 TANGY TROPIC", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "RO Water (Luke Warm)", unit: "L", costPerPurchaseUnit: 5, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Tempering Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Mustard Seeds", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Urad Dal", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Curry Leaves", unit: "kg", costPerPurchaseUnit: 300, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "S-307 KERALA KERNEL", unit: "kg", costPerPurchaseUnit: 450, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "RO Water (Cold)", unit: "L", costPerPurchaseUnit: 5, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Dry Red Chilli", unit: "pcs", costPerPurchaseUnit: 2, conversionFactor: 1, consumptionUnit: "pc" },
      
      { name: "S-308 LENTIL LAVA", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Boiled Vegetables", unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Tempering Oil/Ghee", unit: "L", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "ml" },
      
      // Add missing sfgs to raw materials to get mock docs just in case
      { name: "Mixed Veg Topping", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" }
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
        name: "Prepared Uttapam Batter",
        category: "Batter",
        batchYield: 2500, // 1 kg premix + 1.5 L water
        yieldUnit: "gm",
        ingredients: [
          { name: "S-305 STEAM CLOUD", qty: 1000, unit: "gm" },
          { name: "RO Water", qty: 1500, unit: "ml" }
        ]
      },
      {
        name: "Prepared Dosa Batter",
        category: "Batter",
        batchYield: 2500,
        yieldUnit: "gm",
        ingredients: [
          { name: "S-301 COASTAL CRUST", qty: 1000, unit: "gm" },
          { name: "RO Water", qty: 1500, unit: "ml" }
        ]
      },
      {
        name: "Prepared Aloo Masala Stuffing",
        category: "Stuffing",
        batchYield: 1500,
        yieldUnit: "gm",
        ingredients: [
          { name: "S-302 YELLOW TEMPER", qty: 1000, unit: "gm" },
          { name: "Boiled Potatoes", qty: 1000, unit: "gm" },
          { name: "Cooking Oil", qty: 100, unit: "ml" },
          { name: "RO Water", qty: 200, unit: "ml" }
        ]
      },
      {
        name: "Prepared Rava Dosa Batter",
        category: "Batter",
        batchYield: 3500, // 1kg + 2.5L
        yieldUnit: "gm",
        ingredients: [
          { name: "S-303 RAVA PEARL", qty: 1000, unit: "gm" },
          { name: "RO Water", qty: 2500, unit: "ml" }
        ]
      },
      {
        name: "Prepared Medu Vada Batter",
        category: "Batter",
        batchYield: 1800, // 1kg + 800ml
        yieldUnit: "gm",
        ingredients: [
          { name: "S-304 CRUNCH CORE", qty: 1000, unit: "gm" },
          { name: "RO Water", qty: 800, unit: "ml" }
        ]
      },
      {
        name: "Prepared Idli Batter",
        category: "Batter",
        batchYield: 2200, // 1kg + 1.2L
        yieldUnit: "gm",
        ingredients: [
          { name: "S-305 STEAM CLOUD", qty: 1000, unit: "gm" },
          { name: "RO Water", qty: 1200, unit: "ml" }
        ]
      },
      {
        name: "Prepared Red (Kara) Chutney",
        category: "Chutney",
        batchYield: 3500,
        yieldUnit: "gm",
        ingredients: [
          { name: "S-306 TANGY TROPIC", qty: 1000, unit: "gm" },
          { name: "RO Water (Luke Warm)", qty: 2500, unit: "ml" },
          { name: "Tempering Oil", qty: 50, unit: "ml" },
          { name: "Mustard Seeds", qty: 10, unit: "gm" },
          { name: "Urad Dal", qty: 10, unit: "gm" },
          { name: "Curry Leaves", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Prepared Coconut Chutney",
        category: "Chutney",
        batchYield: 3500,
        yieldUnit: "gm",
        ingredients: [
          { name: "S-307 KERALA KERNEL", qty: 1000, unit: "gm" },
          { name: "RO Water (Cold)", qty: 2500, unit: "ml" },
          { name: "Tempering Oil", qty: 50, unit: "ml" },
          { name: "Mustard Seeds", qty: 10, unit: "gm" },
          { name: "Dry Red Chilli", qty: 5, unit: "pcs" },
          { name: "Curry Leaves", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "Prepared Sambhar",
        category: "Gravy",
        batchYield: 10000, // 10 L
        yieldUnit: "ml",
        ingredients: [
          { name: "S-308 LENTIL LAVA", qty: 1000, unit: "gm" },
          { name: "RO Water", qty: 9000, unit: "ml" },
          { name: "Boiled Vegetables", qty: 1500, unit: "gm" },
          { name: "Tempering Oil/Ghee", qty: 100, unit: "ml" },
          { name: "Mustard Seeds", qty: 20, unit: "gm" },
          { name: "Dry Red Chilli", qty: 10, unit: "pcs" },
          { name: "Curry Leaves", qty: 10, unit: "gm" }
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
        name: "Mix-Veg Uttapam",
        category: "South Indian",
        price: 149,
        ingredients: [
          { name: "Prepared Uttapam Batter", qty: 180, unit: "gm" },
          { name: "Onion", qty: 15, unit: "gm" },
          { name: "Tomato", qty: 15, unit: "gm" },
          { name: "Green Chilli", qty: 5, unit: "gm" },
          { name: "Fresh Coriander", qty: 5, unit: "gm" },
          { name: "Oil / Butter", qty: 8, unit: "ml" },
          { name: "Prepared Sambhar", qty: 100, unit: "ml" }, // Typical accompaniments
          { name: "Prepared Coconut Chutney", qty: 40, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 30, unit: "gm" }
        ]
      },
      {
        name: "Plain Dosa",
        category: "South Indian",
        price: 119,
        ingredients: [
          { name: "Prepared Dosa Batter", qty: 100, unit: "gm" },
          { name: "Oil / Butter", qty: 5, unit: "ml" },
          { name: "Prepared Sambhar", qty: 100, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 40, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 30, unit: "gm" }
        ]
      },
      {
        name: "Masala Dosa",
        category: "South Indian",
        price: 149,
        ingredients: [
          { name: "Prepared Dosa Batter", qty: 100, unit: "gm" },
          { name: "Prepared Aloo Masala Stuffing", qty: 120, unit: "gm" },
          { name: "Oil / Butter", qty: 5, unit: "ml" },
          { name: "Prepared Sambhar", qty: 100, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 40, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 30, unit: "gm" }
        ]
      },
      {
        name: "Butter Dosa",
        category: "South Indian",
        price: 139,
        ingredients: [
          { name: "Prepared Dosa Batter", qty: 100, unit: "gm" },
          { name: "Oil / Butter", qty: 10, unit: "ml" }, // Extra butter
          { name: "Prepared Sambhar", qty: 100, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 40, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 30, unit: "gm" }
        ]
      },
      {
        name: "Masala Uttapam",
        category: "South Indian",
        price: 159,
        ingredients: [
          { name: "Prepared Uttapam Batter", qty: 180, unit: "gm" },
          { name: "Prepared Aloo Masala Stuffing", qty: 80, unit: "gm" },
          { name: "Oil / Butter", qty: 8, unit: "ml" },
          { name: "Prepared Sambhar", qty: 100, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 40, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 30, unit: "gm" }
        ]
      },
      {
        name: "Onion Rava Dosa",
        category: "South Indian",
        price: 159,
        ingredients: [
          { name: "Prepared Rava Dosa Batter", qty: 120, unit: "gm" },
          { name: "Onion", qty: 15, unit: "gm" },
          { name: "Green Chilli", qty: 2, unit: "gm" },
          { name: "Fresh Coriander", qty: 3, unit: "gm" },
          { name: "Oil/Ghee", qty: 8, unit: "ml" },
          { name: "Prepared Sambhar", qty: 100, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 40, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 30, unit: "gm" }
        ]
      },
      {
        name: "Medu Vada (1 pc)",
        category: "South Indian",
        price: 59,
        ingredients: [
          { name: "Prepared Medu Vada Batter", qty: 70, unit: "gm" },
          { name: "Refined Frying Oil", qty: 8, unit: "ml" },
          { name: "Prepared Sambhar", qty: 120, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 50, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 40, unit: "gm" }
        ]
      },
      {
        name: "Regular Idli (1 pc)",
        category: "South Indian",
        price: 49,
        ingredients: [
          { name: "Prepared Idli Batter", qty: 50, unit: "gm" },
          { name: "Prepared Sambhar", qty: 120, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 50, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 40, unit: "gm" }
        ]
      },
      {
        name: "Mini Idli (1 pc)",
        category: "South Indian",
        price: 19,
        ingredients: [
          { name: "Prepared Idli Batter", qty: 20, unit: "gm" },
          { name: "Prepared Sambhar", qty: 50, unit: "ml" },
          { name: "Prepared Coconut Chutney", qty: 20, unit: "gm" },
          { name: "Prepared Red (Kara) Chutney", qty: 15, unit: "gm" }
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

    res.status(200).json({ message: "South Indian architecture injected successfully!" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
