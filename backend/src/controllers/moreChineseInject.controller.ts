import { Request, Response } from 'express';
import Dish from '../models/Dish';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const injectMoreChinese = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = "test_user_id"; // Same fallback as other scripts
    const User = require('../models/User').default;
    const testUser = await User.findOne();
    const activeUserId = testUser ? testUser._id : "test_user_id";

    console.log(`Injecting More Chinese architectures for user: ${activeUserId}`);

    const newRawMaterials = [
      { name: "Frozen Veg/Chicken Momos", unit: "pcs", costPerPurchaseUnit: 4, conversionFactor: 1, consumptionUnit: "pc" },
      { name: "Z-106 ARMOUR BASE", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Z-107 RUBY CONCENTRATE", unit: "L", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Mayonnaise", unit: "L", costPerPurchaseUnit: 120, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Cornflakes", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Refined Oil", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "F-302 MASTER GARLIC OIL", unit: "L", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Z-101 DARK MASTER Powder", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fresh Garlic", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fresh Ginger", unit: "kg", costPerPurchaseUnit: 180, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Water", unit: "L", costPerPurchaseUnit: 10, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Soy Sauce", unit: "L", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Red Chilli Sauce", unit: "L", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Green Chilli Sauce", unit: "L", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Vinegar", unit: "L", costPerPurchaseUnit: 60, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Tomato Ketchup", unit: "L", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Cornflour Slurry", unit: "L", costPerPurchaseUnit: 40, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Fried Protein/Balls", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Master Liquid", unit: "L", costPerPurchaseUnit: 140, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Z-102 CRYSTAL GLAZE Powder", unit: "kg", costPerPurchaseUnit: 350, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Chopped Garlic", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Capsicum Cubes", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Onion Cubes", unit: "kg", costPerPurchaseUnit: 60, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fried Protein (Paneer/Chicken/Mushroom/Soya)", unit: "kg", costPerPurchaseUnit: 300, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Master Chilli Liquid", unit: "L", costPerPurchaseUnit: 120, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Z-103 RED FIRE BATCH Powder", unit: "kg", costPerPurchaseUnit: 450, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Dark Soy Sauce", unit: "L", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Boiled Rice / Noodles", unit: "kg", costPerPurchaseUnit: 40, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Z-101 / Z-102 Master Liquid", unit: "L", costPerPurchaseUnit: 130, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Fried Protein", unit: "kg", costPerPurchaseUnit: 280, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Mixed Vegetables", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Master Schezwan Paste", unit: "L", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Z-104 VOK DUST Powder", unit: "kg", costPerPurchaseUnit: 500, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "80% Boiled Noodles/Rice", unit: "kg", costPerPurchaseUnit: 40, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Mixed Julienne Vegetables", unit: "kg", costPerPurchaseUnit: 90, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Spring Onion", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Butter", unit: "kg", costPerPurchaseUnit: 600, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fried Chicken / Scrambled Egg", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Z-104 VOK DUST", unit: "kg", costPerPurchaseUnit: 500, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Z-106 ARMOUR BASE Powder", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Egg", unit: "pcs", costPerPurchaseUnit: 6, conversionFactor: 1, consumptionUnit: "pc" },
      { name: "Chilled Water", unit: "L", costPerPurchaseUnit: 5, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Salt", unit: "kg", costPerPurchaseUnit: 30, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Ginger Garlic Paste", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "White Pepper", unit: "kg", costPerPurchaseUnit: 800, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Chicken / Paneer / Mushroom", unit: "kg", costPerPurchaseUnit: 300, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Prepared Batter", unit: "kg", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Pre-marinated Protein", unit: "kg", costPerPurchaseUnit: 320, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Refined Oil Absorption", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Z-107 RUBY CONCENTRATE Powder", unit: "kg", costPerPurchaseUnit: 450, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fresh Chopped Garlic", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
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

    const dishesToCreate = [
      {
        name: "Steamed Momos",
        category: "Chinese",
        price: 129,
        ingredients: [
          { name: "Frozen Veg/Chicken Momos", qty: 6, unit: "pcs" },
          { name: "Prepared Momo Chutney", qty: 30, unit: "ml" },
          { name: "F-302 MASTER GARLIC OIL", qty: 2.5, unit: "ml" }
        ]
      },
      {
        name: "Fried Momos",
        category: "Chinese",
        price: 149,
        ingredients: [
          { name: "Frozen Veg/Chicken Momos", qty: 6, unit: "pcs" },
          { name: "Prepared Momo Chutney", qty: 30, unit: "ml" },
          { name: "Mayonnaise", qty: 20, unit: "ml" }
        ]
      },
      {
        name: "Kurkure Momos",
        category: "Chinese",
        price: 179,
        ingredients: [
          { name: "Frozen Veg/Chicken Momos", qty: 6, unit: "pcs" },
          { name: "Prepared Batter", qty: 25, unit: "gm" }, // Z-106
          { name: "Cornflakes", qty: 20, unit: "gm" },
          { name: "Prepared Momo Chutney", qty: 30, unit: "ml" }
        ]
      },
      {
        name: "UNIVERSAL MANCHURIAN (Dry)",
        category: "Chinese",
        price: 199,
        ingredients: [
          { name: "Master Liquid", qty: 100, unit: "ml" },
          { name: "Cornflour Slurry", qty: 15, unit: "ml" },
          { name: "Fried Protein/Balls", qty: 180, unit: "gm" }
        ]
      },
      {
        name: "UNIVERSAL MANCHURIAN (Gravy)",
        category: "Chinese",
        price: 219,
        ingredients: [
          { name: "Master Liquid", qty: 275, unit: "ml" },
          { name: "Cornflour Slurry", qty: 45, unit: "ml" },
          { name: "Fried Protein/Balls", qty: 180, unit: "gm" }
        ]
      },
      {
        name: "UNIVERSAL CHILLI (Dry)",
        category: "Chinese",
        price: 229,
        ingredients: [
          { name: "Master Chilli Liquid", qty: 100, unit: "ml" },
          { name: "Cornflour Slurry", qty: 15, unit: "ml" },
          { name: "Fried Protein (Paneer/Chicken/Mushroom/Soya)", qty: 180, unit: "gm" },
          { name: "Capsicum Cubes", qty: 50, unit: "gm" },
          { name: "Onion Cubes", qty: 50, unit: "gm" },
          { name: "Refined Oil", qty: 10, unit: "ml" }
        ]
      },
      {
        name: "UNIVERSAL CHILLI (Gravy)",
        category: "Chinese",
        price: 249,
        ingredients: [
          { name: "Master Chilli Liquid", qty: 300, unit: "ml" },
          { name: "Cornflour Slurry", qty: 30, unit: "ml" },
          { name: "Fried Protein (Paneer/Chicken/Mushroom/Soya)", qty: 180, unit: "gm" },
          { name: "Capsicum Cubes", qty: 50, unit: "gm" },
          { name: "Onion Cubes", qty: 50, unit: "gm" },
          { name: "Refined Oil", qty: 10, unit: "ml" }
        ]
      },
      {
        name: "SCHEZWAN RICE / NOODLES",
        category: "Chinese",
        price: 189,
        ingredients: [
          { name: "Boiled Rice / Noodles", qty: 200, unit: "gm" },
          { name: "Master Schezwan Paste", qty: 15, unit: "ml" },
          { name: "Mixed Vegetables", qty: 60, unit: "gm" },
          { name: "Refined Oil", qty: 15, unit: "ml" }
        ]
      },
      {
        name: "SCHEZWAN GRAVY",
        category: "Chinese",
        price: 229,
        ingredients: [
          { name: "Z-101 / Z-102 Master Liquid", qty: 250, unit: "ml" },
          { name: "Master Schezwan Paste", qty: 15, unit: "ml" },
          { name: "Cornflour Slurry", qty: 30, unit: "ml" },
          { name: "Fried Protein", qty: 180, unit: "gm" }
        ]
      },
      {
        name: "HAKKA NOODLES / FRIED RICE",
        category: "Chinese",
        price: 179,
        ingredients: [
          { name: "80% Boiled Noodles/Rice", qty: 200, unit: "gm" },
          { name: "Mixed Julienne Vegetables", qty: 60, unit: "gm" },
          { name: "Chopped Garlic", qty: 5, unit: "gm" },
          { name: "Z-104 VOK DUST", qty: 5, unit: "gm" },
          { name: "Vinegar", qty: 5, unit: "ml" },
          { name: "Refined Oil", qty: 15, unit: "ml" },
          { name: "Butter", qty: 5, unit: "gm" },
          { name: "Spring Onion", qty: 5, unit: "gm" },
          { name: "Fried Chicken / Scrambled Egg", qty: 60, unit: "gm" }
        ]
      },
      {
        name: "UNIVERSAL CRISPY FRY",
        category: "Chinese",
        price: 239,
        ingredients: [
          { name: "Pre-marinated Protein", qty: 180, unit: "gm" },
          { name: "Prepared Batter", qty: 60, unit: "gm" },
          { name: "Refined Oil Absorption", qty: 10, unit: "ml" }
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
    
    // SFGs
    const sfgs = [
      {
        name: "Prepared Momo Chutney",
        category: "Chinese Component",
        batchYield: 1000,
        yieldUnit: "ml",
        ingredients: [
          { name: "Z-107 RUBY CONCENTRATE Powder", qty: 250, unit: "gm" }, // assumption
          { name: "Water", qty: 750, unit: "ml" },
          { name: "Refined Oil", qty: 50, unit: "ml" },
          { name: "Fresh Chopped Garlic", qty: 20, unit: "gm" }
        ]
      },
      {
        name: "Prepared Batter",
        category: "Chinese Component",
        batchYield: 1000,
        yieldUnit: "gm",
        ingredients: [
          { name: "Z-106 ARMOUR BASE Powder", qty: 400, unit: "gm" },
          { name: "Egg", qty: 2, unit: "pcs" },
          { name: "Chilled Water", qty: 500, unit: "ml" },
          { name: "Salt", qty: 10, unit: "gm" },
          { name: "Ginger Garlic Paste", qty: 20, unit: "gm" },
          { name: "White Pepper", qty: 5, unit: "gm" },
          { name: "Vinegar", qty: 10, unit: "ml" }
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

    res.status(200).json({ message: "More Chinese architectures injected successfully!" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
