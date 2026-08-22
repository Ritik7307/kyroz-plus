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
    { code: 'RM_PINEAPPLE_PIECES', name: 'Pineapple Pieces', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    // CHOPSUEY
    { code: 'CHOPSUEY_RM001', name: 'Z-105 TANGY COAT Premix', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'CHOPSUEY_RM002', name: 'Master Sweet & Sour Gravy', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'CHOPSUEY_RM003', name: 'Crispy Fried Noodle Nest', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 10 },
    { code: 'CHOPSUEY_RM004', name: 'Mixed Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'CHOPSUEY_RM005', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'CHOPSUEY_RM006', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'CHOPSUEY_RM007', name: 'Pineapple Pieces', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'CHOPSUEY_RM008', name: 'Egg Bullseye / Boiled Egg', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 7 },
    { code: 'CHOPSUEY_RM009', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    
    // CHILLI
    { code: 'CHILLI_RM001', name: 'Z-102 CRYSTAL GLAZE Premix', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 280 },
    { code: 'CHILLI_RM002', name: 'Master Chilli Liquid Base', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'CHILLI_RM003', name: 'Fried Paneer / Chicken / Soya', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'CHILLI_RM004', name: 'Capsicum Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'CHILLI_RM005', name: 'Onion Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'CHILLI_RM006', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'CHILLI_RM007', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'CHILLI_RM008', name: 'Slit Green Chilli', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'CHILLI_RM009', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },

    // MANCHURIAN
    { code: 'MANCHURIAN_RM001', name: 'Z-101 DARK MASTER Premix', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'MANCHURIAN_RM002', name: 'Master Manchurian Liquid Base', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 140 },
    { code: 'MANCHURIAN_RM003', name: 'Fried Veg Manchurian / Chicken', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'MANCHURIAN_RM004', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'MANCHURIAN_RM005', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'MANCHURIAN_RM006', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },

    // HONEYCHILLI
    { code: 'HONEYCHILLI_RM001', name: 'Z-105 TANGY COAT Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'HONEYCHILLI_RM002', name: 'Double Fried Potato Fingers', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'HONEYCHILLI_RM003', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'HONEYCHILLI_RM004', name: 'Honey', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'HONEYCHILLI_RM005', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'HONEYCHILLI_RM006', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'HONEYCHILLI_RM007', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'HONEYCHILLI_RM008', name: 'White Sesame', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'HONEYCHILLI_RM009', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'HONEYCHILLI_RM010', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },

    // HOTSOUR
    { code: 'HOTSOUR_RM001', name: 'Z-102 CRYSTAL GLAZE LIQUID', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'HOTSOUR_RM002', name: 'Mixed Soup Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'HOTSOUR_RM003', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'HOTSOUR_RM004', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'HOTSOUR_RM005', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'HOTSOUR_RM006', name: 'Red Chilli Paste', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'HOTSOUR_RM007', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'HOTSOUR_RM008', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },

    // MANCHOW
    { code: 'MANCHOW_RM001', name: 'Z-101 DARK MASTER Liquid', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 320 },
    { code: 'MANCHOW_RM002', name: 'Mixed Soup Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'MANCHOW_RM003', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'MANCHOW_RM004', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'MANCHOW_RM005', name: 'Fresh Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'MANCHOW_RM006', name: 'Fresh Ginger', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 140 },
    { code: 'MANCHOW_RM007', name: 'Coriander Stems', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'MANCHOW_RM008', name: 'Black Pepper', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'MANCHOW_RM009', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'MANCHOW_RM010', name: 'Fried Noodles', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'MANCHOW_RM011', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'MANCHOW_RM012', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },

    // CHILLIOIL
    { code: 'CHILLIOIL_RM001', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'CHILLIOIL_RM002', name: 'Teja Chilli Flakes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'CHILLIOIL_RM003', name: 'Kashmiri Chilli Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'CHILLIOIL_RM004', name: 'Star Anise', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 1200 },
    { code: 'CHILLIOIL_RM005', name: 'Cinnamon', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'CHILLIOIL_RM006', name: 'Salt', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },

    // GARLICOIL
    { code: 'GARLICOIL_RM001', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'GARLICOIL_RM002', name: 'Fresh Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'GARLICOIL_RM003', name: 'Salt', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },

    // MOMOS
    { code: 'MOMOS_RM001', name: 'Frozen Veg/Chicken Momos', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 8 },
    { code: 'MOMOS_RM002', name: 'Z-106 ARMOUR BASE', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'MOMOS_RM003', name: 'Z-107 RUBY CONCENTRATE', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'MOMOS_RM004', name: 'Mayonnaise', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'MOMOS_RM005', name: 'Cornflakes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'MOMOS_RM006', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'MOMOS_RM007', name: 'F-302 MASTER GARLIC OIL', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },

    // UNIMANCH (Universal Manchurian Z-101)
    { code: 'UNIMANCH_RM001', name: 'Z-101 DARK MASTER Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNIMANCH_RM002', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNIMANCH_RM003', name: 'Fresh Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIMANCH_RM004', name: 'Fresh Ginger', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 140 },
    { code: 'UNIMANCH_RM005', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'UNIMANCH_RM006', name: 'Soy Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNIMANCH_RM007', name: 'Red Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNIMANCH_RM008', name: 'Green Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNIMANCH_RM009', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIMANCH_RM010', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIMANCH_RM011', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNIMANCH_RM012', name: 'Fried Protein/Balls', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },

    // UNICHILLI (Universal Chilli Z-102)
    { code: 'UNICHILLI_RM001', name: 'Z-102 CRYSTAL GLAZE Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 280 },
    { code: 'UNICHILLI_RM002', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNICHILLI_RM003', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNICHILLI_RM004', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'UNICHILLI_RM005', name: 'Soy Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNICHILLI_RM006', name: 'Red Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNICHILLI_RM007', name: 'Green Chilli Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNICHILLI_RM008', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNICHILLI_RM009', name: 'Tomato Ketchup', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNICHILLI_RM010', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNICHILLI_RM011', name: 'Capsicum Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNICHILLI_RM012', name: 'Onion Cubes', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'UNICHILLI_RM013', name: 'Fried Protein', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },

    // UNISCHEZWAN (Z-103)
    { code: 'UNISCHEZWAN_RM001', name: 'Z-103 RED FIRE BATCH Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'UNISCHEZWAN_RM002', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNISCHEZWAN_RM003', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNISCHEZWAN_RM004', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNISCHEZWAN_RM005', name: 'Dark Soy Sauce', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 90 },
    { code: 'UNISCHEZWAN_RM006', name: 'Boiled Rice / Noodles', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNISCHEZWAN_RM007', name: 'Z-101 / Z-102 Master Liquid', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'UNISCHEZWAN_RM008', name: 'Cornflour Slurry', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNISCHEZWAN_RM009', name: 'Fried Protein', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNISCHEZWAN_RM010', name: 'Mixed Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },

    // UNIWOK (Z-104)
    { code: 'UNIWOK_RM001', name: 'Z-104 VOK DUST Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNIWOK_RM002', name: '80% Boiled Noodles/Rice', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIWOK_RM003', name: 'Mixed Julienne Vegetables', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNIWOK_RM004', name: 'Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIWOK_RM005', name: 'Spring Onion', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'UNIWOK_RM006', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIWOK_RM007', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'UNIWOK_RM008', name: 'Butter', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'UNIWOK_RM009', name: 'Fried Chicken / Scrambled Egg', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },

    // UNIFRY (Z-106)
    { code: 'UNIFRY_RM001', name: 'Z-106 ARMOUR BASE Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'UNIFRY_RM002', name: 'Egg', category: 'Chinese', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 7 },
    { code: 'UNIFRY_RM003', name: 'Chilled Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'UNIFRY_RM004', name: 'Salt', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'UNIFRY_RM005', name: 'Ginger Garlic Paste', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'UNIFRY_RM006', name: 'White Pepper', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'UNIFRY_RM007', name: 'Vinegar', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'UNIFRY_RM008', name: 'Chicken/Paneer/Mushroom', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'UNIFRY_RM009', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },

    // RUBY (Z-107)
    { code: 'RUBY_RM001', name: 'Z-107 RUBY CONCENTRATE Powder', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RUBY_RM002', name: 'Water', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 0 },
    { code: 'RUBY_RM003', name: 'Refined Oil', category: 'Chinese', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RUBY_RM004', name: 'Fresh Chopped Garlic', category: 'Chinese', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 }
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
    // CHOPSUEY
    { code: 'CHOPSUEY_SFG001', name: 'Master Sweet & Sour Gravy', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'CHOPSUEY_SFG002', name: 'Crispy Noodle Nest', batchYield: 50, yieldUnit: 'pcs', currentStock: 50, costPerUnit: 10 },
    // CHILLI
    { code: 'CHILLI_SFG001', name: 'Master Chilli Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'CHILLI_SFG002', name: 'Fried Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    // MANCHURIAN
    { code: 'MANCHURIAN_SFG001', name: 'Master Manchurian Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.14 },
    { code: 'MANCHURIAN_SFG002', name: 'Fried Manchurian Balls', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.20 },
    // HONEYCHILLI
    { code: 'HONEYCHILLI_SFG001', name: 'Double Fried Potato', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'HONEYCHILLI_SFG002', name: 'Honey Chilli Glaze Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.18 },
    // HOTSOUR
    { code: 'HOTSOUR_SFG001', name: 'Z-102 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.11 },
    { code: 'HOTSOUR_SFG002', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    // MANCHOW
    { code: 'MANCHOW_SFG001', name: 'Z-101 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.13 },
    { code: 'MANCHOW_SFG002', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'MANCHOW_SFG003', name: 'Fried Soup Noodles', batchYield: 2000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.15 },
    // CHILLIOIL
    { code: 'CHILLIOIL_SFG001', name: 'F-301 Master Chilli Oil', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.40 },
    // GARLICOIL
    { code: 'GARLICOIL_SFG001', name: 'F-302 Master Garlic Oil', batchYield: 500, yieldUnit: 'ml', currentStock: 500, costPerUnit: 0.35 },
    // MOMOS
    { code: 'MOMOS_SFG001', name: 'Prepared Ruby Sauce', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'MOMOS_SFG002', name: 'Prepared Z-106 Batter', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.12 },
    // UNIMANCH
    { code: 'UNIMANCH_SFG001', name: 'Master Manchurian Liquid', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.14 },
    { code: 'UNIMANCH_SFG002', name: 'Fried Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.20 },
    // UNICHILLI
    { code: 'UNICHILLI_SFG001', name: 'Master Chilli Liquid', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'UNICHILLI_SFG002', name: 'Fried Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    // UNISCHEZWAN
    { code: 'UNISCHEZWAN_SFG001', name: 'Master Schezwan Paste', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.25 },
    { code: 'UNISCHEZWAN_SFG002', name: 'Boiled Rice / Noodles', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    // UNIWOK
    { code: 'UNIWOK_SFG001', name: '80% Boiled Noodles', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'UNIWOK_SFG002', name: '80% Boiled Rice', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    // UNIFRY
    { code: 'UNIFRY_SFG001', name: 'Prepared Batter', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.12 },
    { code: 'UNIFRY_SFG002', name: 'Pre-marinated Protein', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.30 },
    // RUBY
    { code: 'RUBY_SFG001', name: 'Prepared Momo Chutney', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.20 }
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
        targetYield: sfg.batchYield,
        operationalYield: sfg.batchYield,
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
    },
    // CHOPSUEY
    {
      code: 'CHOPSUEY_PT001',
      name: 'American Chopsuey Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['CHOPSUEY_SFG001'], quantity: 350, unit: 'ml' },
        { sfgId: rmIds['CHOPSUEY_RM004'], quantity: 120, unit: 'gm' },
        { sfgId: sfgIds['CHOPSUEY_SFG002'], quantity: 1, unit: 'pcs' },
        { sfgId: rmIds['CHOPSUEY_RM005'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['CHOPSUEY_RM006'], quantity: 45, unit: 'ml' },
        { sfgId: rmIds['CHOPSUEY_RM007'], quantity: 20, unit: 'gm' },
        { sfgId: rmIds['CHOPSUEY_RM008'], quantity: 1, unit: 'pcs' },
        { sfgId: rmIds['CHOPSUEY_RM009'], quantity: 20, unit: 'ml' },
      ]
    },
    // CHILLI DRY
    {
      code: 'CHILLI_PT001',
      name: 'Chilli Portion Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['CHILLI_SFG001'], quantity: 100, unit: 'ml' },
        { sfgId: sfgIds['CHILLI_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM004'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM005'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM006'], quantity: 10, unit: 'ml' },
        { sfgId: rmIds['CHILLI_RM008'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM009'], quantity: 5, unit: 'gm' },
      ]
    },
    // CHILLI GRAVY
    {
      code: 'CHILLI_PT101',
      name: 'Chilli Portion Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['CHILLI_SFG001'], quantity: 300, unit: 'ml' },
        { sfgId: rmIds['CHILLI_RM007'], quantity: 30, unit: 'ml' },
        { sfgId: sfgIds['CHILLI_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM004'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM005'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM006'], quantity: 10, unit: 'ml' },
        { sfgId: rmIds['CHILLI_RM008'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['CHILLI_RM009'], quantity: 5, unit: 'gm' },
      ]
    },
    // MANCHURIAN DRY
    {
      code: 'MANCHURIAN_PT001',
      name: 'Manchurian Portion Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['MANCHURIAN_SFG001'], quantity: 100, unit: 'ml' },
        { sfgId: rmIds['MANCHURIAN_RM004'], quantity: 15, unit: 'ml' },
        { sfgId: sfgIds['MANCHURIAN_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['MANCHURIAN_RM005'], quantity: 10, unit: 'ml' },
        { sfgId: rmIds['MANCHURIAN_RM006'], quantity: 5, unit: 'gm' },
      ]
    },
    // MANCHURIAN GRAVY
    {
      code: 'MANCHURIAN_PT101',
      name: 'Manchurian Portion Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['MANCHURIAN_SFG001'], quantity: 275, unit: 'ml' },
        { sfgId: rmIds['MANCHURIAN_RM004'], quantity: 45, unit: 'ml' },
        { sfgId: sfgIds['MANCHURIAN_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['MANCHURIAN_RM005'], quantity: 10, unit: 'ml' },
        { sfgId: rmIds['MANCHURIAN_RM006'], quantity: 5, unit: 'gm' },
      ]
    },
    // HONEYCHILLI
    {
      code: 'HONEYCHILLI_PT001',
      name: 'Honey Chilli Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['HONEYCHILLI_SFG001'], quantity: 180, unit: 'gm' },
        { sfgId: sfgIds['HONEYCHILLI_SFG002'], quantity: 120, unit: 'ml' },
        { sfgId: rmIds['HONEYCHILLI_RM003'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['HONEYCHILLI_RM004'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['HONEYCHILLI_RM005'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['HONEYCHILLI_RM007'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['HONEYCHILLI_RM008'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['HONEYCHILLI_RM009'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['HONEYCHILLI_RM006'], quantity: 10, unit: 'ml' },
      ]
    },
    // HOTSOUR
    {
      code: 'HOTSOUR_PT001',
      name: 'Hot Sour Soup Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['HOTSOUR_SFG001'], quantity: 120, unit: 'ml' },
        { sfgId: rmIds['HOTSOUR_RM003'], quantity: 180, unit: 'ml' },
        { sfgId: sfgIds['HOTSOUR_SFG002'], quantity: 40, unit: 'gm' },
        { sfgId: rmIds['HOTSOUR_RM004'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['HOTSOUR_RM005'], quantity: 2.5, unit: 'ml' },
        { sfgId: rmIds['HOTSOUR_RM006'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['HOTSOUR_RM007'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['HOTSOUR_RM008'], quantity: 5, unit: 'ml' },
      ]
    },
    // MANCHOW
    {
      code: 'MANCHOW_PT001',
      name: 'Manchow Soup Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['MANCHOW_SFG001'], quantity: 100, unit: 'ml' },
        { sfgId: rmIds['MANCHOW_RM003'], quantity: 200, unit: 'ml' },
        { sfgId: sfgIds['MANCHOW_SFG002'], quantity: 40, unit: 'gm' },
        { sfgId: rmIds['MANCHOW_RM004'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['MANCHOW_RM005'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['MANCHOW_RM006'], quantity: 2, unit: 'gm' },
        { sfgId: rmIds['MANCHOW_RM007'], quantity: 3, unit: 'gm' },
        { sfgId: rmIds['MANCHOW_RM008'], quantity: 0.5, unit: 'gm' },
        { sfgId: rmIds['MANCHOW_RM009'], quantity: 1, unit: 'ml' },
        { sfgId: sfgIds['MANCHOW_SFG003'], quantity: 10, unit: 'gm' },
        { sfgId: rmIds['MANCHOW_RM011'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['MANCHOW_RM012'], quantity: 5, unit: 'ml' },
      ]
    },
    // CHILLIOIL
    {
      code: 'CHILLIOIL_PT001',
      name: 'Master Chilli Oil (Soup)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['CHILLIOIL_SFG001'], quantity: 2.5, unit: 'ml' }]
    },
    {
      code: 'CHILLIOIL_PT002',
      name: 'Master Chilli Oil (Rice)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['CHILLIOIL_SFG001'], quantity: 5, unit: 'ml' }]
    },
    {
      code: 'CHILLIOIL_PT003',
      name: 'Master Chilli Oil (Momo)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['CHILLIOIL_SFG001'], quantity: 5, unit: 'ml' }]
    },
    // GARLICOIL
    {
      code: 'GARLICOIL_PT001',
      name: 'Master Garlic Oil (Rice)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['GARLICOIL_SFG001'], quantity: 15, unit: 'ml' }]
    },
    {
      code: 'GARLICOIL_PT002',
      name: 'Master Garlic Oil (Soup)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['GARLICOIL_SFG001'], quantity: 2.5, unit: 'ml' }]
    },
    {
      code: 'GARLICOIL_PT003',
      name: 'Master Garlic Oil (Dry)',
      costPerPortion: 0,
      ingredients: [{ sfgId: sfgIds['GARLICOIL_SFG001'], quantity: 5, unit: 'ml' }]
    },
    // MOMOS
    {
      code: 'MOMOS_PT001',
      name: 'Momos Portion Steamed',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['MOMOS_RM001'], quantity: 6, unit: 'pcs' },
        { sfgId: sfgIds['MOMOS_SFG001'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['MOMOS_RM007'], quantity: 2.5, unit: 'ml' },
      ]
    },
    {
      code: 'MOMOS_PT002',
      name: 'Momos Portion Fried',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['MOMOS_RM001'], quantity: 6, unit: 'pcs' },
        { sfgId: sfgIds['MOMOS_SFG001'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['MOMOS_RM004'], quantity: 20, unit: 'ml' },
      ]
    },
    {
      code: 'MOMOS_PT003',
      name: 'Momos Portion Kurkure',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['MOMOS_RM001'], quantity: 6, unit: 'pcs' },
        { sfgId: sfgIds['MOMOS_SFG002'], quantity: 25, unit: 'gm' },
        { sfgId: rmIds['MOMOS_RM005'], quantity: 20, unit: 'gm' },
        { sfgId: sfgIds['MOMOS_SFG001'], quantity: 30, unit: 'ml' },
      ]
    },
    // UNIMANCH (Z-101 Universal)
    {
      code: 'UNIMANCH_PT001',
      name: 'Uni Manchurian Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIMANCH_SFG001'], quantity: 100, unit: 'ml' },
        { sfgId: rmIds['UNIMANCH_RM011'], quantity: 15, unit: 'ml' },
        { sfgId: sfgIds['UNIMANCH_SFG002'], quantity: 180, unit: 'gm' }
      ]
    },
    {
      code: 'UNIMANCH_PT101',
      name: 'Uni Manchurian Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIMANCH_SFG001'], quantity: 275, unit: 'ml' },
        { sfgId: rmIds['UNIMANCH_RM011'], quantity: 45, unit: 'ml' },
        { sfgId: sfgIds['UNIMANCH_SFG002'], quantity: 180, unit: 'gm' }
      ]
    },
    // UNICHILLI (Z-102 Universal)
    {
      code: 'UNICHILLI_PT001',
      name: 'Uni Chilli Dry',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNICHILLI_SFG001'], quantity: 100, unit: 'ml' },
        { sfgId: rmIds['UNICHILLI_RM010'], quantity: 15, unit: 'ml' },
        { sfgId: sfgIds['UNICHILLI_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM011'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM012'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM002'], quantity: 10, unit: 'ml' },
      ]
    },
    {
      code: 'UNICHILLI_PT101',
      name: 'Uni Chilli Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNICHILLI_SFG001'], quantity: 300, unit: 'ml' },
        { sfgId: rmIds['UNICHILLI_RM010'], quantity: 30, unit: 'ml' },
        { sfgId: sfgIds['UNICHILLI_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM011'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM012'], quantity: 50, unit: 'gm' },
        { sfgId: rmIds['UNICHILLI_RM002'], quantity: 10, unit: 'ml' },
      ]
    },
    // UNISCHEZWAN (Z-103)
    {
      code: 'UNISCHEZWAN_PT001',
      name: 'Uni Schezwan Rice',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNISCHEZWAN_SFG002'], quantity: 200, unit: 'gm' },
        { sfgId: sfgIds['UNISCHEZWAN_SFG001'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['UNISCHEZWAN_RM010'], quantity: 60, unit: 'gm' },
        { sfgId: rmIds['UNISCHEZWAN_RM002'], quantity: 15, unit: 'ml' },
      ]
    },
    {
      code: 'UNISCHEZWAN_PT101',
      name: 'Uni Schezwan Gravy',
      costPerPortion: 0,
      ingredients: [
        { sfgId: rmIds['UNISCHEZWAN_RM007'], quantity: 250, unit: 'ml' },
        { sfgId: sfgIds['UNISCHEZWAN_SFG001'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['UNISCHEZWAN_RM008'], quantity: 30, unit: 'ml' },
        { sfgId: rmIds['UNISCHEZWAN_RM009'], quantity: 180, unit: 'gm' },
      ]
    },
    // UNIWOK (Z-104)
    {
      code: 'UNIWOK_PT001',
      name: 'Uni Wok Noodles',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIWOK_SFG001'], quantity: 200, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM003'], quantity: 60, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM004'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM001'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM006'], quantity: 5, unit: 'ml' },
        { sfgId: rmIds['UNIWOK_RM007'], quantity: 15, unit: 'ml' },
        { sfgId: rmIds['UNIWOK_RM008'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM005'], quantity: 5, unit: 'gm' },
        { sfgId: rmIds['UNIWOK_RM009'], quantity: 60, unit: 'gm' },
      ]
    },
    // UNIFRY (Z-106)
    {
      code: 'UNIFRY_PT001',
      name: 'Uni Fry Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['UNIFRY_SFG002'], quantity: 180, unit: 'gm' },
        { sfgId: sfgIds['UNIFRY_SFG001'], quantity: 60, unit: 'gm' },
        { sfgId: rmIds['UNIFRY_RM009'], quantity: 10, unit: 'ml' },
      ]
    },
    // RUBY (Z-107)
    {
      code: 'RUBY_PT001',
      name: 'Ruby Portion',
      costPerPortion: 0,
      ingredients: [
        { sfgId: sfgIds['RUBY_SFG001'], quantity: 30, unit: 'ml' },
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
    // CHOPSUEY
    { code: 'CHOPSUEY_PKG001', name: 'Large Shallow Bowl', unit: 'pc', currentStock: 500, costPerUnit: 25 },
    { code: 'CHOPSUEY_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'CHOPSUEY_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // CHILLI
    { code: 'CHILLI_PKG001', name: 'Chinese Bowl/Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'CHILLI_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'CHILLI_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // MANCHURIAN
    { code: 'MANCHURIAN_PKG001', name: 'Chinese Bowl / Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'MANCHURIAN_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'MANCHURIAN_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // HONEYCHILLI
    { code: 'HONEYCHILLI_PKG001', name: 'Starter Box/Bowl', unit: 'pc', currentStock: 500, costPerUnit: 12 },
    { code: 'HONEYCHILLI_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'HONEYCHILLI_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // HOTSOUR
    { code: 'HOTSOUR_PKG001', name: 'Soup Bowl', unit: 'pc', currentStock: 500, costPerUnit: 10 },
    { code: 'HOTSOUR_PKG002', name: 'Soup Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'HOTSOUR_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // MANCHOW
    { code: 'MANCHOW_PKG001', name: 'Soup Bowl', unit: 'pc', currentStock: 500, costPerUnit: 10 },
    { code: 'MANCHOW_PKG002', name: 'Soup Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'MANCHOW_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // CHILLIOIL
    { code: 'CHILLIOIL_PKG001', name: '1 L Food Grade Bottle', unit: 'pc', currentStock: 500, costPerUnit: 20 },
    { code: 'CHILLIOIL_PKG002', name: 'Batch Label', unit: 'pc', currentStock: 500, costPerUnit: 1 },
    // GARLICOIL
    { code: 'GARLICOIL_PKG001', name: '500 ml Bottle', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'GARLICOIL_PKG002', name: 'Batch Label', unit: 'pc', currentStock: 500, costPerUnit: 1 },
    // MOMOS
    { code: 'MOMOS_PKG001', name: 'Snack Box', unit: 'pc', currentStock: 500, costPerUnit: 8 },
    { code: 'MOMOS_PKG002', name: 'Sauce Cups', unit: 'pc', currentStock: 1000, costPerUnit: 2 },
    { code: 'MOMOS_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNIMANCH
    { code: 'UNIMANCH_PKG001', name: 'Chinese Bowl', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'UNIMANCH_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNIMANCH_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNICHILLI
    { code: 'UNICHILLI_PKG001', name: 'Chinese Bowl/Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'UNICHILLI_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNICHILLI_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNISCHEZWAN
    { code: 'UNISCHEZWAN_PKG001', name: 'Chinese Container', unit: 'pc', currentStock: 500, costPerUnit: 15 },
    { code: 'UNISCHEZWAN_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNISCHEZWAN_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNIWOK
    { code: 'UNIWOK_PKG001', name: 'Noodle/Rice Container', unit: 'pc', currentStock: 500, costPerUnit: 12 },
    { code: 'UNIWOK_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNIWOK_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // UNIFRY
    { code: 'UNIFRY_PKG001', name: 'Starter Box / Bowl', unit: 'pc', currentStock: 500, costPerUnit: 12 },
    { code: 'UNIFRY_PKG002', name: 'Lid', unit: 'pc', currentStock: 500, costPerUnit: 5 },
    { code: 'UNIFRY_PKG003', name: 'Carry Bag', unit: 'pc', currentStock: 500, costPerUnit: 3 },
    // RUBY
    { code: 'RUBY_PKG001', name: '1 L Sauce Bottle / Dispenser', unit: 'pc', currentStock: 500, costPerUnit: 20 },
    { code: 'RUBY_PKG002', name: 'Batch Label', unit: 'pc', currentStock: 500, costPerUnit: 1 },
  ];

  const pkgIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const pkg of pkgData) {
    const createdPkg = await Packaging.create({ ...pkg, userId });
    pkgIds[pkg.code] = createdPkg._id as mongoose.Types.ObjectId;
  }

  const dishData = [
    { name: 'Aloo Gobhi Matar (Semi-Gravy)', price: 250, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Corn Palak Cheese', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Kadhai Paneer', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Lehsunia Paneer', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta (Ivory)', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta Red', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Mushroom Do Pyaza', price: 290, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Navratan Korma', price: 350, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Palak Paneer', price: 300, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Paneer Butter Masala', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } }
  ];

  const dishIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const dish of dishData) {
    const createdDish = await Dish.create({ ...dish, userId });
    dishIds[dish.name] = createdDish._id as mongoose.Types.ObjectId;
  }

  const dishRecipeMappings: Record<string, { itemModel: string, code: string, quantity: number }[]> = {
    'Aloo Gobhi Matar (Semi-Gravy)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRE_FRIED_POTATO', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRE_FRIED_CAULIFLOWER', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_GREEN_PEAS', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HING', quantity: 0.2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Corn Palak Cheese': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BOILED_SWEET_CORN', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_PROCESSED_CHEESE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 1 }
    ],
    'Kadhai Paneer': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_ONION_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 5 }
    ],
    'Lehsunia Paneer': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_GARLIC', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SALT', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_GOLDEN_GARLIC_TOPPING', quantity: 10 }
    ],
    'Malai Kofta (Ivory)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_FRIED_KOFTA', quantity: 4 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_MACE', quantity: 0.25 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.25 },
      { itemModel: 'RawMaterial', code: 'RM_ALMOND_FLAKES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_KHOYA', quantity: 5 }
    ],
    'Malai Kofta Red': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MALAI_KOFTA', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 3 }
    ],
    'Mushroom Do Pyaza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 120 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_PETALS', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_CURD_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 2 }
    ],
    'Navratan Korma': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_BLANCHED_VEG_MIX', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_FRIED_MAKHANA', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_PINEAPPLE_CHUNKS', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_CASHEW', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_RAISINS', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_MACE', quantity: 0.25 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_POMEGRANATE_SEEDS', quantity: 5 }
    ],
    'Palak Paneer': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_VEG_STOCK_WATER', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 5 }
    ],
    'Paneer Butter Masala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_CUBES', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_GINGER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_HONEY', quantity: 2 }
    ]
  };

  for (const dish of dishData) {
    if (dishRecipeMappings[dish.name]) {
      const ingredients = dishRecipeMappings[dish.name].map(ing => ({
        itemModel: ing.itemModel,
        itemId: portionIds[ing.code] || sfgIds[ing.code] || rmIds[ing.code] || (() => { console.error('MISSING ITEM ID FOR', ing.code, 'IN', dish.name); return undefined; })(),
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
