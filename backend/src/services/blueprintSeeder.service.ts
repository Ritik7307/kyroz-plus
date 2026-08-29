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
    // B-401 Biryani RMs
    { code: 'RM_B401', name: 'B-401 ROYAL AWADH', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 450 },
    { code: 'RM_BASMATI_RICE', name: 'Long Grain Basmati Rice', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 140 },
    { code: 'RM_GHEE', name: 'Pure Ghee', category: 'Dairy', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 600 },
    { code: 'RM_KEWRA_WATER', name: 'Kewra + Attar', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 300 },
    { code: 'RM_FOOD_COLOUR', name: 'Food Colour', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 200 },

    // C-500 Series Master Bases & Raw Materials
    { code: 'RM_C501', name: 'C-501 DOUGH MASTER', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 180 },
    { code: 'RM_C502', name: 'C-502 GRILL DUST', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 250 },
    { code: 'RM_C503', name: 'C-503 VELVET GLAZE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 300 },
    { code: 'RM_C504', name: 'C-504 HERB INFUSION', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_C505', name: 'C-505 ALFREDO CORE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_C506', name: 'C-506 MARINARA CORE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_C507', name: 'C-507 SNOW BASE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 280 },
    { code: 'RM_C508', name: 'C-508 COCOA BASE', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 320 },
    { code: 'RM_C509', name: 'C-509 FIRE DUST', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'RM_C510', name: 'C-510 ZING MASTER', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 260 },
    { code: 'RM_DUSTING_FLOUR', name: 'Dusting Flour', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 40 },
    { code: 'RM_BREADCRUMBS', name: 'Breadcrumbs', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 80 },
    { code: 'RM_LIQUID_CHEESE', name: 'Liquid Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 300 },
    { code: 'RM_VEG_EXTRA_THICK_MAYO', name: 'Veg Extra Thick Mayo', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 120 },
    { code: 'RM_TOMATO_KETCHUP', name: 'Tomato Ketchup', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 90 },
    { code: 'RM_BURGER_BUN', name: 'Burger Bun', category: 'Bakery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 8 },
    { code: 'RM_CHEESE_SLICE', name: 'Cheese Slice', category: 'Dairy', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 1000, costPerPurchaseUnit: 12 },
    { code: 'RM_TORTILLA', name: '8/10 inch Tortilla', category: 'Bakery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 10 },
    { code: 'RM_FRENCH_FRIES', name: 'French Fries (Frozen)', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 110 },
    { code: 'RM_CHICKEN_NUGGETS', name: 'Chicken Nuggets (Frozen)', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 250 },
    { code: 'RM_FRUIT_SYRUPS', name: 'Fruit Syrups', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_INSTANT_COFFEE', name: 'Instant Coffee', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 800 },
    { code: 'RM_OREO', name: 'Oreo Biscuits', category: 'Grocery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 1000, costPerPurchaseUnit: 3 },
    { code: 'RM_HAZELNUT_SYRUP', name: 'Hazelnut Syrup', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },
    { code: 'RM_ICE_CUBES', name: 'Ice Cubes', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 10 },
    { code: 'RM_RAW_PASTA', name: 'Raw Pasta', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 150 },
    { code: 'RM_CHICKEN_MINCE', name: 'Chicken Mince', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 280 },

    // Indo Arabic Mandi RMs
    { code: 'RM_CHICKEN_MANDI', name: 'Chicken LG + Thigh', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 220 },
    { code: 'RM_MUTTON_MANDI', name: 'Mutton', category: 'Non Veg', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 800 },
    { code: 'RM_SELLA_RICE', name: 'Long Grain/Sella Rice', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50000, costPerPurchaseUnit: 120 },
    { code: 'RM_B404A', name: 'B-404 A', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_B404B', name: 'B-404 B', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_COAL', name: 'Coal', category: 'Fuel', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 30 },

    // Patch Missing RMs from other recipes
    { code: 'RM_FRYING_OIL', name: 'Frying Oil', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_SHAHI_JEERA', name: 'Shahi Jeera', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 400 },
    { code: 'RM_FRESH_GINGER', name: 'Fresh Ginger', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_KASHMIRI_CHILLI_POWDER', name: 'Kashmiri Chilli Powder', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 350 },
    { code: 'RM_ONION_PETALS', name: 'Onion Petals', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'RM_CURD_FRESH_CREAM', name: 'Curd / Fresh Cream', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 150 },
    { code: 'RM_PINEAPPLE_CHUNKS', name: 'Pineapple Chunks', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 180 },
    { code: 'RM_FRIED_CASHEW', name: 'Fried Cashew', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_RAISINS', name: 'Raisins', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_POMEGRANATE_SEEDS', name: 'Pomegranate Seeds', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 150 },
    { code: 'RM_VEG_STOCK_WATER', name: 'Veg Stock Water', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 10 },
    { code: 'RM_WHOLE_JEERA', name: 'Whole Jeera', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 300 },
    { code: 'RM_HONEY', name: 'Honey', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },

    // South Indian S-300 Series
    { code: 'RM_S301', name: 'S-301 Coastal Crust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'RM_S302', name: 'S-302 Yellow Temper', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_S303', name: 'S-303 Rava Pearl', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 160 },
    { code: 'RM_S304', name: 'S-304 Crunch Core', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 190 },
    { code: 'RM_S305', name: 'S-305 Steam Cloud', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 170 },
    { code: 'RM_S306', name: 'S-306 Tangy Tropic', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 220 },
    { code: 'RM_S307', name: 'S-307 Kerala Kernel', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 240 },
    { code: 'RM_S308', name: 'S-308 Lentil Lava', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 210 },
    { code: 'RM_WATER', name: 'Water', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 100000, costPerPurchaseUnit: 1 },
    { code: 'RM_ONION', name: 'Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 40 },
    { code: 'RM_TOMATO', name: 'Tomato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 50 },
    { code: 'RM_MUSTARD_SEEDS', name: 'Mustard Seeds', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_URAD_DAL', name: 'Urad Dal', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_CURRY_LEAVES', name: 'Curry Leaves', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 80 },
    { code: 'RM_BOILED_POTATOES', name: 'Boiled Potatoes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 60 },
    { code: 'RM_BOILED_VEGETABLES', name: 'Boiled Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 70 },

    // Tandoor Missing RMs
    { code: 'RM_LEMON_JUICE', name: 'Lemon Juice', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_OLIVE_OIL', name: 'Olive Oil', category: 'Grocery', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },

    // T-600 Series Tandoor System
    { code: 'RM_T604', name: 'T-604 Crimson Coat', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_T605', name: 'T-605 Silk Infusion', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 280 },
    { code: 'RM_T606', name: 'T-606 Mince Master', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 150 },
    { code: 'RM_T607', name: 'T-607 Arabian Smoke', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 180 },
    { code: 'RM_T601', name: 'T-601 Classic Char', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 120 },
    { code: 'RM_T602', name: 'T-602 White Velvet', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 130 },
    { code: 'RM_T603', name: 'T-603 Verdant Rub', category: 'Premix', purchaseUnit: 'pkt', consumptionUnit: 'pkt', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 140 },
    { code: 'RM_ACHARI_PASTE', name: 'Achari Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 300 },
    { code: 'RM_RAW_CHICKEN_WHOLE', name: 'Raw Chicken Whole Bird', category: 'Meat', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 160 },
    { code: 'RM_CHICKEN_FAT', name: 'Chicken Fat', category: 'Fat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_DEWATERED_ONION', name: 'Dewatered Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_BESAN', name: 'Besan', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 70 },
    { code: 'RM_SOYA_CHAAP', name: 'Soya Chaap', category: 'Protein', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_BUTTON_MUSHROOM', name: 'Button Mushroom', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_MINT_ONION', name: 'Mint Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_MOMO_CHUTNEY', name: 'Momo Chutney', category: 'Condiment', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_VEG_MOMOS', name: 'Veg Momos Raw', category: 'Frozen', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 5 },

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
    const createdRm = await RawMaterial.findOneAndUpdate({ code: rm.code, userId }, { $set: { ...rm, userId } }, { upsert: true, new: true });
    if(createdRm) rmIds[rm.code] = createdRm._id as mongoose.Types.ObjectId;
  }

  const sfgData = [
    // Biryani Batches & SFGs
    { code: 'SFG_YAKHNI_CHICKEN', name: '80% Cooked Yakhni Chicken', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.28 },
    { code: 'SFG_70_BOILED_RICE', name: '70% Boiled Rice', batchYield: 2200, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.08 },
    { code: 'SFG_BROWN_ONION', name: 'Brown Onion (Birista)', batchYield: 200, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.25 },
    { code: 'SFG_PREPARED_BIRYANI', name: 'Prepared Biryani (Dum)', batchYield: 3200, yieldUnit: 'gm', currentStock: 15000, costPerUnit: 0.15 },

    // C-500 Series SFGs
    { code: 'SFG_PREPARED_PIZZA_DOUGH', name: 'Prepared Pizza Dough', batchYield: 1700, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'SFG_10_INCH_PIZZA_BASE', name: '10 inch Pizza Base', batchYield: 1, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 25 },
    { code: 'SFG_12_INCH_PIZZA_BASE', name: '12 inch Pizza Base', batchYield: 1, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 35 },
    { code: 'SFG_VEG_PATTY', name: 'Prepared Veg Patty', batchYield: 13, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 12 },
    { code: 'SFG_CHICKEN_PATTY', name: 'Prepared Chicken Patty', batchYield: 13, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 28 },
    { code: 'SFG_CLASSIC_BURGER_SAUCE', name: 'Classic Burger Sauce', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.15 },
    { code: 'SFG_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce', batchYield: 360, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.16 },
    { code: 'SFG_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_HERB_GARLIC_BUTTER', name: 'Herb Garlic Butter', batchYield: 240, yieldUnit: 'gm', currentStock: 500, costPerUnit: 0.45 },
    { code: 'SFG_HERB_GARLIC_MAYO', name: 'Herb Garlic Mayo', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.18 },
    { code: 'SFG_MARINATED_CHICKEN_C510', name: '24-Hour Marinated Chicken (C-510)', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.28 },
    { code: 'SFG_COATED_CHICKEN_C510', name: 'Double Coated Chicken (C-510)', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.30 },
    { code: 'SFG_PREPARED_PIZZA_SAUCE', name: 'Prepared Pizza Sauce', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.10 },
    { code: 'SFG_BOILED_PASTA_C500', name: '80% Boiled Pasta', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.15 },

    // Mandi Batches & SFGs
    { code: 'SFG_STEAMED_CHICKEN_MANDI', name: 'Steamed Chicken Mandi', batchYield: 6, yieldUnit: 'pcs', currentStock: 60, costPerUnit: 45 },
    { code: 'SFG_STEAMED_MUTTON_MANDI', name: 'Steamed Mutton Mandi', batchYield: 6, yieldUnit: 'pcs', currentStock: 30, costPerUnit: 150 },
    { code: 'SFG_MANDI_STOCK', name: 'Mandi Stock', batchYield: 2000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0 },
    { code: 'SFG_MANDI_RICE', name: 'Mandi Rice', batchYield: 3200, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.1 },

    // Patch Missing SFGs from other recipes
    { code: 'SFG_PANEER_CUBES', name: 'SFG Paneer Cubes', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_GOLDEN_GARLIC_TOPPING', name: 'Golden Garlic Topping', batchYield: 500, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_FRIED_KOFTA', name: 'Fried Kofta', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.25 },
    { code: 'SFG_MALAI_KOFTA', name: 'Malai Kofta', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.30 },
    { code: 'SFG_BLANCHED_VEG_MIX', name: 'Blanched Veg Mix', batchYield: 2000, yieldUnit: 'gm', currentStock: 3000, costPerUnit: 0.15 },
    { code: 'SFG_FRIED_MAKHANA', name: 'Fried Makhana', batchYield: 500, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.40 },

    // South Indian Batters and Bases
    { code: 'SFG_DOSA_BATTER_S301', name: 'Dosa Batter S-301', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_ALOO_MASALA_S302', name: 'Aloo Masala S-302', batchYield: 1500, yieldUnit: 'gm', currentStock: 3000, costPerUnit: 0.15 },
    { code: 'SFG_RAVA_BATTER_S303', name: 'Rava Batter S-303', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_VADA_BATTER_S304', name: 'Vada Batter S-304', batchYield: 1800, yieldUnit: 'gm', currentStock: 3000, costPerUnit: 0.11 },
    { code: 'SFG_IDLI_BATTER_S305', name: 'Idli/Uttapam Batter S-305', batchYield: 2200, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_RED_CHUTNEY_S306', name: 'Red Chutney S-306', batchYield: 3500, yieldUnit: 'gm', currentStock: 4000, costPerUnit: 0.07 },
    { code: 'SFG_COCONUT_CHUTNEY_S307', name: 'Coconut Chutney S-307', batchYield: 3500, yieldUnit: 'gm', currentStock: 4000, costPerUnit: 0.08 },
    { code: 'SFG_SAMBHAR_S308', name: 'Sambhar S-308', batchYield: 10000, yieldUnit: 'ml', currentStock: 15000, costPerUnit: 0.04 },

    // Tandoor Marination SFGs
    { code: 'SFG_MARINATED_CHICKEN_T604', name: 'Marinated Chicken T-604', batchYield: 2000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_MARINATED_CHICKEN_T605', name: 'Marinated Chicken T-605', batchYield: 2000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.40 },
    { code: 'SFG_MARINATED_SEEKH_T606', name: 'Marinated Seekh Mix T-606', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.45 },
    { code: 'SFG_MARINATED_ALFAHAM_T607', name: 'Marinated Al Faham T-607', batchYield: 1, yieldUnit: 'pcs', currentStock: 50, costPerUnit: 180 },
    { code: 'SFG_T601_PASTE', name: 'T-601 Ready Paste', batchYield: 600, yieldUnit: 'gm', currentStock: 1200, costPerUnit: 0.30 },
    { code: 'SFG_T602_PASTE', name: 'T-602 Ready Paste', batchYield: 600, yieldUnit: 'gm', currentStock: 1200, costPerUnit: 0.35 },
    { code: 'SFG_T603_PASTE', name: 'T-603 Ready Paste', batchYield: 600, yieldUnit: 'gm', currentStock: 1200, costPerUnit: 0.32 },
    { code: 'SFG_T602A_PASTE', name: 'T-602-A Achari Paste', batchYield: 750, yieldUnit: 'gm', currentStock: 1500, costPerUnit: 0.34 },

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
    const createdSfg = await SemiFinishedGood.findOneAndUpdate({ code: sfg.code, userId }, { $set: { ...sfg, userId } }, { upsert: true, new: true });
    if(createdSfg) sfgIds[sfg.code] = createdSfg._id as mongoose.Types.ObjectId;
  }

  for (const sfg of sfgData) {
    const rmCode = 'RM_' + sfg.code.replace('SFG_', '');
    if (rmIds[rmCode]) {
      await Recipe.findOneAndUpdate(
        { targetModel: 'SemiFinishedGood', targetId: sfgIds[sfg.code], userId },
        { $set: {
          ingredients: [
            { itemModel: 'RawMaterial', itemId: rmIds[rmCode], quantity: sfg.batchYield }
          ],
          targetYield: sfg.batchYield,
          operationalYield: sfg.batchYield,
          userId
        } },
        { upsert: true, new: true }
      );
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
    const createdPortion = await PortionMaster.findOneAndUpdate({ code: portion.code, userId }, { $set: { ...portion, userId } }, { upsert: true, new: true });
    if(createdPortion) portionIds[portion.code] = createdPortion._id as mongoose.Types.ObjectId;
  }

  const pkgData = [
    // Biryani Packaging
    { code: 'PKG_BIRYANI_CONTAINER', name: 'Biryani Container', unit: 'pcs', currentStock: 2000, costPerUnit: 20 },

    // C-500 Series Packaging
    { code: 'PKG_DOUGH_TRAY', name: 'Food Grade Dough Tray', unit: 'pcs', currentStock: 200, costPerUnit: 50 },
    { code: 'PKG_PLASTIC_WRAP', name: 'Plastic Wrap', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_SAUCE_BOTTLE', name: '1 L Sauce Bottle', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_DIP_CUP', name: 'Dip Cup', unit: 'pcs', currentStock: 5000, costPerUnit: 1 },
    { code: 'PKG_SEASONING_SACHET', name: 'Seasoning Sachet', unit: 'pcs', currentStock: 10000, costPerUnit: 0.5 },
    { code: 'PKG_CHICKEN_BUCKET', name: 'Chicken Box/Bucket', unit: 'pcs', currentStock: 1000, costPerUnit: 20 },
    { code: 'PKG_BURGER_BOX', name: 'Burger Wrap/Box', unit: 'pcs', currentStock: 5000, costPerUnit: 8 },
    { code: 'PKG_PIZZA_BOX', name: 'Pizza Box', unit: 'pcs', currentStock: 2000, costPerUnit: 18 },
    { code: 'PKG_SANDWICH_BOX', name: 'Sandwich Box', unit: 'pcs', currentStock: 2000, costPerUnit: 10 },
    { code: 'PKG_WRAP_BOX', name: 'Wrap Sleeve / Box', unit: 'pcs', currentStock: 3000, costPerUnit: 8 },
    { code: 'PKG_PASTA_BOWL', name: 'Pasta Bowl', unit: 'pcs', currentStock: 3000, costPerUnit: 15 },
    { code: 'PKG_BEVERAGE_CUP', name: 'Beverage Cup', unit: 'pcs', currentStock: 5000, costPerUnit: 8 },
    { code: 'PKG_PAPER_STRAW', name: 'Paper Straw', unit: 'pcs', currentStock: 10000, costPerUnit: 2 },

    // Mandi Packaging
    { code: 'PKG_MANDI_CONTAINER', name: 'Mandi Container', unit: 'pcs', currentStock: 2000, costPerUnit: 15 },
    { code: 'PKG_FOIL', name: 'Aluminium Foil', unit: 'pcs', currentStock: 5000, costPerUnit: 2 },
    { code: 'PKG_SPOON', name: 'Plastic Spoon', unit: 'pcs', currentStock: 10000, costPerUnit: 1 },

    // South Indian Packaging
    { code: 'PKG_BATTER_CONTAINER', name: 'Batter Container', unit: 'pcs', currentStock: 1000, costPerUnit: 10 },
    { code: 'PKG_FOOD_GRADE_CONTAINER', name: 'Food Grade Container', unit: 'pcs', currentStock: 1000, costPerUnit: 12 },
    { code: 'PKG_CHUTNEY_CONTAINER', name: 'Chutney Container', unit: 'pcs', currentStock: 2000, costPerUnit: 5 },
    { code: 'PKG_SAMBHAR_CONTAINER', name: 'Sambhar Container', unit: 'pcs', currentStock: 2000, costPerUnit: 8 },
    { code: 'PKG_BATCH_LABEL', name: 'Batch Label', unit: 'pcs', currentStock: 5000, costPerUnit: 1 },

    // Tandoor Missing PKGs
    { code: 'PKG_ARABIAN_PLATTER', name: 'Arabian Platter', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_KHABOOS', name: 'Khaboos Bread', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_SERVING_PLATE', name: 'Standard Serving Plate', unit: 'pcs', currentStock: 500, costPerUnit: 15 },

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
    const createdPkg = await Packaging.findOneAndUpdate({ code: pkg.code, userId }, { $set: { ...pkg, userId } }, { upsert: true, new: true });
    if(createdPkg) pkgIds[pkg.code] = createdPkg._id as mongoose.Types.ObjectId;
  }

  const dishData = [
    // Indian Curry Non-Veg Menu
    { name: 'Desi Handi Chicken', price: 349, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Desi Handi Mutton', price: 449, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Barrah Masala', price: 359, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mutton Barrah Masala', price: 459, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Butter Chicken', price: 349, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Changezi', price: 369, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Curry', price: 319, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Kali Mirch', price: 349, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Lababdar', price: 359, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Rara', price: 379, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mutton Rara', price: 479, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Pasanda', price: 369, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Tikka Masala', price: 349, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Kadhai Chicken', price: 339, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Murg Hariyali', price: 349, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Murg Mumtaz', price: 379, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Murg Musallam', price: 499, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_OVAL_PLATE'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_OVAL_PLATE'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Murg Patiala', price: 369, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mutton Bhuna Gosht', price: 449, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_IRON_KARAHI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_IRON_KARAHI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mutton Curry', price: 429, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mutton Handi', price: 459, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_CLAY_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CLAY_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mutton Rogan Josh', price: 459, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Nizami Handi', price: 369, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_CLAY_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CLAY_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Saag Chicken', price: 329, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Saag Mutton', price: 439, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_HANDI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Indian Curry Veg Menu
    { name: 'Aloo Gobhi Matar', price: 219, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Corn Palak Cheese', price: 249, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Kadhai Paneer', price: 279, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Lehsunia Paneer', price: 289, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Malai Kofta (Ivory)', price: 299, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Malai Kofta Red', price: 299, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mushroom Do Pyaza', price: 269, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Palak Paneer', price: 279, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Butter Masala', price: 289, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Dhaniya Adraki', price: 289, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Lababdar', price: 299, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Pasanda', price: 319, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Shahi Paneer', price: 289, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Signature Panch-Ratan Curry Veg', price: 329, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Handi', price: 259, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Jalfrezi', price: 249, category: 'Indian Curry', packagingLogic: { takeaway: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_500ML_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Extended Tandoor Menu
    { name: 'Chicken Tikka (6 Pcs)', price: 299, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Chicken (Half)', price: 349, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Chicken (Full)', price: 599, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Malai Tikka (6 Pcs)', price: 329, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Afghani Chicken (Half)', price: 379, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Afghani Chicken (Full)', price: 649, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Seekh Kebab (2 Pcs)', price: 249, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Al Faham Chicken (Whole)', price: 699, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Paneer Tikka', price: 249, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Malai Paneer Tikka', price: 279, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Hariyali Paneer Tikka', price: 259, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Achari Paneer Tikka', price: 259, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Soya Chaap', price: 199, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Malai Soya Chaap', price: 229, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Hariyali Soya Chaap', price: 209, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Achari Soya Chaap', price: 209, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Mushroom', price: 229, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Malai Mushroom', price: 259, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Hariyali Mushroom', price: 239, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Achari Mushroom', price: 239, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Momos (6 Pcs)', price: 179, category: 'Tandoor', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Extended South Indian Menu
    { name: 'Plain Dosa', price: 129, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Masala Dosa', price: 149, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Butter Dosa', price: 159, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mysore Masala Dosa', price: 169, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Dosa', price: 179, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paper Dosa', price: 119, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Plain Rava Dosa', price: 149, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Onion Rava Dosa', price: 159, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Masala Rava Dosa', price: 169, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Rava Dosa', price: 189, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Plain Uttapam', price: 129, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Onion Uttapam', price: 139, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mix-Veg Uttapam', price: 149, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Uttapam', price: 169, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Masala Uttapam', price: 159, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Plain Idli', price: 99, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mini Idli', price: 89, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Butter Idli', price: 119, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Fried Idli', price: 129, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Medu Vada', price: 99, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mini Vada', price: 89, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Sambar Vada', price: 109, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Curd Vada', price: 129, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Idli Vada Combo', price: 149, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'South Indian Combo Meal', price: 249, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Extended Biryani Menu
    { name: 'Mutton Biryani', price: 399, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Biryani', price: 249, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Biryani', price: 279, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Biryani (Family Pack)', price: 799, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mutton Biryani (Family Pack)', price: 999, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Biryani (Family Pack)', price: 699, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Biryani (Family Pack)', price: 749, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Extended Chinese Menu
    { name: 'Veg Hot & Sour', price: 129, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Hot & Sour', price: 149, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Lemon Coriander Soup', price: 129, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Manchow Soup', price: 139, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Manchow Soup', price: 159, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Seafood Manchow Soup', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Spicy Garlic Soup', price: 129, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Steamed Veg Momos', price: 129, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Steamed Chicken Momos', price: 149, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Steamed Cheese Momos', price: 159, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Fried Veg Momos', price: 149, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Fried Chicken Momos', price: 169, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Kurkure Veg Momos', price: 179, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Kurkure Chicken Momos', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Veg Momos', price: 189, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Chicken Momos', price: 209, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chilli Paneer Dry', price: 249, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chilli Chicken Dry', price: 279, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chilli Soya Chaap Dry', price: 229, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chilli Mushroom Dry', price: 239, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chilli Potato Dry', price: 179, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Manchurian Dry', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Manchurian Dry', price: 249, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Honey Chilli Potato', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Honey Chilli Lotus Stem', price: 229, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Crispy Corn', price: 189, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Salt & Pepper', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Lollipop', price: 249, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Crispy Chicken', price: 279, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Crispy', price: 249, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STARTER_BOX'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chilli Paneer Gravy', price: 259, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chilli Chicken Gravy', price: 289, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Manchurian Gravy', price: 209, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Manchurian Gravy', price: 259, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Hakka Noodles', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Hakka Noodles', price: 239, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Fried Rice', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Egg Fried Rice', price: 219, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Fried Rice', price: 249, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Burnt Garlic Rice', price: 209, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Burnt Garlic Noodles', price: 209, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Schezwan Rice', price: 219, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Schezwan Noodles', price: 219, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Schezwan Chicken Rice', price: 259, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_NOODLE_CONTAINER'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'American Chopsuey', price: 249, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chinese Bhel', price: 199, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Crispy Noodle Bowl', price: 229, category: 'Chinese', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'] || pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Extended Cafe Menu
    { name: '10 Inch Farmhouse Pizza', price: 349, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '10 Inch Veggie Supreme Pizza', price: 399, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '10 Inch Paneer Tikka Pizza', price: 399, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '10 Inch Chicken Tikka Pizza', price: 449, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '10 Inch Cheese Burst Pizza', price: 499, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '12 Inch Margherita Pizza', price: 399, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '12 Inch Farmhouse Pizza', price: 449, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '12 Inch Veggie Supreme Pizza', price: 499, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '12 Inch Paneer Tikka Pizza', price: 499, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '12 Inch Chicken Tikka Pizza', price: 549, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: '12 Inch Cheese Burst Pizza', price: 599, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Aloo Tikki Burger', price: 99, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Crispy Veg Burger', price: 129, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Zinger Burger', price: 199, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Tandoori Paneer Burger', price: 179, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Burger', price: 159, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Peri-Peri Paneer Wrap', price: 199, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Crispy Chicken Wrap', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Zing Crunchy Roll', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Club Sandwich', price: 149, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Corn & Cheese Sandwich', price: 179, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Peri-Peri Paneer Sandwich', price: 199, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Crispy Chicken Sandwich', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Grill Sandwich', price: 159, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'White Sauce Penne', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'White Sauce Fusilli', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Alfredo Pasta', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mushroom Alfredo', price: 279, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Alfredo Pasta', price: 299, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Arrabbiata Pasta', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Red Sauce Penne', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Red Sauce Fusilli', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Spicy Marinara Pasta', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Pink Penne', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Pink Fusilli', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Pink Pasta', price: 279, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Classic Garlic Bread', price: 129, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Cheese Garlic Bread', price: 159, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Peri Peri French Fries', price: 129, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Nuggets', price: 179, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Paneer Grill', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Grill', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Crispy Strips', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chicken Wings', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Leg Piece', price: 149, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Chocolate Shake', price: 169, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mango Shake', price: 179, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Strawberry Shake', price: 179, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Oreo Shake', price: 199, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'KitKat Shake', price: 199, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Hazelnut Shake', price: 229, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Mocha', price: 189, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Biryani Dishes
    { name: 'Chicken Biryani', price: 349, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONTAINER'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // C-500 Cafe Dishes
    { name: '10 Inch Margherita Pizza', price: 299, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Classic Burger', price: 149, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Veg Wrap', price: 179, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'French Fries (Cafe)', price: 99, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Popcorn Chicken (Cafe)', price: 199, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BUCKET'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Pink Sauce Pasta (Cafe)', price: 249, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Vanilla Shake (Cafe)', price: 149, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_PAPER_STRAW']] } },
    { name: 'Cold Coffee (Cafe)', price: 169, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_PAPER_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BEVERAGE_CUP'], pkgIds['PKG_PAPER_STRAW']] } },

    // Mandi Dishes
    { name: 'Chicken White Mandi', price: 399, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mutton White Mandi', price: 599, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },

    // South Indian Dishes
    { name: 'Regular Idli', price: 99, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },

    // Tandoor Dishes
    { name: 'Chicken Tikka', price: 299, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Chicken Half', price: 349, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Chicken Full', price: 599, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Chicken Malai Tikka', price: 329, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Afghani Chicken Half', price: 369, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Afghani Chicken Full', price: 629, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Chicken Seekh Kebab', price: 289, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Al Faham Chicken', price: 649, category: 'Tandoor Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    // Veg Tandoor
    { name: 'Tandoori Paneer', price: 249, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Chaap', price: 229, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Tandoori Momos', price: 199, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    { name: 'Malai Paneer', price: 269, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Chaap', price: 249, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    { name: 'Hariyali Paneer', price: 259, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Hariyali Chaap', price: 239, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    
    { name: 'Achari Paneer', price: 269, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Achari Chaap', price: 249, category: 'Veg Starter', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },

    { name: 'Aloo Gobhi Matar (Semi-Gravy)', price: 250, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Navratan Korma', price: 350, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
  ];

  const dishIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const dish of dishData) {
    const createdDish = await Dish.findOneAndUpdate({ name: dish.name, userId }, { $set: { ...dish, userId, isInventoryLinked: true, ingredientPrice: Math.floor(dish.price * 0.35) } }, { upsert: true, new: true });
    if(createdDish) dishIds[dish.name] = createdDish._id as mongoose.Types.ObjectId;
  }

  const dishRecipeMappings: Record<string, { itemModel: string, code: string, quantity: number }[]> = {
    // Indian Curry Non-Veg Recipes
    'Desi Handi Chicken': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 } ],
    'Desi Handi Mutton': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 } ],
    'Chicken Barrah Masala': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 } ],
    'Mutton Barrah Masala': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 } ],
    'Butter Chicken': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 150 } ],
    'Chicken Changezi': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 } ],
    'Chicken Curry': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 } ],
    'Chicken Kali Mirch': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 150 } ],
    'Chicken Lababdar': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 150 } ],
    'Chicken Rara': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 } ],
    'Mutton Rara': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 } ],
    'Chicken Pasanda': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 150 } ],
    'Chicken Tikka Masala': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 150 } ],
    'Kadhai Chicken': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 150 } ],
    'Murg Hariyali': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 150 } ],
    'Murg Mumtaz': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 } ],
    'Murg Musallam': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 } ],
    'Murg Patiala': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 } ],
    'Mutton Bhuna Gosht': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 150 } ],
    'Mutton Curry': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 } ],
    'Mutton Handi': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 } ],
    'Mutton Rogan Josh': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 } ],
    'Chicken Nizami Handi': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 150 } ],
    'Saag Chicken': [ { itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 150 } ],
    'Saag Mutton': [ { itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 150 } ],

    // Indian Curry Veg Recipes
    'Aloo Gobhi Matar': [ { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 }, { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 80 }, { itemModel: 'RawMaterial', code: 'RM_CAULIFLOWER', quantity: 80 } ],
    'Corn Palak Cheese': [ { itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 140 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 60 } ],
    'Kadhai Paneer': [ { itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 } ],
    'Lehsunia Paneer': [ { itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 160 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 40 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 } ],
    'Malai Kofta (Ivory)': [ { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_KOFTA', quantity: 4 } ],
    'Malai Kofta Red': [ { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 120 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 80 }, { itemModel: 'RawMaterial', code: 'RM_KOFTA', quantity: 2 } ],
    'Mushroom Do Pyaza': [ { itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 120 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 80 }, { itemModel: 'RawMaterial', code: 'RM_MUSHROOM', quantity: 120 } ],
    'Palak Paneer': [ { itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 } ],
    'Paneer Butter Masala': [ { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 } ],
    'Paneer Dhaniya Adraki': [ { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 140 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 60 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 } ],
    'Paneer Lababdar': [ { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 140 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 60 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 } ],
    'Paneer Pasanda': [ { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 160 }, { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 40 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 } ],
    'Shahi Paneer': [ { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 200 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 } ],
    'Signature Panch-Ratan Curry Veg': [ { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 80 }, { itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 60 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 60 }, { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 40 } ],
    'Veg Handi': [ { itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 80 }, { itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 60 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 60 } ],
    'Veg Jalfrezi': [ { itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 120 }, { itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 80 } ],

    // Extended Tandoor Recipes
    'Chicken Tikka (6 Pcs)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 210 } ],
    'Tandoori Chicken (Half)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 500 } ],
    'Tandoori Chicken (Full)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 1000 } ],
    'Chicken Malai Tikka (6 Pcs)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 210 } ],
    'Afghani Chicken (Half)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 500 } ],
    'Afghani Chicken (Full)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 1000 } ],
    'Chicken Seekh Kebab (2 Pcs)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_SEEKH_T606', quantity: 90 } ],
    'Al Faham Chicken (Whole)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_AL_FAHAM_T607', quantity: 1 } ],
    'Tandoori Paneer Tikka': [ { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 } ],
    'Malai Paneer Tikka': [ { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 } ],
    'Hariyali Paneer Tikka': [ { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 } ],
    'Achari Paneer Tikka': [ { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_ACHARI_PASTE', quantity: 60 } ],
    'Tandoori Soya Chaap': [ { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 } ],
    'Malai Soya Chaap': [ { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 } ],
    'Hariyali Soya Chaap': [ { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 } ],
    'Achari Soya Chaap': [ { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_ACHARI_PASTE', quantity: 60 } ],
    'Tandoori Mushroom': [ { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 } ],
    'Malai Mushroom': [ { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 } ],
    'Hariyali Mushroom': [ { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 } ],
    'Achari Mushroom': [ { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_ACHARI_PASTE', quantity: 60 } ],
    'Tandoori Momos (6 Pcs)': [ { itemModel: 'RawMaterial', code: 'RM_VEG_MOMOS', quantity: 6 }, { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 } ],

    // Extended South Indian Recipes
    'Plain Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Masala Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 }, { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 } ],
    'Butter Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Mysore Masala Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 }, { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 } ],
    'Cheese Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Paper Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Plain Rava Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Onion Rava Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Masala Rava Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 }, { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 } ],
    'Cheese Rava Dosa': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Plain Uttapam': [ { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER', quantity: 180 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Onion Uttapam': [ { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER', quantity: 180 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Mix-Veg Uttapam': [ { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER', quantity: 180 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Cheese Uttapam': [ { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER', quantity: 180 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Masala Uttapam': [ { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER', quantity: 180 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 }, { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 } ],
    'Plain Idli': [ { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Mini Idli': [ { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Butter Idli': [ { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Fried Idli': [ { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Medu Vada': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 70 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Mini Vada': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 70 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Sambar Vada': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 70 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Curd Vada': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 70 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'Idli Vada Combo': [ { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],
    'South Indian Combo Meal': [ { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }, { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }, { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 } ],

    // Extended Biryani Recipes
    'Mutton Biryani': [ { itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: 350 } ],
    'Veg Biryani': [ { itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: 350 } ],
    'Paneer Biryani': [ { itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: 350 } ],
    'Chicken Biryani (Family Pack)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: 1400 } ],
    'Mutton Biryani (Family Pack)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: 1400 } ],
    'Veg Biryani (Family Pack)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: 1400 } ],
    'Paneer Biryani (Family Pack)': [ { itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: 1400 } ],

    // Extended Chinese Recipes
    'Veg Hot & Sour': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Chicken Hot & Sour': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Lemon Coriander Soup': [ { itemModel: 'SemiFinishedGood', code: 'SFG_SOUP_BASE', quantity: 120 } ],
    'Veg Manchow Soup': [ { itemModel: 'SemiFinishedGood', code: 'SFG_SOUP_BASE', quantity: 120 } ],
    'Chicken Manchow Soup': [ { itemModel: 'SemiFinishedGood', code: 'SFG_SOUP_BASE', quantity: 120 } ],
    'Seafood Manchow Soup': [ { itemModel: 'SemiFinishedGood', code: 'SFG_SOUP_BASE', quantity: 120 } ],
    'Spicy Garlic Soup': [ { itemModel: 'SemiFinishedGood', code: 'SFG_SOUP_BASE', quantity: 120 } ],
    'Steamed Veg Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Steamed Chicken Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Steamed Cheese Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Fried Veg Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Fried Chicken Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Kurkure Veg Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Kurkure Chicken Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Tandoori Veg Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Tandoori Chicken Momos': [ { itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 } ],
    'Chilli Paneer Dry': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Chilli Chicken Dry': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Chilli Soya Chaap Dry': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Chilli Mushroom Dry': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Chilli Potato Dry': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Veg Manchurian Dry': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Chicken Manchurian Dry': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Honey Chilli Potato': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Honey Chilli Lotus Stem': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Crispy Corn': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Salt & Pepper': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Chicken Lollipop': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Crispy Chicken': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Paneer Crispy': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Chilli Paneer Gravy': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Chilli Chicken Gravy': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Veg Manchurian Gravy': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Chicken Manchurian Gravy': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 } ],
    'Veg Hakka Noodles': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Chicken Hakka Noodles': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Veg Fried Rice': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Egg Fried Rice': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Chicken Fried Rice': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Burnt Garlic Rice': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Burnt Garlic Noodles': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Schezwan Rice': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Schezwan Noodles': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'Schezwan Chicken Rice': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 } ],
    'American Chopsuey': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Chinese Bhel': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],
    'Crispy Noodle Bowl': [ { itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 } ],

    // Extended Cafe Recipes
    '10 Inch Farmhouse Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '10 Inch Veggie Supreme Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '10 Inch Paneer Tikka Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '10 Inch Chicken Tikka Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '10 Inch Cheese Burst Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '12 Inch Margherita Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '12 Inch Farmhouse Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '12 Inch Veggie Supreme Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '12 Inch Paneer Tikka Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '12 Inch Chicken Tikka Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    '12 Inch Cheese Burst Pizza': [ { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 } ],
    'Aloo Tikki Burger': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 } ],
    'Crispy Veg Burger': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 } ],
    'Chicken Zinger Burger': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 } ],
    'Tandoori Paneer Burger': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 } ],
    'Cheese Burger': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 } ],
    'Peri-Peri Paneer Wrap': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 } ],
    'Crispy Chicken Wrap': [ { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 } ],
    'Zing Crunchy Roll': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Veg Club Sandwich': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Corn & Cheese Sandwich': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Peri-Peri Paneer Sandwich': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Crispy Chicken Sandwich': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Cheese Grill Sandwich': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'White Sauce Penne': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'White Sauce Fusilli': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Alfredo Pasta': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 } ],
    'Mushroom Alfredo': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Cheese Alfredo Pasta': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 } ],
    'Arrabbiata Pasta': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 } ],
    'Red Sauce Penne': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Red Sauce Fusilli': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Spicy Marinara Pasta': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 } ],
    'Pink Penne': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Pink Fusilli': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Cheese Pink Pasta': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 } ],
    'Classic Garlic Bread': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Cheese Garlic Bread': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Peri Peri French Fries': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Chicken Nuggets': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Paneer Grill': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Chicken Grill': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Crispy Strips': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Chicken Wings': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Leg Piece': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Chocolate Shake': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Mango Shake': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Strawberry Shake': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Oreo Shake': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'KitKat Shake': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Hazelnut Shake': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],
    'Mocha': [ { itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 } ],

    'Chicken Biryani': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_BIRYANI', quantity: 350 }
    ],

    '10 Inch Margherita Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_10_INCH_PIZZA_BASE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_LIQUID_CHEESE', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Classic Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Veg Wrap': [
      { itemModel: 'RawMaterial', code: 'RM_TORTILLA', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TANDOORI_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'French Fries (Cafe)': [
      { itemModel: 'RawMaterial', code: 'RM_FRENCH_FRIES', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 12 }
    ],
    'Popcorn Chicken (Cafe)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_COATED_CHICKEN_C510', quantity: 240 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Pink Sauce Pasta (Cafe)': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA_C500', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_WATER', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Vanilla Shake (Cafe)': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_ICE_CUBES', quantity: 30 }
    ],
    'Cold Coffee (Cafe)': [
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_INSTANT_COFFEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_ICE_CUBES', quantity: 30 }
    ],

    'Chicken White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_RICE', quantity: 500 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_STEAMED_CHICKEN_MANDI', quantity: 1 }
    ],
    'Mutton White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_RICE', quantity: 500 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_STEAMED_MUTTON_MANDI', quantity: 1 }
    ],

    'Regular Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 120 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],

    'Chicken Tikka': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chicken Half': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chicken Full': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Chicken Malai Tikka': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Afghani Chicken Half': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Afghani Chicken Full': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Chicken Seekh Kebab': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_SEEKH_T606', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Al Faham Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_ALFAHAM_T607', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'Packaging', code: 'PKG_ARABIAN_PLATTER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_KHABOOS', quantity: 1 }
    ],
    'Tandoori Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Momos': [
      { itemModel: 'RawMaterial', code: 'RM_VEG_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MOMO_CHUTNEY', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_CUBES', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],

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
  };

  for (const dish of dishData) {
    if (dishRecipeMappings[dish.name]) {
      const ingredients = dishRecipeMappings[dish.name].map(ing => ({
        itemModel: ing.itemModel,
        itemId: portionIds[ing.code] || sfgIds[ing.code] || rmIds[ing.code] || pkgIds[ing.code] || (() => { console.error('MISSING ITEM ID FOR', ing.code, 'IN', dish.name); return undefined; })(),
        quantity: ing.quantity
      }));
      await Recipe.findOneAndUpdate(
        { targetModel: 'Dish', targetId: dishIds[dish.name], userId },
        { $set: { ingredients, targetYield: 1, operationalYield: 1, userId } },
        { upsert: true, new: true }
      );
    }
  }
};
