import mongoose from 'mongoose';
import RawMaterial from '../models/RawMaterial';
import PreparationMaster from '../models/PreparationMaster';
import SemiFinishedGood from '../models/SemiFinishedGood';
import PortionMaster from '../models/PortionMaster';
import Packaging from '../models/Packaging';
import Dish from '../models/Dish';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const seedBlueprints = async (userId: string | mongoose.Types.ObjectId): Promise<void> => {
  await RawMaterial.deleteMany({ userId });
  await PreparationMaster.deleteMany({ userId });
  await SemiFinishedGood.deleteMany({ userId });
  await PortionMaster.deleteMany({ userId });
  await Packaging.deleteMany({ userId });
  await Dish.deleteMany({ userId });
  await Recipe.deleteMany({ userId });
  await Inventory.deleteMany({ userId });

  const rmData = [
    { code: 'RM_G205', name: 'G-205 ROYAL ROGAN', category: 'Gravy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_PRE_FRIED_POTATO', name: 'Pre-fried Potato Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'RM_PRE_FRIED_CAULIFLOWER', name: 'Pre-fried Cauliflower Florets', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_BOILED_GREEN_PEAS', name: 'Boiled Green Peas', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_REFINED_OIL', name: 'Refined Oil', category: 'Grocery', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_DESI_GHEE', name: 'Desi Ghee', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_HOT_WATER', name: 'Hot Water', category: 'Misc', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'RM_JEERA', name: 'Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_HING', name: 'Hing', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'RM_GINGER_GARLIC_PASTE', name: 'Ginger Garlic Paste', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_GREEN_CHILLI', name: 'Green Chilli', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_KASHMIRI_CHILLI', name: 'Kashmiri Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_K801', name: 'K-801 ROYAL PUNCH', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_K806', name: 'K-806 ZESTFUL ZING', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_KASOORI_METHI', name: 'Kasoori Methi', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_CRUSHED_BLACK_PEPPER', name: 'Crushed Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'RM_FRESH_CORIANDER', name: 'Fresh Coriander', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_GINGER_JULIENNES', name: 'Ginger Juliennes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_G203', name: 'G-203 EMERALD MIX', category: 'Gravy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_G202', name: 'G-202 IVORY BASE', category: 'Gravy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 140 },
    { code: 'RM_BOILED_SWEET_CORN', name: 'Boiled Sweet Corn', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_PANEER_CUBES', name: 'Paneer Cubes', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_PROCESSED_CHEESE', name: 'Processed Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_BUTTER', name: 'Butter', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_FRESH_CREAM', name: 'Fresh Cream', category: 'Dairy', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'RM_MILK', name: 'Milk', category: 'Dairy', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 55 },
    { code: 'RM_SUGAR', name: 'Sugar', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 45 },
    { code: 'RM_G204', name: 'G-204 ROASTED RUST', category: 'Gravy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CAPSICUM_CUBES', name: 'Capsicum Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_ONION_CUBES', name: 'Onion Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 35 },
    { code: 'RM_CAPSICUM_ONION_STOCK', name: 'Capsicum/Onion Stock', category: 'Misc', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'RM_DRY_RED_CHILLI', name: 'Dry Red Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 500, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_CURD', name: 'Curd', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 70 },
    { code: 'RM_K802', name: 'K-802 WOK SPICE', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_GRATED_PANEER', name: 'Grated Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_CHOPPED_GARLIC', name: 'Chopped Garlic', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_SALT', name: 'Salt', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'RM_GOLDEN_GARLIC_TOPPING', name: 'Golden Garlic Topping', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_FRIED_KOFTA', name: 'Premium Fried Stuffed Paneer & Khoya Kofta', category: 'SFG', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 18 },
    { code: 'RM_GREEN_CARDAMOM', name: 'Green Cardamom', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 2500 },
    { code: 'RM_MACE', name: 'Mace', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 3000 },
    { code: 'RM_CARDAMOM_POWDER', name: 'Cardamom Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 2600 },
    { code: 'RM_ALMOND_FLAKES', name: 'Almond Flakes', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 1200 },
    { code: 'RM_GRATED_KHOYA', name: 'Grated Khoya/Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_G201', name: 'G-201 SUNSET BASE', category: 'Gravy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 170 },
    { code: 'RM_MUSHROOM', name: 'Mushroom', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_JULIENNE_VEG', name: 'Mixed Julienne Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_PINEAPPLE_PIECES', name: 'Pineapple Pieces', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 }
  ];

  const rmIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const rm of rmData) {
    const createdRm = await RawMaterial.create({ ...rm, userId });
    rmIds[rm.code] = createdRm._id as mongoose.Types.ObjectId;
  }

  const sfgData = [
    { code: 'SFG_G205', name: 'G-205 ROYAL ROGAN', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_PRE_FRIED_POTATO', name: 'Pre-fried Potato', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_PRE_FRIED_CAULIFLOWER', name: 'Pre-fried Cauliflower', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_BOILED_GREEN_PEAS', name: 'Boiled Green Peas', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_G203', name: 'G-203 EMERALD MIX', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.14 },
    { code: 'SFG_G202', name: 'G-202 IVORY BASE', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.16 },
    { code: 'SFG_G204', name: 'G-204 ROASTED RUST', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.18 },
    { code: 'SFG_G201', name: 'G-201 SUNSET BASE', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.17 },
  ];

  const sfgIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const sfg of sfgData) {
    const createdSfg = await SemiFinishedGood.create({ ...sfg, userId });
    sfgIds[sfg.code] = createdSfg._id as mongoose.Types.ObjectId;
  }

  for (const sfg of sfgData) {
    const rmCode = 'RM_' + sfg.code.replace('SFG_', '');
    if (rmIds[rmCode]) {
      await Recipe.create({
        targetModel: 'SemiFinishedGood',
        targetId: sfgIds[sfg.code],
        ingredients: [
          { itemModel: 'RawMaterial', itemId: rmIds[rmCode], quantity: sfg.batchYield }
        ],
        yieldAmount: sfg.batchYield,
        userId
      });
    }
  }

  const portionData = [
    {
      code: 'PT_ALOO_GOBHI_MATAR',
      name: 'Aloo Gobhi Matar Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G205'], quantity: 150, unit: 'gm' },
        { sfgId: sfgIds['SFG_PRE_FRIED_POTATO'], quantity: 80, unit: 'gm' },
        { sfgId: sfgIds['SFG_PRE_FRIED_CAULIFLOWER'], quantity: 80, unit: 'gm' },
        { sfgId: sfgIds['SFG_BOILED_GREEN_PEAS'], quantity: 40, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_DESI_GHEE'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_HOT_WATER'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['RM_JEERA'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_HING'], quantity: 0.2, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GREEN_CHILLI'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_KASHMIRI_CHILLI'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K806'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_CRUSHED_BLACK_PEPPER'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_FRESH_CORIANDER'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_JULIENNES'], quantity: 5, unit: 'gm' },
      ]
    },
    {
      code: 'PT_CORN_PALAK_CHEESE',
      name: 'Corn Palak Cheese Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G203'], quantity: 140, unit: 'gm' },
        { sfgId: sfgIds['SFG_G202'], quantity: 60, unit: 'gm' },
        { sfgId: rmIds['RM_BOILED_SWEET_CORN'], quantity: 40, unit: 'gm' },
        { sfgId: rmIds['RM_PANEER_CUBES'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['RM_PROCESSED_CHEESE'], quantity: 20, unit: 'gm' },
        { sfgId: rmIds['RM_BUTTER'], quantity: 15, unit: 'gm' },
        { sfgId: rmIds['RM_MILK'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['RM_FRESH_CREAM'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_GREEN_CHILLI'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K806'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_SUGAR'], quantity: 1, unit: 'gm' },
      ]
    },
    {
      code: 'PT_KADHAI_PANEER',
      name: 'Kadhai Paneer Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G204'], quantity: 200, unit: 'gm' },
        { sfgId: rmIds['RM_PANEER_CUBES'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['RM_CAPSICUM_CUBES'], quantity: 20, unit: 'gm' },
        { sfgId: rmIds['RM_ONION_CUBES'], quantity: 20, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_DESI_GHEE'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_CAPSICUM_ONION_STOCK'], quantity: 40, unit: 'ml' },
        { sfgId: rmIds['RM_DRY_RED_CHILLI'], quantity: 2, unit: 'pcs' },
        { sfgId: rmIds['RM_JEERA'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_CURD'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_KASHMIRI_CHILLI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K802'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_CRUSHED_BLACK_PEPPER'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_GREEN_CHILLI'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_JULIENNES'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_FRESH_CORIANDER'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GRATED_PANEER'], quantity: 5, unit: 'gm' },
      ]
    },
    {
      code: 'PT_LEHSUNIA_PANEER',
      name: 'Lehsunia Paneer Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G203'], quantity: 160, unit: 'gm' },
        { sfgId: sfgIds['SFG_G202'], quantity: 40, unit: 'gm' },
        { sfgId: rmIds['RM_PANEER_CUBES'], quantity: 150, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 10, unit: 'ml' },
        { sfgId: rmIds['RM_DESI_GHEE'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_CHOPPED_GARLIC'], quantity: 20, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GREEN_CHILLI'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_HOT_WATER'], quantity: 35, unit: 'ml' },
        { sfgId: rmIds['RM_FRESH_CREAM'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K806'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_SALT'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_GOLDEN_GARLIC_TOPPING'], quantity: 10, unit: 'gm' },
      ]
    },
    {
      code: 'PT_MALAI_KOFTA_IVORY',
      name: 'Malai Kofta (Ivory) Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G202'], quantity: 200, unit: 'gm' },
        { sfgId: rmIds['RM_FRIED_KOFTA'], quantity: 4, unit: 'pcs' },
        { sfgId: rmIds['RM_DESI_GHEE'], quantity: 15, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 3, unit: 'ml' },
        { sfgId: rmIds['RM_MILK'], quantity: 40, unit: 'ml' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GREEN_CARDAMOM'], quantity: 2, unit: 'pcs' },
        { sfgId: rmIds['RM_MACE'], quantity: 0.25, unit: 'gm' },
        { sfgId: rmIds['RM_FRESH_CREAM'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_SUGAR'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K806'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_CARDAMOM_POWDER'], quantity: 0.25, unit: 'gm' },
        { sfgId: rmIds['RM_ALMOND_FLAKES'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GRATED_KHOYA'], quantity: 5, unit: 'gm' },
      ]
    },
    {
      code: 'PT_MALAI_KOFTA_RED',
      name: 'Malai Kofta Red Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G201'], quantity: 120, unit: 'gm' },
        { sfgId: sfgIds['SFG_G202'], quantity: 80, unit: 'gm' },
        { sfgId: rmIds['RM_FRIED_KOFTA'], quantity: 2, unit: 'pcs' },
        { sfgId: rmIds['RM_BUTTER'], quantity: 15, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 3, unit: 'ml' },
        { sfgId: rmIds['RM_HOT_WATER'], quantity: 45, unit: 'ml' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_FRESH_CREAM'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_KASHMIRI_CHILLI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K806'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_SUGAR'], quantity: 2, unit: 'gm' },
      ]
    },
    {
      code: 'PT_MUSHROOM_DO_PYAZA',
      name: 'Mushroom Do Pyaza Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G205'], quantity: 150, unit: 'gm' },
        { sfgId: rmIds['RM_MUSHROOM'], quantity: 150, unit: 'gm' },
        { sfgId: rmIds['RM_ONION_CUBES'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_DESI_GHEE'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_HOT_WATER'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['RM_JEERA'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GREEN_CHILLI'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_KASHMIRI_CHILLI'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K802'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_CRUSHED_BLACK_PEPPER'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_FRESH_CORIANDER'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_JULIENNES'], quantity: 5, unit: 'gm' }
      ]
    },
    {
      code: 'PT_NAVRATAN_KORMA',
      name: 'Navratan Korma Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G202'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['RM_JULIENNE_VEG'], quantity: 100, unit: 'gm' },
        { sfgId: rmIds['RM_PINEAPPLE_PIECES'], quantity: 20, unit: 'gm' },
        { sfgId: rmIds['RM_PANEER_CUBES'], quantity: 30, unit: 'gm' },
        { sfgId: rmIds['RM_BUTTER'], quantity: 15, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 3, unit: 'ml' },
        { sfgId: rmIds['RM_MILK'], quantity: 40, unit: 'ml' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_FRESH_CREAM'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_SUGAR'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_CARDAMOM_POWDER'], quantity: 0.25, unit: 'gm' },
        { sfgId: rmIds['RM_ALMOND_FLAKES'], quantity: 5, unit: 'gm' }
      ]
    },
    {
      code: 'PT_PALAK_PANEER',
      name: 'Palak Paneer Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G203'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['RM_PANEER_CUBES'], quantity: 150, unit: 'gm' },
        { sfgId: rmIds['RM_BUTTER'], quantity: 15, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 5, unit: 'ml' },
        { sfgId: rmIds['RM_CHOPPED_GARLIC'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['RM_GREEN_CHILLI'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_HOT_WATER'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['RM_FRESH_CREAM'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_K806'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_SALT'], quantity: 1, unit: 'gm' }
      ]
    },
    {
      code: 'PT_PANEER_BUTTER_MASALA',
      name: 'Paneer Butter Masala Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['SFG_G201'], quantity: 160, unit: 'gm' },
        { sfgId: rmIds['RM_PANEER_CUBES'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['RM_BUTTER'], quantity: 20, unit: 'gm' },
        { sfgId: rmIds['RM_REFINED_OIL'], quantity: 5, unit: 'ml' },
        { sfgId: rmIds['RM_HOT_WATER'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['RM_GINGER_GARLIC_PASTE'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['RM_FRESH_CREAM'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['RM_KASOORI_METHI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_KASHMIRI_CHILLI'], quantity: 1, unit: 'gm' },
        { sfgId: rmIds['RM_K801'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['RM_SUGAR'], quantity: 2, unit: 'gm' }
      ]
    }
  ];

  const portionIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const portion of portionData) {
    const createdPortion = await PortionMaster.create({ ...portion, userId });
    portionIds[portion.code] = createdPortion._id as mongoose.Types.ObjectId;
  }

  const pkgData = [
    { code: 'PKG_FLAT_CERAMIC_PLATE', name: 'Flat Ceramic Plate / Oval Veg Dish', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_TAKEAWAY_CONTAINER', name: 'Takeaway Container', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'PKG_CARRY_BAG', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    { code: 'PKG_500ML_BOWL', name: '500 ml Bowl', unit: 'pc', currentStock: 500, costPerUnit: 4 },
    { code: 'PKG_LID', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 1 },
    { code: 'PKG_COPPER_KADHAI', name: 'Copper Kadhai / Ceramic Handi', unit: 'pc', currentStock: 500, costPerUnit: 20 },
    { code: 'PKG_PREMIUM_BOWL', name: 'Premium Deep Bowl/Handi', unit: 'pc', currentStock: 500, costPerUnit: 25 },
  ];

  const pkgIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const pkg of pkgData) {
    const createdPkg = await Packaging.create({ ...pkg, userId });
    pkgIds[pkg.code] = createdPkg._id as mongoose.Types.ObjectId;
  }

  const dishData = [
    { name: 'Aloo Gobhi Matar (Semi-Gravy)', category: 'Indian Veg', price: 249, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_FLAT_CERAMIC_PLATE']] } },
    { name: 'Corn Palak Cheese', category: 'Indian Veg', price: 279, packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_500ML_BOWL']] } },
    { name: 'Kadhai Paneer', category: 'Indian Veg', price: 299, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Lehsunia Paneer', category: 'Indian Veg', price: 289, packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_500ML_BOWL']] } },
    { name: 'Malai Kofta (Ivory)', category: 'Indian Veg', price: 319, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_BOWL']] } },
    { name: 'Malai Kofta Red', category: 'Indian Veg', price: 319, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_BOWL']] } },
    { name: 'Mushroom Do Pyaza', category: 'Indian Veg', price: 289, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Navratan Korma', category: 'Indian Veg', price: 329, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_BOWL']] } },
    { name: 'Palak Paneer', category: 'Indian Veg', price: 289, packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_500ML_BOWL']] } },
    { name: 'Paneer Butter Masala', category: 'Indian Veg', price: 299, packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } }
  ];

  const dishIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const dish of dishData) {
    const createdDish = await Dish.create({ ...dish, userId });
    dishIds[dish.name] = createdDish._id as mongoose.Types.ObjectId;
  }

  const dishRecipeMappings: Record<string, { itemModel: string, code: string, quantity: number }[]> = {
    'Aloo Gobhi Matar (Semi-Gravy)': [{ itemModel: 'PortionMaster', code: 'PT_ALOO_GOBHI_MATAR', quantity: 1 }],
    'Corn Palak Cheese': [{ itemModel: 'PortionMaster', code: 'PT_CORN_PALAK_CHEESE', quantity: 1 }],
    'Kadhai Paneer': [{ itemModel: 'PortionMaster', code: 'PT_KADHAI_PANEER', quantity: 1 }],
    'Lehsunia Paneer': [{ itemModel: 'PortionMaster', code: 'PT_LEHSUNIA_PANEER', quantity: 1 }],
    'Malai Kofta (Ivory)': [{ itemModel: 'PortionMaster', code: 'PT_MALAI_KOFTA_IVORY', quantity: 1 }],
    'Malai Kofta Red': [{ itemModel: 'PortionMaster', code: 'PT_MALAI_KOFTA_RED', quantity: 1 }],
    'Mushroom Do Pyaza': [{ itemModel: 'PortionMaster', code: 'PT_MUSHROOM_DO_PYAZA', quantity: 1 }],
    'Navratan Korma': [{ itemModel: 'PortionMaster', code: 'PT_NAVRATAN_KORMA', quantity: 1 }],
    'Palak Paneer': [{ itemModel: 'PortionMaster', code: 'PT_PALAK_PANEER', quantity: 1 }],
    'Paneer Butter Masala': [{ itemModel: 'PortionMaster', code: 'PT_PANEER_BUTTER_MASALA', quantity: 1 }],
  };

  for (const dish of dishData) {
    if (dishRecipeMappings[dish.name]) {
      const ingredients = dishRecipeMappings[dish.name].map(ing => ({
        itemModel: ing.itemModel,
        itemId: portionIds[ing.code] || sfgIds[ing.code] || rmIds[ing.code],
        quantity: ing.quantity
      }));
      await Recipe.create({
        targetModel: 'Dish',
        targetId: dishIds[dish.name],
        ingredients,
        yieldAmount: 1,
        userId
      });
    }
  }
};
