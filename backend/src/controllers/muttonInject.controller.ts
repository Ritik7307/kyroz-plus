import { Request, Response } from 'express';
import Dish from '../models/Dish';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const debugInjectMuttonDishes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = "test_user_id"; // For debugging/injection, we can use a fixed ID or let the frontend pass it. Since it's debug, let's look up an existing user.
    const User = require('../models/User').default;
    const testUser = await User.findOne();
    const activeUserId = testUser ? testUser._id : "test_user_id";

    console.log(`Injecting Mutton/Musallam/Saagwala dishes for user: ${activeUserId}`);

    const newRawMaterials = [
      { name: "Pre-cooked Tandoori Chicken", unit: "kg", costPerPurchaseUnit: 350, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Pre-cooked Chicken Keema", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Chicken Stock", unit: "L", costPerPurchaseUnit: 50, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Saffron Milk", unit: "L", costPerPurchaseUnit: 800, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Boiled Egg", unit: "pcs", costPerPurchaseUnit: 10, conversionFactor: 1, consumptionUnit: "pc" },
      { name: "Dry Fruits", unit: "kg", costPerPurchaseUnit: 800, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Egg Omelette", unit: "pcs", costPerPurchaseUnit: 15, conversionFactor: 1, consumptionUnit: "pc" },
      
      { name: "Pre-cooked Mutton", unit: "kg", costPerPurchaseUnit: 700, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Whole Spices", unit: "kg", costPerPurchaseUnit: 600, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Mutton Stock", unit: "L", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Rich Mutton Stock", unit: "L", costPerPurchaseUnit: 150, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Cinnamon", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Jeera", unit: "kg", costPerPurchaseUnit: 350, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Whole Red Chilli", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "pcs" },
      { name: "Bay Leaf", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "pcs" },
      { name: "Fine Chopped Onion", unit: "kg", costPerPurchaseUnit: 40, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fine Chopped Tomato", unit: "kg", costPerPurchaseUnit: 50, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Mustard Oil", unit: "L", costPerPurchaseUnit: 180, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Black Cardamom", unit: "kg", costPerPurchaseUnit: 1500, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Dry Ginger Powder", unit: "kg", costPerPurchaseUnit: 400, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fennel Powder", unit: "kg", costPerPurchaseUnit: 300, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Kewra Water", unit: "L", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "ml" },
      { name: "Ratan Jot Oil", unit: "L", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "ml" },
      
      { name: "Blanched Mix Veg / Pre-cooked Chicken Tikka", unit: "kg", costPerPurchaseUnit: 350, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Capsicum Cubes", unit: "kg", costPerPurchaseUnit: 80, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Onion Cubes", unit: "kg", costPerPurchaseUnit: 60, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "White Pepper", unit: "kg", costPerPurchaseUnit: 600, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Birista", unit: "kg", costPerPurchaseUnit: 200, conversionFactor: 1000, consumptionUnit: "gm" },
      { name: "Fried Cashew", unit: "kg", costPerPurchaseUnit: 1000, conversionFactor: 1000, consumptionUnit: "gm" },
      
      { name: "Whole Dry Red Chilli", unit: "kg", costPerPurchaseUnit: 250, conversionFactor: 1000, consumptionUnit: "pcs" },
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
    
    // Fetch existing standard RM/SFG
    const getDoc = async (model: any, name: string) => {
      return await model.findOne({ name, userId: activeUserId });
    };

    const g201 = await getDoc(SemiFinishedGood, "G-201 SUNSET BASE") || await getDoc(RawMaterial, "G-201 SUNSET BASE") || rmMap["G-201 SUNSET BASE"];
    const g202 = await getDoc(SemiFinishedGood, "G-202 IVORY BASE") || await getDoc(RawMaterial, "G-202 IVORY BASE") || rmMap["G-202 IVORY BASE"];
    const g203 = await getDoc(SemiFinishedGood, "G-203 EMERALD MIX") || await getDoc(RawMaterial, "G-203 EMERALD MIX") || rmMap["G-203 EMERALD MIX"];
    const g204 = await getDoc(SemiFinishedGood, "G-204 ROASTED RUST") || await getDoc(RawMaterial, "G-204 ROASTED RUST") || rmMap["G-204 ROASTED RUST"];
    const g205 = await getDoc(SemiFinishedGood, "G-205 ROYAL ROGAN") || await getDoc(RawMaterial, "G-205 ROYAL ROGAN") || rmMap["G-205 ROYAL ROGAN"];
    
    // Helper to get ingredient
    const getIng = async (name: string) => {
        let doc = rmMap[name];
        if (doc) return doc;
        doc = await getDoc(SemiFinishedGood, name);
        if (doc) return doc;
        doc = await getDoc(RawMaterial, name);
        if (doc) return doc;
        // Mock it if not found
        doc = new RawMaterial({ name, unit: "kg", costPerPurchaseUnit: 100, conversionFactor: 1000, consumptionUnit: "gm", userId: activeUserId });
        await doc.save();
        rmMap[name] = doc;
        return doc;
    };

    const dishesToCreate = [
      {
        name: "MURG MUSALLAM (300 g Serving)",
        category: "Indian Main Course",
        price: 499,
        ingredients: [
          { name: "G-201 SUNSET BASE", qty: 80, unit: "gm" },
          { name: "G-202 IVORY BASE", qty: 60, unit: "gm" },
          { name: "G-205 ROYAL ROGAN", qty: 60, unit: "gm" },
          { name: "Pre-cooked Tandoori Chicken", qty: 200, unit: "gm" },
          { name: "Pre-cooked Chicken Keema", qty: 50, unit: "gm" },
          { name: "Butter", qty: 15, unit: "gm" },
          { name: "Desi Ghee", qty: 5, unit: "gm" },
          { name: "Chicken Stock", qty: 50, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Fresh Cream", qty: 15, unit: "ml" },
          { name: "Kasoori Methi", qty: 1, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 1, unit: "gm" },
          { name: "Kashmiri Chilli", qty: 1, unit: "gm" },
          { name: "Cardamom Powder", qty: 0.5, unit: "gm" },
          { name: "Saffron Milk", qty: 5, unit: "ml" },
          { name: "Boiled Egg", qty: 1, unit: "pc" },
          { name: "Dry Fruits", qty: 5, unit: "gm" },
          { name: "Ginger Juliennes", qty: 3, unit: "gm" }
        ]
      },
      {
        name: "MURG PATIALA (300 g Serving)",
        category: "Indian Main Course",
        price: 399,
        ingredients: [
          { name: "G-202 IVORY BASE", qty: 120, unit: "gm" },
          { name: "G-205 ROYAL ROGAN", qty: 80, unit: "gm" },
          { name: "Pre-cooked Chicken", qty: 200, unit: "gm" },
          { name: "Egg Omelette", qty: 1, unit: "pc" },
          { name: "Desi Ghee", qty: 15, unit: "gm" },
          { name: "Refined Oil", qty: 3, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Green Chilli", qty: 2, unit: "gm" },
          { name: "Ginger Juliennes", qty: 3, unit: "gm" },
          { name: "Curd", qty: 15, unit: "gm" },
          { name: "Fresh Cream", qty: 15, unit: "ml" },
          { name: "Kasoori Methi", qty: 1, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 0.5, unit: "gm" },
          { name: "K-802 WOK SPICE", qty: 0.5, unit: "gm" },
          { name: "Chicken Stock", qty: 45, unit: "ml" }
        ]
      },
      {
        name: "MUTTON BHUNA GOSHT (300 g Serving)",
        category: "Indian Main Course",
        price: 499,
        ingredients: [
          { name: "G-205 ROYAL ROGAN", qty: 140, unit: "gm" },
          { name: "G-204 ROASTED RUST", qty: 60, unit: "gm" },
          { name: "Pre-cooked Mutton", qty: 200, unit: "gm" },
          { name: "Desi Ghee", qty: 20, unit: "gm" },
          { name: "Refined Oil", qty: 5, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Green Chilli", qty: 2, unit: "gm" },
          { name: "Whole Spices", qty: 2, unit: "gm" },
          { name: "Curd", qty: 15, unit: "gm" },
          { name: "Kasoori Methi", qty: 1, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 1, unit: "gm" },
          { name: "K-802 WOK SPICE", qty: 1, unit: "gm" },
          { name: "Kashmiri Chilli", qty: 1, unit: "gm" },
          { name: "Mutton Stock", qty: 40, unit: "ml" },
          { name: "Fresh Coriander", qty: 3, unit: "gm" },
          { name: "Ginger Juliennes", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "MUTTON CURRY (300 g Serving)",
        category: "Indian Main Course",
        price: 450,
        ingredients: [
          { name: "G-205 ROYAL ROGAN", qty: 200, unit: "gm" },
          { name: "Pre-cooked Mutton", qty: 200, unit: "gm" },
          { name: "Rich Mutton Stock", qty: 60, unit: "ml" },
          { name: "Desi Ghee", qty: 15, unit: "gm" },
          { name: "Refined Oil", qty: 3, unit: "ml" },
          { name: "Cinnamon", qty: 2, unit: "gm" },
          { name: "Green Cardamom", qty: 2, unit: "pcs" },
          { name: "Jeera", qty: 1, unit: "gm" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Green Chilli", qty: 2, unit: "gm" },
          { name: "Kashmiri Chilli", qty: 1, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 1, unit: "gm" },
          { name: "Kasoori Methi", qty: 1, unit: "gm" },
          { name: "Fresh Coriander", qty: 3, unit: "gm" },
          { name: "Ginger Juliennes", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "MUTTON HANDI (300 g Serving)",
        category: "Indian Main Course",
        price: 499,
        ingredients: [
          { name: "G-205 ROYAL ROGAN", qty: 120, unit: "gm" },
          { name: "G-204 ROASTED RUST", qty: 40, unit: "gm" },
          { name: "G-201 SUNSET BASE", qty: 40, unit: "gm" },
          { name: "Pre-cooked Mutton", qty: 200, unit: "gm" },
          { name: "Desi Ghee", qty: 20, unit: "gm" },
          { name: "Refined Oil", qty: 3, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Whole Red Chilli", qty: 2, unit: "pcs" },
          { name: "Bay Leaf", qty: 1, unit: "pc" },
          { name: "Green Cardamom", qty: 2, unit: "pcs" },
          { name: "Fine Chopped Onion", qty: 20, unit: "gm" },
          { name: "Fine Chopped Tomato", qty: 20, unit: "gm" },
          { name: "Curd", qty: 15, unit: "gm" },
          { name: "Fresh Cream", qty: 5, unit: "ml" },
          { name: "Coriander Powder", qty: 2, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 1, unit: "gm" },
          { name: "Kashmiri Chilli", qty: 1, unit: "gm" },
          { name: "Kasoori Methi", qty: 1, unit: "gm" },
          { name: "Mutton Stock", qty: 50, unit: "ml" },
          { name: "Fresh Coriander", qty: 3, unit: "gm" },
          { name: "Ginger Juliennes", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "MUTTON ROGAN JOSH (300 g Serving)",
        category: "Indian Main Course",
        price: 520,
        ingredients: [
          { name: "G-205 ROYAL ROGAN", qty: 160, unit: "gm" },
          { name: "G-201 SUNSET BASE", qty: 40, unit: "gm" },
          { name: "Pre-cooked Mutton", qty: 200, unit: "gm" },
          { name: "Desi Ghee", qty: 20, unit: "gm" },
          { name: "Mustard Oil", qty: 5, unit: "ml" },
          { name: "Mutton Stock", qty: 50, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Green Cardamom", qty: 2, unit: "pcs" },
          { name: "Black Cardamom", qty: 1, unit: "pc" },
          { name: "Cinnamon", qty: 2, unit: "gm" },
          { name: "Curd", qty: 30, unit: "gm" },
          { name: "Kashmiri Chilli", qty: 2, unit: "gm" },
          { name: "Dry Ginger Powder", qty: 1, unit: "gm" },
          { name: "Fennel Powder", qty: 1, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 1, unit: "gm" },
          { name: "Kewra Water", qty: 2, unit: "ml" },
          { name: "Ratan Jot Oil", qty: 2, unit: "ml" },
          { name: "Fresh Coriander", qty: 3, unit: "gm" },
          { name: "Ginger Juliennes", qty: 5, unit: "gm" }
        ]
      },
      {
        name: "NIZAMI HANDI (Veg / Chicken) (300 g Serving)",
        category: "Indian Main Course",
        price: 420,
        ingredients: [
          { name: "G-202 IVORY BASE", qty: 100, unit: "gm" },
          { name: "G-203 EMERALD MIX", qty: 60, unit: "gm" },
          { name: "G-201 SUNSET BASE", qty: 40, unit: "gm" },
          { name: "Blanched Mix Veg / Pre-cooked Chicken Tikka", qty: 200, unit: "gm" },
          { name: "Capsicum Cubes", qty: 20, unit: "gm" },
          { name: "Onion Cubes", qty: 20, unit: "gm" },
          { name: "Desi Ghee", qty: 15, unit: "gm" },
          { name: "Refined Oil", qty: 3, unit: "ml" },
          { name: "Milk", qty: 40, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Green Chilli", qty: 2, unit: "gm" },
          { name: "Shahi Jeera", qty: 1, unit: "gm" },
          { name: "White Pepper", qty: 0.5, unit: "gm" },
          { name: "Cardamom Powder", qty: 0.5, unit: "gm" },
          { name: "Fresh Cream", qty: 15, unit: "ml" },
          { name: "Kasoori Methi", qty: 1, unit: "gm" },
          { name: "Birista", qty: 5, unit: "gm" },
          { name: "Fried Cashew", qty: 5, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 1, unit: "gm" },
          { name: "K-806 ZESTFUL ZING", qty: 0.5, unit: "gm" }
        ]
      },
      {
        name: "SAAGWALA MEAT (Chicken / Mutton) (300 g Serving)",
        category: "Indian Main Course",
        price: 450,
        ingredients: [
          { name: "G-203 EMERALD MIX", qty: 140, unit: "gm" },
          { name: "G-205 ROYAL ROGAN", qty: 60, unit: "gm" },
          { name: "Pre-cooked Chicken/Mutton", qty: 200, unit: "gm" },
          { name: "Desi Ghee", qty: 15, unit: "gm" },
          { name: "Refined Oil", qty: 3, unit: "ml" },
          { name: "Meat Stock", qty: 45, unit: "ml" },
          { name: "Ginger Garlic Paste", qty: 3, unit: "gm" },
          { name: "Chopped Garlic", qty: 5, unit: "gm" },
          { name: "Green Chilli", qty: 2, unit: "gm" },
          { name: "Kashmiri Chilli", qty: 1, unit: "gm" },
          { name: "K-801 ROYAL PUNCH", qty: 1, unit: "gm" },
          { name: "Curd", qty: 15, unit: "gm" }, // Replacing Curd / Fresh Cream with Curd
          { name: "Butter", qty: 10, unit: "gm" },
          { name: "Kasoori Methi", qty: 1, unit: "gm" },
          { name: "Ginger Juliennes", qty: 5, unit: "gm" },
          { name: "Whole Dry Red Chilli", qty: 1, unit: "pc" }
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
      const mappedIngredients = [];
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

    res.status(200).json({ message: "Mutton/Musallam dishes injected successfully!" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
