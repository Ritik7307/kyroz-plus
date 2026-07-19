import mongoose from 'mongoose';
import RawMaterial from '../models/RawMaterial';
import SemiFinishedGood from '../models/SemiFinishedGood';
import Packaging from '../models/Packaging';
import Dish from '../models/Dish';
import Recipe from '../models/Recipe';
import Inventory from '../models/Inventory';

export const seedBlueprints = async (userId: string | mongoose.Types.ObjectId): Promise<void> => {
  // Raw Materials
  const rmData = [
    { code: 'RM_C506', name: 'C-506 Marinara Core', category: 'Sauce Core', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 250 },
    { code: 'RM_C505', name: 'C-505 Alfredo Core', category: 'Sauce Core', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 300 },
    { code: 'RM_C501', name: 'C-501 Dough Master', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 180 },
    { code: 'RM_C504', name: 'C-504 Herb Infusion', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_BUTTER', name: 'Butter', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 500 },
    // Nizami and Saagwala Additions
    { code: 'RM_BIRISTA', name: 'Birista (Fried Onion)', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 250 },
    { code: 'RM_FRIED_CASHEW', name: 'Fried Cashew', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_SHAHI_JEERA', name: 'Shahi Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    // Indo-Chinese Additions
    { code: 'RM_Z105', name: 'Z-105 TANGY COAT Premix', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_Z102', name: 'Z-102 CRYSTAL GLAZE Premix', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_Z102_LIQUID', name: 'Z-102 CRYSTAL GLAZE Liquid', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_Z101', name: 'Z-101 DARK MASTER Premix', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_Z101_LIQUID', name: 'Z-101 DARK MASTER Liquid', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_CRISPY_NOODLE_NEST', name: 'Crispy Fried Noodle Nest', category: 'Grocery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 100, costPerPurchaseUnit: 20 },
    { code: 'RM_TOMATO_KETCHUP', name: 'Tomato Ketchup', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    // Mandi Additions
    { code: 'RM_CHICKEN_LG_THIGH', name: 'Chicken LG + Thigh', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_SELLA_RICE', name: 'Long Grain/Sella Rice', category: 'Grain', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_B404_A', name: 'B-404 A Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50, costPerPurchaseUnit: 200 },
    { code: 'RM_B404_B', name: 'B-404 B Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 50, costPerPurchaseUnit: 200 },
    { code: 'RM_COAL', name: 'Coal', category: 'Fuel', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    // Schezwan & Wok Additions
    { code: 'RM_Z103', name: 'Z-103 RED FIRE BATCH Powder', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_Z104', name: 'Z-104 VOK DUST Powder', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_DARK_SOY_SAUCE', name: 'Dark Soy Sauce', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_JULIENNE_VEG', name: 'Mixed Julienne Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_CHICKEN_LOLLIPOP_RAW', name: 'Raw Chicken Lollipop', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_MUSHROOM', name: 'Mushroom', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_CORNFLOUR_SLURRY', name: 'Cornflour Slurry', category: 'Grocery', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_PINEAPPLE_PIECES', name: 'Pineapple Pieces', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    // Finishing Oils & Momos
    { code: 'RM_TEJA_CHILLI_FLAKES', name: 'Teja Chilli Flakes', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_KASHMIRI_CHILLI_POWDER', name: 'Kashmiri Chilli Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'RM_STAR_ANISE', name: 'Star Anise', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    // Indian Veg Costing RM
    { code: 'RM_PRE_FRIED_POTATO_CUBES', name: 'Pre-fried Potato Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_PRE_FRIED_CAULIFLOWER_FLORETS', name: 'Pre-fried Cauliflower Florets', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_BOILED_GREEN_PEAS', name: 'Boiled Green Peas', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_HING', name: 'Hing', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_K801', name: 'K-801 ROYAL PUNCH', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_K806', name: 'K-806 ZESTFUL ZING', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 650 },
    { code: 'RM_K802', name: 'K-802 WOK SPICE', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 500 },
    { code: 'RM_KASOORI_METHI', name: 'Kasoori Methi', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 300 },
    { code: 'RM_CRUSHED_BLACK_PEPPER', name: 'Crushed Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 800 },
    { code: 'RM_FRESH_CORIANDER', name: 'Fresh Coriander', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_GINGER_JULIENNES', name: 'Ginger Juliennes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 150 },
    { code: 'RM_BOILED_SWEET_CORN', name: 'Boiled Sweet Corn', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_PANEER_CUBES', name: 'Paneer Cubes', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_PROCESSED_CHEESE', name: 'Processed Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_FRESH_CREAM', name: 'Fresh Cream', category: 'Dairy', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_SUGAR', name: 'Sugar', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_CAPSICUM_ONION_STOCK', name: 'Capsicum/Onion Stock', category: 'Liquid', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 40 },
    { code: 'RM_CURD', name: 'Curd', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_GRATED_PANEER', name: 'Grated Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_CHOPPED_GARLIC', name: 'Chopped Garlic', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_PREMIUM_FRIED_KOFTA', name: 'Premium Fried Stuffed Paneer Kofta', category: 'Grocery', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 1000, costPerPurchaseUnit: 15 },
    { code: 'RM_GREEN_CARDAMOM', name: 'Green Cardamom', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 2500 },
    { code: 'RM_MACE', name: 'Mace', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 3000 },
    { code: 'RM_ALMOND_FLAKES', name: 'Almond Flakes', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 1000 },
    { code: 'RM_GRATED_KHOYA', name: 'Grated Khoya', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },
    { code: 'RM_SALT', name: 'Salt', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 20 },
    { code: 'RM_FROZEN_VEG_MOMOS', name: 'Frozen Veg Momos', category: 'Frozen', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 5 },
    { code: 'RM_FROZEN_CHICKEN_MOMOS', name: 'Frozen Chicken Momos', category: 'Frozen', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 5000, costPerPurchaseUnit: 7 },
    { code: 'RM_Z106', name: 'Z-106 ARMOUR BASE', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_Z107', name: 'Z-107 RUBY CONCENTRATE', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_MAYONNAISE', name: 'Mayonnaise', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CORNFLAKES', name: 'Cornflakes', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_FRIED_PANEER', name: 'Fried Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_FRIED_SOYA_CHAAP', name: 'Fried Soya Chaap', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_SPRING_ONION', name: 'Spring Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_FRIED_VEG_MANCHURIAN_BALLS', name: 'Fried Veg Manchurian Balls', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 200 },
    { code: 'RM_FRIED_CHICKEN_MANCHURIAN', name: 'Fried Chicken Manchurian', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_DOUBLE_FRIED_POTATO', name: 'Double Fried Potato Fingers', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_HONEY', name: 'Honey', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_WHITE_SESAME', name: 'White Sesame', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_MIXED_SOUP_VEGETABLES', name: 'Mixed Soup Vegetables', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_VINEGAR', name: 'Vinegar', category: 'Condiment', purchaseUnit: 'L', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 60 },
    { code: 'RM_RED_CHILLI_PASTE', name: 'Red Chilli Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_FRESH_GARLIC', name: 'Fresh Garlic', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_FRESH_GINGER', name: 'Fresh Ginger', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CORIANDER_STEMS', name: 'Coriander Stems', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_FRIED_NOODLES', name: 'Fried Noodles', category: 'Grocery', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },
    { code: 'RM_MILK', name: 'Milk', category: 'Dairy', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 60 },
    { code: 'RM_MAYO', name: 'Mayo', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 150 },
    { code: 'RM_C510', name: 'C-510 Zing Master', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_MAIDA', name: 'Maida', category: 'Flour', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 40 },
    { code: 'RM_FRYING_OIL', name: 'Frying Oil', category: 'Fat', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 120 },
    { code: 'RM_CHICKEN_LEG', name: 'Chicken Leg Pieces', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 220 },
    { code: 'RM_CHICKEN_WINGS', name: 'Chicken Wings', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 200 },
    { code: 'RM_KETCHUP', name: 'Ketchup', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 100 },
    { code: 'RM_C503', name: 'C-503 Velvet Glaze', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_LIQUID_CHEESE', name: 'Liquid Cheese', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_BREAD', name: 'Bread', category: 'Bakery', purchaseUnit: 'loaf', consumptionUnit: 'slices', conversionFactor: 20, currentStock: 50, costPerPurchaseUnit: 40 },
    { code: 'RM_MAIN_FILLING', name: 'Main Filling', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 150 },
    { code: 'RM_CHEESE', name: 'Cheese Slice', category: 'Dairy', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 50, currentStock: 100, costPerPurchaseUnit: 400 },
    { code: 'RM_C509', name: 'C-509 Fire Dust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_PATTY_MIX', name: 'Base Patty Mix', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_BREADCRUMBS', name: 'Breadcrumbs / Coating', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_COFFEE_PREMIX', name: 'Coffee Premix', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    // Indian Gravies 3
    { code: 'RM_G203', name: 'G-203 Emerald Mix', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_DRY_RED_CHILLI', name: 'Dry Red Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 300 },
    { code: 'RM_FRESH_MINT', name: 'Fresh Mint', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 80 },
    { code: 'RM_CARDAMOM_POWDER', name: 'Cardamom Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 2500 },
    { code: 'RM_DRY_FRUITS', name: 'Dry Fruits (Cashew/Almond)', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_SAFFRON_MILK', name: 'Saffron Milk', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_BOILED_EGG', name: 'Boiled Egg', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 20, currentStock: 100, costPerPurchaseUnit: 120 },
    { code: 'RM_PRECOOKED_HARIYALI_TIKKA', name: 'Pre-cooked Hariyali Tikka', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_CAPSICUM_CUBES', name: 'Capsicum Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 70 },
    { code: 'RM_ONION_CUBES', name: 'Onion Cubes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 50 },
    // Mutton & Specialized Ingredients
    { code: 'RM_EGG_RAW', name: 'Raw Egg', category: 'Dairy', purchaseUnit: 'pcs', consumptionUnit: 'pcs', conversionFactor: 1, currentStock: 500, costPerPurchaseUnit: 6 },
    { code: 'RM_PRECOOKED_MUTTON', name: 'Pre-cooked Mutton', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 800 },
    { code: 'RM_WHOLE_SPICES', name: 'Whole Spices', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1000 },
    { code: 'RM_MUTTON_STOCK', name: 'Mutton Stock', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_CINNAMON', name: 'Cinnamon', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 800 },
    { code: 'RM_WHOLE_RED_CHILLI', name: 'Whole Red Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 500, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_BAY_LEAF', name: 'Bay Leaf', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 500, currentStock: 1000, costPerPurchaseUnit: 200 },
    { code: 'RM_FINE_CHOPPED_ONION', name: 'Fine Chopped Onion', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_FINE_CHOPPED_TOMATO', name: 'Fine Chopped Tomato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_DRY_GINGER_POWDER', name: 'Dry Ginger Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 400 },
    { code: 'RM_FENNEL_POWDER', name: 'Fennel Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 300 },
    { code: 'RM_KEWRA_WATER', name: 'Kewra Water', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 200 },
    { code: 'RM_RATAN_JOT_OIL', name: 'Ratan Jot Oil', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 500 },
    { code: 'RM_CHOCO_SYRUP', name: 'Chocolate Syrup', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 240 },
    { code: 'RM_VANILLA_CORE', name: 'Vanilla Flavor Core', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_STRAWBERRY_CORE', name: 'Strawberry Flavor Core', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 300 },
    { code: 'RM_SUGAR', name: 'Sugar', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 25000, costPerPurchaseUnit: 45 },
    { code: 'RM_COASTAL_CRUST', name: 'S-301 Coastal Crust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 90 },
    { code: 'RM_CHICKEN_RAW', name: 'Chicken Raw', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 220 },
    { code: 'RM_RICE_RAW', name: 'Rice Raw', category: 'Grain', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 80 },
    { code: 'RM_DAHI_RAW', name: 'Dahi Raw', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 60 },
    { code: 'RM_OIL_GHEE', name: 'Oil / Ghee', category: 'Fat', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 180 },
    { code: 'RM_B401_PREMIX', name: 'B-401 Premix', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },
    { code: 'RM_BURGER_BUN', name: 'Burger Bun', category: 'Bakery', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 6, currentStock: 100, costPerPurchaseUnit: 30 },
    { code: 'RM_WRAP_SHEET', name: 'Wrap Sheet', category: 'Bakery', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 10, currentStock: 50, costPerPurchaseUnit: 80 },
    { code: 'RM_PASTA_RAW', name: 'Pasta Penne / Fusilli Raw', category: 'Grain', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 100 },
    { code: 'RM_POTATO', name: 'Potato', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 25000, costPerPurchaseUnit: 30 },
    { code: 'RM_S302_TEMPER', name: 'S-302 Yellow Temper', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 200 },
    { code: 'RM_S303_RAVA', name: 'S-303 Rava Pearl', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 120 },
    { code: 'RM_S304_CRUNCH', name: 'S-304 Crunch Core', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 160 },
    { code: 'RM_S305_STEAM', name: 'S-305 Steam Cloud', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 140 },
    { code: 'RM_S306_TANGY', name: 'S-306 Tangy Tropic', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 190 },
    { code: 'RM_S307_KERNEL', name: 'S-307 Kerala Kernel', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 15000, costPerPurchaseUnit: 220 },
    { code: 'RM_S308_LENTIL', name: 'S-308 Lentil Lava', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_MIXED_VEG', name: 'Mixed Veggies', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 60 },
    { code: 'RM_B404A_PREMIX', name: 'B-404 A Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 160 },
    { code: 'RM_B404B_PREMIX', name: 'B-404 B Premix', category: 'Premix', purchaseUnit: 'packet', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 20000, costPerPurchaseUnit: 140 },
    { code: 'RM_MUTTON_RAW', name: 'Mutton Raw', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 600 },
    
    // New Raw Materials
    { code: 'RM_CHEESE_BLEND', name: 'Cheese Blend', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 450 },
    { code: 'RM_PANEER_RAW', name: 'Paneer Raw', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_CORN_RAW', name: 'Corn Raw', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 80 },
    { code: 'RM_FRIES_RAW', name: 'Fries Raw', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 150 },
    { code: 'RM_C502_GRILL_DUST', name: 'C-502 Grill Dust', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 350 },
    { code: 'RM_C507_SNOW_BASE', name: 'C-507 Snow Base', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 400 },
    { code: 'RM_C508_COCOA_BASE', name: 'C-508 Cocoa Base', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 450 },
    { code: 'RM_CHICKEN_MINCE', name: 'Chicken Mince', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 240 },
    { code: 'RM_MANGO_SYRUP', name: 'Mango Syrup', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 250 },
    { code: 'RM_HAZELNUT_SYRUP', name: 'Hazelnut Syrup', category: 'Premix', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_COFFEE_POWDER', name: 'Coffee Powder', category: 'Premix', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_OREO_ADDON', name: 'Oreo', category: 'Premix', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 5, currentStock: 100, costPerPurchaseUnit: 20 },
    { code: 'RM_KITKAT_ADDON', name: 'KitKat', category: 'Premix', purchaseUnit: 'pack', consumptionUnit: 'pcs', conversionFactor: 5, currentStock: 100, costPerPurchaseUnit: 30 },
    { code: 'RM_CHICKEN_BREAST', name: 'Chicken Breast', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 280 },

    // Indian Gravy & Spices
    { code: 'RM_G205', name: 'G-205 Royal Rogan', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 150 },
    { code: 'RM_G204', name: 'G-204 Roasted Rust', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 160 },
    { code: 'RM_G201', name: 'G-201 Sunset Base', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 180 },
    { code: 'RM_G202', name: 'G-202 Ivory Base', category: 'Gravy Base', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 10000, costPerPurchaseUnit: 200 },
    { code: 'RM_K801', name: 'K-801 Royal Punch', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 500 },
    { code: 'RM_K802', name: 'K-802 Wok Spice', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 450 },
    { code: 'RM_K806', name: 'K-806 Zestful Zing', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 480 },
    { code: 'RM_DESI_GHEE', name: 'Desi Ghee', category: 'Fat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 600 },
    { code: 'RM_MUSTARD_OIL', name: 'Mustard Oil', category: 'Fat', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 180 },
    { code: 'RM_SHAHI_JEERA', name: 'Shahi Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_TEJ_PATTA', name: 'Tej Patta', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 500, currentStock: 500, costPerPurchaseUnit: 200 },
    { code: 'RM_BLACK_CARDAMOM', name: 'Black Cardamom', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 400, currentStock: 400, costPerPurchaseUnit: 1200 },
    { code: 'RM_CLOVES', name: 'Cloves', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 900 },
    { code: 'RM_GINGER_GARLIC_PASTE', name: 'Ginger Garlic Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 120 },
    { code: 'RM_CURD', name: 'Curd', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 80 },
    { code: 'RM_BLACK_PEPPER', name: 'Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_CORIANDER_POWDER', name: 'Coriander Powder', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 250 },
    { code: 'RM_KASHMIRI_CHILLI', name: 'Kashmiri Chilli', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 450 },
    { code: 'RM_FRESH_CORIANDER', name: 'Fresh Coriander', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_GINGER_JULIENNES', name: 'Ginger Juliennes', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 100 },
    { code: 'RM_MEAT_STOCK', name: 'Meat Stock', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 50 },
    { code: 'RM_GREEN_CHILLI', name: 'Green Chilli', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 80 },
    { code: 'RM_LEMON_JUICE', name: 'Lemon Juice', category: 'Liquid', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 150 },
    { code: 'RM_FRESH_CREAM', name: 'Fresh Cream', category: 'Dairy', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 3000, costPerPurchaseUnit: 200 },
    { code: 'RM_KASOORI_METHI', name: 'Kasoori Methi', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 500, costPerPurchaseUnit: 350 },
    { code: 'RM_PRECOOKED_TANDOORI_CHICKEN', name: 'Pre-cooked Tandoori Chicken', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_PRECOOKED_TANDOORI_BARRAH', name: 'Pre-cooked Tandoori Barrah', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 600 },

    // More Indian Spices & Ingredients
    { code: 'RM_GREEN_CARDAMOM', name: 'Green Cardamom', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 400, currentStock: 400, costPerPurchaseUnit: 1500 },
    { code: 'RM_WHOLE_GREEN_CHILLI', name: 'Whole Green Chilli', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'pcs', conversionFactor: 300, currentStock: 500, costPerPurchaseUnit: 80 },
    { code: 'RM_WHOLE_BLACK_PEPPER', name: 'Whole Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 900 },
    { code: 'RM_CRUSHED_BLACK_PEPPER', name: 'Crushed Black Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 950 },
    { code: 'RM_CHOPPED_CAPSICUM', name: 'Chopped Capsicum', category: 'Vegetable', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 60 },
    { code: 'RM_GRATED_PANEER', name: 'Grated Paneer', category: 'Dairy', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 350 },
    { code: 'RM_KITCHEN_KING', name: 'Kitchen King Masala', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 400 },
    { code: 'RM_KEEMA_RAW', name: 'Raw Keema', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 450 },
    { code: 'RM_JEERA', name: 'Jeera', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 350 },
    { code: 'RM_ALMOND_PASTE', name: 'Almond Paste', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 800 },
    { code: 'RM_WHITE_PEPPER', name: 'White Pepper', category: 'Spice', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 1000, costPerPurchaseUnit: 1200 },
    { code: 'RM_PRECOOKED_CHICKEN_TIKKA', name: 'Pre-cooked Chicken Tikka', category: 'Meat', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 400 },

  ];

  const rmIds: any = {};
  for (const rm of rmData) {
    const doc = await (RawMaterial as any).findOneAndUpdate(
      { code: rm.code, userId },
      { 
        $set: { 
          name: rm.name,
          category: rm.category,
          purchaseUnit: rm.purchaseUnit,
          consumptionUnit: rm.consumptionUnit,
          conversionFactor: rm.conversionFactor,
          costPerPurchaseUnit: rm.costPerPurchaseUnit
        },
        $setOnInsert: { currentStock: rm.currentStock, userId }
      },
      { upsert: true, new: true }
    );
    rmIds[rm.code] = doc._id;
  }

  // Packaging
  const pkgData = [
    { code: 'PKG_PIZZA_BOX', name: 'Pizza Box', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    // Copper Kadhai / Oval Plate
    { code: 'PKG_COPPER_KADHAI', name: 'Copper Kadhai / Round Handi', unit: 'pcs', currentStock: 500, costPerUnit: 40 },
    // Black Bowl
    { code: 'PKG_BLACK_BOWL', name: 'Black Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 35 },
    // Chinese PKG
    { code: 'PKG_CHINESE_BOWL', name: 'Chinese Bowl/Container', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_SOUP_BOWL', name: 'Soup Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_SOUP_LID', name: 'Soup Lid', unit: 'pcs', currentStock: 500, costPerUnit: 5 },
    { code: 'PKG_LARGE_SHALLOW_BOWL', name: 'Large Shallow Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 30 },
    // Momos PKG
    { code: 'PKG_SNACK_BOX', name: 'Snack Box', unit: 'pcs', currentStock: 500, costPerUnit: 15 },
    { code: 'PKG_SAUCE_CUP', name: 'Sauce Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    // South Indian PKG
    { code: 'PKG_SOUTH_INDIAN_CONTAINER', name: 'South Indian Container', unit: 'pcs', currentStock: 1000, costPerUnit: 15 },
    // Mandi PKG
    { code: 'PKG_MANDI_CONTAINER', name: 'Mandi Container', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_FOIL', name: 'Foil', unit: 'pcs', currentStock: 1000, costPerUnit: 5 },
    { code: 'PKG_SPOON', name: 'Spoon', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_OVAL_PLATE', name: 'Oval Plate / Handi', unit: 'pcs', currentStock: 500, costPerUnit: 35 },
    { code: 'PKG_TAKEAWAY_CONTAINER', name: 'Takeaway Container', unit: 'pcs', currentStock: 1000, costPerUnit: 10 },
    // Iron & Clay
    { code: 'PKG_IRON_KARAHI', name: 'Iron Karahi / Plate', unit: 'pcs', currentStock: 500, costPerUnit: 50 },
    { code: 'PKG_CLAY_HANDI', name: 'Clay Handi / Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 40 },
    { code: 'PKG_PASTA_BOWL', name: 'Pasta Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_DIP_CUP', name: 'Dip Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_WING_BOX', name: 'Wing Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_STRIP_BOX', name: 'Strip Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_POPCORN_BOX', name: 'Popcorn Box', unit: 'pcs', currentStock: 500, costPerUnit: 6 },
    { code: 'PKG_TISSUE', name: 'Tissue', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_CHICKEN_BOX', name: 'Chicken Box', unit: 'pcs', currentStock: 500, costPerUnit: 12 },
    { code: 'PKG_SAUCE_CUP', name: 'Sauce Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_SANDWICH_PAPER', name: 'Sandwich Paper', unit: 'pcs', currentStock: 1000, costPerUnit: 1 },
    { code: 'PKG_SANDWICH_BOX', name: 'Sandwich Box', unit: 'pcs', currentStock: 500, costPerUnit: 6 },
    { code: 'PKG_SEASONING_SACHET', name: 'Seasoning Sachet', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_BURGER_BOX', name: 'Burger Box', unit: 'pcs', currentStock: 500, costPerUnit: 5 },
    { code: 'PKG_WRAP_PAPER', name: 'Wrap Paper', unit: 'pcs', currentStock: 500, costPerUnit: 2 },
    { code: 'PKG_CARRY_BAG', name: 'Carry Bag', unit: 'pcs', currentStock: 500, costPerUnit: 3 },
    { code: 'PKG_SHAKE_CUP', name: 'Shake Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 5 },
    { code: 'PKG_LID', name: 'Lid', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_STRAW', name: 'Straw', unit: 'pcs', currentStock: 1000, costPerUnit: 0.5 },
    { code: 'PKG_UTTAPAM_BOX', name: 'Uttapam Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_CHUTNEY_CONT', name: 'Chutney Container', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_SAMBHAR_CONT', name: 'Sambhar Container', unit: 'pcs', currentStock: 1000, costPerUnit: 3 },
    { code: 'PKG_SPOON', name: 'Spoon', unit: 'pcs', currentStock: 1000, costPerUnit: 1 },
    { code: 'PKG_FOIL', name: 'Foil', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_DOSA_BOX', name: 'Dosa Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    
    // New Packaging
    { code: 'PKG_CLAY_HANDI', name: 'Clay Handi / Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 40 },
    { code: 'PKG_PASTA_BOWL', name: 'Pasta Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_DIP_CUP', name: 'Dip Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_WING_BOX', name: 'Wing Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_STRIP_BOX', name: 'Strip Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_POPCORN_BOX', name: 'Popcorn Box', unit: 'pcs', currentStock: 500, costPerUnit: 6 },
    { code: 'PKG_TISSUE', name: 'Tissue', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_CHICKEN_BOX', name: 'Chicken Box', unit: 'pcs', currentStock: 500, costPerUnit: 12 },
    { code: 'PKG_SAUCE_CUP', name: 'Sauce Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_SANDWICH_PAPER', name: 'Sandwich Paper', unit: 'pcs', currentStock: 1000, costPerUnit: 1 },
    { code: 'PKG_SANDWICH_BOX', name: 'Sandwich Box', unit: 'pcs', currentStock: 500, costPerUnit: 6 },
    { code: 'PKG_SEASONING_SACHET', name: 'Seasoning Sachet', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_BURGER_BOX', name: 'Burger Box', unit: 'pcs', currentStock: 500, costPerUnit: 5 },
    { code: 'PKG_WRAP_PAPER', name: 'Wrap Paper', unit: 'pcs', currentStock: 500, costPerUnit: 2 },
    { code: 'PKG_CARRY_BAG', name: 'Carry Bag', unit: 'pcs', currentStock: 500, costPerUnit: 3 },
    { code: 'PKG_SHAKE_CUP', name: 'Shake Cup', unit: 'pcs', currentStock: 1000, costPerUnit: 5 },
    { code: 'PKG_LID', name: 'Lid', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_STRAW', name: 'Straw', unit: 'pcs', currentStock: 1000, costPerUnit: 0.5 },
    { code: 'PKG_UTTAPAM_BOX', name: 'Uttapam Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    { code: 'PKG_CHUTNEY_CONT', name: 'Chutney Container', unit: 'pcs', currentStock: 1000, costPerUnit: 2 },
    { code: 'PKG_SAMBHAR_CONT', name: 'Sambhar Container', unit: 'pcs', currentStock: 1000, costPerUnit: 3 },
    { code: 'PKG_SPOON', name: 'Spoon', unit: 'pcs', currentStock: 1000, costPerUnit: 1 },
    { code: 'PKG_FOIL', name: 'Foil', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_DOSA_BOX', name: 'Dosa Box', unit: 'pcs', currentStock: 500, costPerUnit: 8 },
    
    // New Packaging
    { code: 'PKG_CHILLI_SACHET', name: 'Chilli Flakes Sachet', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_OREGANO_SACHET', name: 'Oregano Sachet', unit: 'pcs', currentStock: 5000, costPerUnit: 0.5 },
    { code: 'PKG_FORK', name: 'Fork', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_VADA_BOX', name: 'Vada Box', unit: 'pcs', currentStock: 500, costPerUnit: 7 },
    { code: 'PKG_BUTTER_PAPER', name: 'Butter Paper', unit: 'pcs', currentStock: 1000, costPerUnit: 1.5 },
    { code: 'PKG_BURGER_WRAP', name: 'Burger Wrap Paper', unit: 'pcs', currentStock: 1000, costPerUnit: 1.0 },


    // Indian Gravy Packaging
    { code: 'PKG_EARTHEN_HANDI', name: 'Earthen Handi / Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_PREMIUM_HANDI', name: 'Premium Round Handi', unit: 'pcs', currentStock: 500, costPerUnit: 30 },
    { code: 'PKG_SERVING_PLATE', name: 'Serving Plate/Container', unit: 'pcs', currentStock: 500, costPerUnit: 15 },


    // Premium White Bowl
    { code: 'PKG_PREMIUM_WHITE_BOWL', name: 'Premium White Bowl / Royal Handi', unit: 'pcs', currentStock: 500, costPerUnit: 35 },
    { code: 'PKG_ROYAL_BOWL', name: '500 ml Royal Bowl', unit: 'pcs', currentStock: 500, costPerUnit: 30 },
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


  ];

  const pkgIds: any = {};
  for (const pkg of pkgData) {
    const doc = await (Packaging as any).findOneAndUpdate(
      { code: pkg.code, userId },
      { 
        $set: { 
          name: pkg.name,
          unit: pkg.unit,
          costPerUnit: pkg.costPerUnit
        },
        $setOnInsert: { currentStock: pkg.currentStock, userId }
      },
      { upsert: true, new: true }
    );
    pkgIds[pkg.code] = doc._id;
  }

  // SFGs
  const sfgData = [
    { code: 'SFG_RED_SAUCE', name: 'Red Sauce Base', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_WHITE_SAUCE', name: 'White Sauce Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 15 },
    { code: 'SFG_PIZZA_DOUGH', name: 'Pizza Dough', batchYield: 1650, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.18 },
    // Chinese SFGs
    { code: 'SFG_SWEET_SOUR_GRAVY', name: 'Master Sweet & Sour Gravy', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.20 },
    // Schezwan & Wok SFGs
    { code: 'SFG_SCHEZWAN_PASTE', name: 'Master Schezwan Paste', batchYield: 1000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_BOILED_RICE', name: 'Boiled Rice', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.05 },
    { code: 'SFG_BOILED_NOODLES', name: 'Boiled Noodles', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.08 },
    // Mandi SFGs
    { code: 'SFG_STEAMED_CHICKEN_PIECES', name: 'Steamed Chicken Pieces', batchYield: 6, yieldUnit: 'pcs', currentStock: 60, costPerUnit: 45 },
    { code: 'SFG_STEAMED_MUTTON_PIECES', name: 'Steamed Mutton Pieces', batchYield: 6, yieldUnit: 'pcs', currentStock: 60, costPerUnit: 80 },
    { code: 'SFG_MANDI_STOCK', name: 'Mandi Stock', batchYield: 2000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_MANDI_RICE', name: 'Mandi Rice', batchYield: 3200, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.15 },
    // South Indian SFGs
    { code: 'SFG_S305_BATTER', name: 'Prepared S-305 Batter', batchYield: 2250, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_S301_BATTER', name: 'Prepared Dosa Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_ALOO_MASALA_STUFFING', name: 'Prepared Aloo Masala Stuffing', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_S303_BATTER', name: 'Prepared Rava Dosa Batter', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_S304_BATTER', name: 'Prepared Medu Vada Batter', batchYield: 1800, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_CHILLI_LIQUID_BASE', name: 'Master Chilli Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_MANCHURIAN_LIQUID_BASE', name: 'Master Manchurian Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_HONEY_CHILLI_GLAZE_BASE', name: 'Honey Chilli Glaze Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.30 },
    { code: 'SFG_Z102_SOUP_BASE', name: 'Z-102 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_Z101_SOUP_BASE', name: 'Z-101 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_MIXED_SOUP_VEGETABLES', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    // Finishing Oils & Momos SFGs
    { code: 'SFG_MASTER_CHILLI_OIL', name: 'F-301 Master Chilli Oil', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.50 },
    { code: 'SFG_MASTER_GARLIC_OIL', name: 'F-302 Master Garlic Oil', batchYield: 500, yieldUnit: 'ml', currentStock: 500, costPerUnit: 0.40 },
    { code: 'SFG_PREPARED_RUBY_SAUCE', name: 'Prepared Ruby Sauce', batchYield: 1000, yieldUnit: 'ml', currentStock: 1000, costPerUnit: 0.30 },
    { code: 'SFG_PREPARED_Z106_BATTER', name: 'Prepared Z-106 Batter', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_PIZZA_DOUGH_PERSONAL', name: 'Personal Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 25 },
    { code: 'SFG_PIZZA_DOUGH_MEDIUM', name: 'Medium Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 40 },
    { code: 'SFG_PIZZA_DOUGH_LARGE', name: 'Large Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 55 },
    { code: 'SFG_GARLIC_BUTTER', name: 'Garlic Butter Spread', batchYield: 12, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.40 },
    { code: 'SFG_HERB_GARLIC_MAYO', name: 'Herb Garlic Mayo', batchYield: 20, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_CREAMY_VELVET_SAUCE', name: 'Creamy Velvet Sauce', batchYield: 14, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_MARINATED_CHICK', name: 'Marinated Chicken', batchYield: 1040, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_DRY_COATING', name: 'Dry Coating Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_MARINATED_CHICKEN_LEG', name: 'Marinated Chicken Leg Pieces', batchYield: 4, yieldUnit: 'portions', currentStock: 50, costPerUnit: 25 },
    { code: 'SFG_MARINATED_CHICKEN_WINGS', name: 'Marinated Chicken Wings', batchYield: 8, yieldUnit: 'portions', currentStock: 50, costPerUnit: 20 },
    { code: 'SFG_MARINATED_CHICKEN_STRIPS', name: 'Marinated Chicken for Strips', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 22 },
    { code: 'SFG_MARINATED_CHICKEN_POPCORN', name: 'Marinated Chicken for Popcorn', batchYield: 8, yieldUnit: 'portions', currentStock: 50, costPerUnit: 20 },
    { code: 'SFG_CLASSIC_BURGER_SAUCE', name: 'C-503 Burger Sauce (SFG)', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce', batchYield: 350, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.22 },
    { code: 'SFG_SPICY_BURGER_SAUCE', name: 'Spicy Burger Sauce', batchYield: 300, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.25 },
    { code: 'SFG_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip', batchYield: 12, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.35 },
    { code: 'SFG_CORN_FILLING', name: 'Corn Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.15 },
    { code: 'SFG_CHICKEN_FILLING', name: 'Chicken Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.30 },
    { code: 'SFG_BOILED_PASTA', name: 'Boiled Pasta', batchYield: 2500, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.05 },
    { code: 'SFG_PERI_PERI_SEASONING', name: 'Peri Peri Seasoning Portions', batchYield: 200, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 1.75 },
    { code: 'SFG_ONION_RAVA_BATTER', name: 'Onion Rava Dosa Batter', batchYield: 3000, yieldUnit: 'gm', currentStock: 7000, costPerUnit: 0.08 },
    { code: 'SFG_RAVA_BATTER_SMALL', name: 'Small Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_RAVA_BATTER_REGULAR', name: 'Regular Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 14 },
    { code: 'SFG_RAVA_BATTER_LARGE', name: 'Large Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 18 },
    { code: 'SFG_VEG_PATTY_MIX', name: 'Veg Patty Mix', batchYield: 1060, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_CHICKEN_PATTY_MIX', name: 'Chicken Patty Mix', batchYield: 1075, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_PATTY_MIX', name: 'Paneer Patty Mix', batchYield: 1065, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_ALOO_PATTY', name: 'C-502 Patty (SFG)', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 12 },
    { code: 'SFG_VEG_PATTY', name: 'Veg Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_PANEER_PATTY', name: 'Paneer Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 25 },
    { code: 'SFG_CHICKEN_PATTY', name: 'Chicken Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 30 },
    { code: 'SFG_ZINGER_PATTY', name: 'Zinger Patty', batchYield: 14, yieldUnit: 'pieces', currentStock: 100, costPerUnit: 35 },
    { code: 'SFG_COLD_COFFEE_BASE', name: 'Cold Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 15 },
    { code: 'SFG_SHAKE_BASE', name: 'Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 12 },
    { code: 'SFG_HOT_COFFEE_BASE', name: 'Hot Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_WHITE_SHAKE_BASE', name: 'White Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_DARK_SHAKE_BASE', name: 'Dark Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 18 },
    { code: 'SFG_UTTAPAM_BATTER_NEW', name: 'Uttapam Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_UTTAPAM_BATTER_SMALL', name: 'Small Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_UTTAPAM_BATTER_REGULAR', name: 'Regular Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 14 },
    { code: 'SFG_UTTAPAM_BATTER_LARGE', name: 'Large Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 18 },
    { code: 'SFG_UTTAPAM_TOPPING', name: 'Uttapam Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_COCONUT_CHUTNEY', name: 'Coconut Chutney', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_RED_KARA_CHUTNEY', name: 'Red Kara Chutney Base', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_RED_CHUTNEY_PORTION', name: 'Red Chutney portion', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 2 },
    { code: 'SFG_PREMIUM_SAMBHAR', name: 'Premium Sambhar Base', batchYield: 10000, yieldUnit: 'ml', currentStock: 10000, costPerUnit: 0.04 },
    { code: 'SFG_SAMBHAR_PORTION', name: 'Sambhar portion', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 3 },
    { code: 'SFG_BIRYANI_BATCH', name: 'Shahi Lucknowi Biryani Batch', batchYield: 9, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    { code: 'SFG_MANDI_BATCH', name: 'White Mandi Batch (Chicken)', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    { code: 'SFG_MANDI_BATCH_MUTTON', name: 'White Mandi Batch (Mutton)', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 60 },
    { code: 'SFG_IDLI_BATTER', name: 'Idli Batter', batchYield: 2200, yieldUnit: 'gm', currentStock: 4400, costPerUnit: 0.07 },
    { code: 'SFG_DOSA_BATTER', name: 'Dosa Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_ALOO_MASALA', name: 'Aloo Masala Stuffing', batchYield: 1270, yieldUnit: 'gm', currentStock: 2540, costPerUnit: 0.05 },
    { code: 'SFG_VADA_BATTER', name: 'Medu Vada Batter', batchYield: 18, yieldUnit: 'portions', currentStock: 36, costPerUnit: 9 },
    
    // New SFGs
    { code: 'SFG_TOPPING_MIX', name: 'Pizza Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_TOPPING', name: 'Paneer Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_VEG_FILLING', name: 'Veg Sandwich Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_FILLING', name: 'Paneer Sandwich Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_FIRE_DUST_FRIES', name: 'Fire Dust portion for Fries', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 4.2 },
    { code: 'SFG_FIRE_DUST_GRILL', name: 'Fire Dust portion for Grills', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 3.5 },
    { code: 'SFG_FIRE_DUST_PIZZA', name: 'Fire Dust portion for Pizzas', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 0.9 },
    { code: 'SFG_FIRE_DUST_WRAP', name: 'Fire Dust portion for Wraps', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 1.25 },
    // Pizza Portion SFGs (Automatically Linked System)
    { code: 'SFG_SAUCE_PORTION_PERSONAL', name: 'Personal Red Sauce Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 8.75 },
    { code: 'SFG_SAUCE_PORTION_MEDIUM', name: 'Medium Red Sauce Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 12.5 },
    { code: 'SFG_SAUCE_PORTION_LARGE', name: 'Large Red Sauce Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 17.5 },
    { code: 'SFG_CHEESE_PORTION_PERSONAL', name: 'Personal Cheese Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 29.25 },
    { code: 'SFG_CHEESE_PORTION_MEDIUM', name: 'Medium Cheese Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 40.5 },
    { code: 'SFG_CHEESE_PORTION_LARGE', name: 'Large Cheese Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 58.5 },
    { code: 'SFG_VEG_PORTION_PERSONAL', name: 'Personal Veg Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 2.5 },
    { code: 'SFG_VEG_PORTION_MEDIUM', name: 'Medium Veg Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 4 },
    { code: 'SFG_VEG_PORTION_LARGE', name: 'Large Veg Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 6 },
    { code: 'SFG_CORN_PORTION_PERSONAL', name: 'Personal Corn Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 3.75 },
    { code: 'SFG_CORN_PORTION_MEDIUM', name: 'Medium Corn Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 6 },
    { code: 'SFG_CORN_PORTION_LARGE', name: 'Large Corn Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 9 },
    { code: 'SFG_PREPARED_Z106_BATTER', name: 'Prepared Z-106 Batter', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_PIZZA_DOUGH_PERSONAL', name: 'Personal Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 25 },
    { code: 'SFG_PIZZA_DOUGH_MEDIUM', name: 'Medium Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 40 },
    { code: 'SFG_PIZZA_DOUGH_LARGE', name: 'Large Pizza Dough Ball', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 55 },
    { code: 'SFG_GARLIC_BUTTER', name: 'Garlic Butter Spread', batchYield: 12, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.40 },
    { code: 'SFG_HERB_GARLIC_MAYO', name: 'Herb Garlic Mayo', batchYield: 20, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_CREAMY_VELVET_SAUCE', name: 'Creamy Velvet Sauce', batchYield: 14, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_MARINATED_CHICK', name: 'Marinated Chicken', batchYield: 1040, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_DRY_COATING', name: 'Dry Coating Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_MARINATED_CHICKEN_LEG', name: 'Marinated Chicken Leg Pieces', batchYield: 4, yieldUnit: 'portions', currentStock: 50, costPerUnit: 25 },
    { code: 'SFG_MARINATED_CHICKEN_WINGS', name: 'Marinated Chicken Wings', batchYield: 8, yieldUnit: 'portions', currentStock: 50, costPerUnit: 20 },
    { code: 'SFG_MARINATED_CHICKEN_STRIPS', name: 'Marinated Chicken for Strips', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 22 },
    { code: 'SFG_MARINATED_CHICKEN_POPCORN', name: 'Marinated Chicken for Popcorn', batchYield: 8, yieldUnit: 'portions', currentStock: 50, costPerUnit: 20 },
    { code: 'SFG_CLASSIC_BURGER_SAUCE', name: 'C-503 Burger Sauce (SFG)', batchYield: 330, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce', batchYield: 350, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.22 },
    { code: 'SFG_SPICY_BURGER_SAUCE', name: 'Spicy Burger Sauce', batchYield: 300, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.25 },
    { code: 'SFG_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip', batchYield: 12, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 0.35 },
    { code: 'SFG_CORN_FILLING', name: 'Corn Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.15 },
    { code: 'SFG_CHICKEN_FILLING', name: 'Chicken Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.30 },
    { code: 'SFG_BOILED_PASTA', name: 'Boiled Pasta', batchYield: 2500, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.05 },
    { code: 'SFG_PERI_PERI_SEASONING', name: 'Peri Peri Seasoning Portions', batchYield: 200, yieldUnit: 'portions', currentStock: 1000, costPerUnit: 1.75 },
    { code: 'SFG_ONION_RAVA_BATTER', name: 'Onion Rava Dosa Batter', batchYield: 3000, yieldUnit: 'gm', currentStock: 7000, costPerUnit: 0.08 },
    { code: 'SFG_RAVA_BATTER_SMALL', name: 'Small Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_RAVA_BATTER_REGULAR', name: 'Regular Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 14 },
    { code: 'SFG_RAVA_BATTER_LARGE', name: 'Large Rava Dosa Batter', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 18 },
    { code: 'SFG_VEG_PATTY_MIX', name: 'Veg Patty Mix', batchYield: 1060, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_CHICKEN_PATTY_MIX', name: 'Chicken Patty Mix', batchYield: 1075, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_PATTY_MIX', name: 'Paneer Patty Mix', batchYield: 1065, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_ALOO_PATTY', name: 'C-502 Patty (SFG)', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 12 },
    { code: 'SFG_VEG_PATTY', name: 'Veg Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_PANEER_PATTY', name: 'Paneer Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 25 },
    { code: 'SFG_CHICKEN_PATTY', name: 'Chicken Patty', batchYield: 1, yieldUnit: 'piece', currentStock: 100, costPerUnit: 30 },
    { code: 'SFG_ZINGER_PATTY', name: 'Zinger Patty', batchYield: 14, yieldUnit: 'pieces', currentStock: 100, costPerUnit: 35 },
    { code: 'SFG_COLD_COFFEE_BASE', name: 'Cold Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 15 },
    { code: 'SFG_SHAKE_BASE', name: 'Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 12 },
    { code: 'SFG_HOT_COFFEE_BASE', name: 'Hot Coffee Base', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_WHITE_SHAKE_BASE', name: 'White Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 15 },
    { code: 'SFG_DARK_SHAKE_BASE', name: 'Dark Shake Base', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 18 },
    { code: 'SFG_UTTAPAM_BATTER_NEW', name: 'Uttapam Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.05 },
    { code: 'SFG_UTTAPAM_BATTER_SMALL', name: 'Small Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_UTTAPAM_BATTER_REGULAR', name: 'Regular Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 14 },
    { code: 'SFG_UTTAPAM_BATTER_LARGE', name: 'Large Uttapam Batter portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 18 },
    { code: 'SFG_UTTAPAM_TOPPING', name: 'Uttapam Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.10 },
    { code: 'SFG_COCONUT_CHUTNEY', name: 'Coconut Chutney', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_RED_KARA_CHUTNEY', name: 'Red Kara Chutney Base', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_RED_CHUTNEY_PORTION', name: 'Red Chutney portion', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 2 },
    { code: 'SFG_PREMIUM_SAMBHAR', name: 'Premium Sambhar Base', batchYield: 10000, yieldUnit: 'ml', currentStock: 10000, costPerUnit: 0.04 },
    { code: 'SFG_SAMBHAR_PORTION', name: 'Sambhar portion', batchYield: 1, yieldUnit: 'portion', currentStock: 100, costPerUnit: 3 },
    { code: 'SFG_BIRYANI_BATCH', name: 'Shahi Lucknowi Biryani Batch', batchYield: 9, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    { code: 'SFG_MANDI_BATCH', name: 'White Mandi Batch (Chicken)', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 45 },
    { code: 'SFG_MANDI_BATCH_MUTTON', name: 'White Mandi Batch (Mutton)', batchYield: 6, yieldUnit: 'portions', currentStock: 50, costPerUnit: 60 },
    { code: 'SFG_IDLI_BATTER', name: 'Idli Batter', batchYield: 2200, yieldUnit: 'gm', currentStock: 4400, costPerUnit: 0.07 },
    { code: 'SFG_DOSA_BATTER', name: 'Dosa Batter', batchYield: 2500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.06 },
    { code: 'SFG_ALOO_MASALA', name: 'Aloo Masala Stuffing', batchYield: 1270, yieldUnit: 'gm', currentStock: 2540, costPerUnit: 0.05 },
    { code: 'SFG_VADA_BATTER', name: 'Medu Vada Batter', batchYield: 18, yieldUnit: 'portions', currentStock: 36, costPerUnit: 9 },
    
    // New SFGs
    { code: 'SFG_TOPPING_MIX', name: 'Pizza Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_TOPPING', name: 'Paneer Topping Mix', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_VEG_FILLING', name: 'Veg Sandwich Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PANEER_FILLING', name: 'Paneer Sandwich Filling', batchYield: 1000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.35 },
    { code: 'SFG_FIRE_DUST_FRIES', name: 'Fire Dust portion for Fries', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 4.2 },
    { code: 'SFG_FIRE_DUST_GRILL', name: 'Fire Dust portion for Grills', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 3.5 },
    { code: 'SFG_FIRE_DUST_PIZZA', name: 'Fire Dust portion for Pizzas', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 0.9 },
    { code: 'SFG_FIRE_DUST_WRAP', name: 'Fire Dust portion for Wraps', batchYield: 1, yieldUnit: 'portion', currentStock: 500, costPerUnit: 1.25 },
    // Pizza Portion SFGs (Automatically Linked System)
    { code: 'SFG_SAUCE_PORTION_PERSONAL', name: 'Personal Red Sauce Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 8.75 },
    { code: 'SFG_SAUCE_PORTION_MEDIUM', name: 'Medium Red Sauce Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 12.5 },
    { code: 'SFG_SAUCE_PORTION_LARGE', name: 'Large Red Sauce Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 17.5 },
    { code: 'SFG_CHEESE_PORTION_PERSONAL', name: 'Personal Cheese Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 29.25 },
    { code: 'SFG_CHEESE_PORTION_MEDIUM', name: 'Medium Cheese Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 40.5 },
    { code: 'SFG_CHEESE_PORTION_LARGE', name: 'Large Cheese Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 58.5 },
    { code: 'SFG_VEG_PORTION_PERSONAL', name: 'Personal Veg Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 2.5 },
    { code: 'SFG_VEG_PORTION_MEDIUM', name: 'Medium Veg Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 4 },
    { code: 'SFG_VEG_PORTION_LARGE', name: 'Large Veg Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 6 },
    { code: 'SFG_CORN_PORTION_PERSONAL', name: 'Personal Corn Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 3.75 },
    { code: 'SFG_CORN_PORTION_MEDIUM', name: 'Medium Corn Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 6 },
    { code: 'SFG_CORN_PORTION_LARGE', name: 'Large Corn Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 9 },
    { code: 'SFG_PANEER_PORTION_PERSONAL', name: 'Personal Paneer Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 8.75 },
    { code: 'SFG_PANEER_PORTION_MEDIUM', name: 'Medium Paneer Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 14 },
    { code: 'SFG_PANEER_PORTION_LARGE', name: 'Large Paneer Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 21 },
    { code: 'SFG_CHICKEN_PORTION_PERSONAL', name: 'Personal Chicken Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 6.25 },
    { code: 'SFG_CHICKEN_PORTION_MEDIUM', name: 'Medium Chicken Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 10 },
    { code: 'SFG_CHICKEN_PORTION_LARGE', name: 'Large Chicken Portion', batchYield: 1, yieldUnit: 'portion', currentStock: 50, costPerUnit: 15 },


    // Indian Gravies
    { code: 'SFG_G205', name: 'G-205 Royal Rogan', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.15 },
    { code: 'SFG_G204', name: 'G-204 Roasted Rust', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.16 },
    { code: 'SFG_G201', name: 'G-201 Sunset Base', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.18 },
    // Indian Veg SFGs
    { code: 'SFG_PRE_FRIED_POTATO', name: 'Pre-fried Potato', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 },
    { code: 'SFG_PRE_FRIED_CAULIFLOWER', name: 'Pre-fried Cauliflower', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_BOILED_GREEN_PEAS', name: 'Boiled Green Peas', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'SFG_PANEER_CUBES', name: 'Paneer Cubes', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.38 },
    { code: 'SFG_KADHAI_VEG_MIX_NEW', name: 'Kadhai Veg Mix New', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_GOLDEN_GARLIC_TOPPING', name: 'Golden Garlic Topping', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.20 },
    { code: 'SFG_FRIED_KOFTA', name: 'Fried Kofta', batchYield: 100, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 18 },
    // Indian Veg SFGs Part 2
    { code: 'SFG_BLANCHED_VEG_MIX', name: 'Blanched Veg Mix', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.12 },
    { code: 'SFG_FRIED_MAKHANA', name: 'Fried Makhana', batchYield: 1000, yieldUnit: 'gm', currentStock: 1000, costPerUnit: 0.85 },
    { code: 'SFG_MALAI_KOFTA', name: 'Malai Kofta', batchYield: 50, yieldUnit: 'pcs', currentStock: 50, costPerUnit: 20 },
    // Chinese SFGs
    { code: 'SFG_SWEET_SOUR_GRAVY', name: 'Master Sweet & Sour Gravy', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.20 },
    { code: 'SFG_CHILLI_LIQUID_BASE', name: 'Master Chilli Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_MANCHURIAN_LIQUID_BASE', name: 'Master Manchurian Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_HONEY_CHILLI_GLAZE_BASE', name: 'Honey Chilli Glaze Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.30 },
    { code: 'SFG_Z102_SOUP_BASE', name: 'Z-102 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_Z101_SOUP_BASE', name: 'Z-101 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_MIXED_SOUP_VEGETABLES', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_G202', name: 'G-202 Ivory Base', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.20 },
    { code: 'SFG_PRECOOKED_CHICKEN_MUTTON', name: 'Pre-cooked Chicken/Mutton', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.30 },
    { code: 'SFG_PRECOOKED_BARRAH', name: 'Pre-cooked Tandoori Barrah', batchYield: 5000, yieldUnit: 'gm', currentStock: 2000, costPerUnit: 0.60 },
    // Hariyali and Kadhai
    { code: 'SFG_G203', name: 'G-203 Emerald Mix', batchYield: 5000, yieldUnit: 'gm', currentStock: 10000, costPerUnit: 0.18 },
    // Chinese SFGs
    { code: 'SFG_SWEET_SOUR_GRAVY', name: 'Master Sweet & Sour Gravy', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.20 },
    { code: 'SFG_CHILLI_LIQUID_BASE', name: 'Master Chilli Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_MANCHURIAN_LIQUID_BASE', name: 'Master Manchurian Liquid Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.25 },
    { code: 'SFG_HONEY_CHILLI_GLAZE_BASE', name: 'Honey Chilli Glaze Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.30 },
    { code: 'SFG_Z102_SOUP_BASE', name: 'Z-102 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_Z101_SOUP_BASE', name: 'Z-101 Soup Base', batchYield: 5000, yieldUnit: 'ml', currentStock: 5000, costPerUnit: 0.15 },
    { code: 'SFG_MIXED_SOUP_VEGETABLES', name: 'Mixed Soup Vegetables', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_KADHAI_VEG_MIX', name: 'Kadhai Veg Mix', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.10 },
    { code: 'SFG_PRECOOKED_HARIYALI_TIKKA', name: 'Pre-cooked Hariyali Tikka', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.45 },
    // Mutton & Omelette SFG
    { code: 'SFG_EGG_OMELETTE', name: 'Egg Omelette', batchYield: 25, yieldUnit: 'pcs', currentStock: 100, costPerUnit: 10 },
    { code: 'SFG_PRECOOKED_MUTTON', name: 'Pre-cooked Mutton', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.85 },


    // Precooked items
    { code: 'SFG_PRECOOKED_KEEMA', name: 'Pre-cooked Keema', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.50 },
    { code: 'SFG_PRECOOKED_CHICKEN_TIKKA', name: 'Pre-cooked Chicken Tikka', batchYield: 5000, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.45 },
    // Tandoor Packaging
    { code: 'PKG_ARABIAN_PLATTER', name: 'Arabian Platter', unit: 'pcs', currentStock: 500, costPerUnit: 25 },
    { code: 'PKG_KHABOOS', name: 'Khaboos Bread', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    // Indian Veg PKG
    { code: 'PKG_OVAL_VEG_DISH', name: 'Flat Ceramic Plate / Oval Veg Dish', unit: 'pcs', currentStock: 500, costPerUnit: 40 },
    { code: 'PKG_TAKEAWAY_CONTAINER', name: 'Takeaway Container', unit: 'pcs', currentStock: 500, costPerUnit: 10 },
    { code: 'PKG_COPPER_KADHAI', name: 'Copper Kadhai / Ceramic Handi', unit: 'pcs', currentStock: 500, costPerUnit: 50 },
    { code: 'PKG_PREMIUM_DEEP_BOWL', name: 'Premium Deep Bowl / Handi', unit: 'pcs', currentStock: 500, costPerUnit: 45 },


  ];

  const sfgIds: any = {};
  for (const sfg of sfgData) {
    const doc = await (SemiFinishedGood as any).findOneAndUpdate(
      { code: sfg.code, userId },
      { 
        $set: { 
          name: sfg.name,
          batchYield: sfg.batchYield, 
          yieldUnit: sfg.yieldUnit,
          costPerUnit: sfg.costPerUnit
        },
        $setOnInsert: { currentStock: sfg.currentStock, userId } 
      },
      { upsert: true, new: true }
    );
    sfgIds[sfg.code] = doc._id;
  }

  // SFG Recipes Mappings (for recursive costing)
  const sfgRecipeMappings: Record<string, { itemModel: 'RawMaterial' | 'SemiFinishedGood'; code: string; quantity: number }[]> = {
    'SFG_VEG_PATTY_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 60 }
    ],
    'SFG_CHICKEN_PATTY_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_MINCE', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 75 }
    ],
    'SFG_PANEER_PATTY_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 65 }
    ],
    'SFG_ALOO_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_C502_GRILL_DUST', quantity: 5 }
    ],
    'SFG_VEG_PATTY': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY_MIX', quantity: 75 }
    ],
    'SFG_CHICKEN_PATTY': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY_MIX', quantity: 77 }
    ],
    'SFG_PANEER_PATTY': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_PATTY_MIX', quantity: 76 }
    ],
    'SFG_ZINGER_PATTY': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_UTTAPAM_BATTER_NEW': [
      { itemModel: 'RawMaterial', code: 'RM_S305_STEAM', quantity: 1000 }
    ],
    'SFG_UTTAPAM_BATTER_SMALL': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 95 }
    ],
    'SFG_UTTAPAM_BATTER_REGULAR': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 130 }
    ],
    'SFG_UTTAPAM_BATTER_LARGE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_NEW', quantity: 170 }
    ],
    'SFG_DOSA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_COASTAL_CRUST', quantity: 1000 }
    ],
    'SFG_VADA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S304_CRUNCH', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 200 }
    ],
    'SFG_COCONUT_CHUTNEY': [
      { itemModel: 'RawMaterial', code: 'RM_S307_KERNEL', quantity: 1000 }
    ],
    'SFG_RED_KARA_CHUTNEY': [
      { itemModel: 'RawMaterial', code: 'RM_S306_TANGY', quantity: 1000 }
    ],
    'SFG_RED_CHUTNEY_PORTION': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 40 }
    ],
    'SFG_PREMIUM_SAMBHAR': [
      { itemModel: 'RawMaterial', code: 'RM_S308_LENTIL', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 1500 }
    ],
    'SFG_SAMBHAR_PORTION': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 80 }
    ],
    'SFG_ALOO_MASALA': [
      { itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_S302_TEMPER', quantity: 120 }
    ],
    'SFG_ONION_RAVA_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S303_RAVA', quantity: 1000 }
    ],
    'SFG_RAVA_BATTER_SMALL': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_ONION_RAVA_BATTER', quantity: 85 }
    ],
    'SFG_RAVA_BATTER_REGULAR': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_ONION_RAVA_BATTER', quantity: 115 }
    ],
    'SFG_RAVA_BATTER_LARGE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_ONION_RAVA_BATTER', quantity: 140 }
    ],
    'SFG_BIRYANI_BATCH': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_RICE_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_DAHI_RAW', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_B401_PREMIX', quantity: 150 }
    ],
    'SFG_MANDI_BATCH': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_RICE_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_B404A_PREMIX', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_B404B_PREMIX', quantity: 150 }
    ],
    'SFG_MANDI_BATCH_MUTTON': [
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_RICE_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_B404A_PREMIX', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_B404B_PREMIX', quantity: 150 }
    ],
    'SFG_IDLI_BATTER': [
      { itemModel: 'RawMaterial', code: 'RM_S305_STEAM', quantity: 1000 }
    ],
    'SFG_RED_SAUCE': [{ itemModel: 'RawMaterial', code: 'RM_C506', quantity: 1000 }],
    'SFG_WHITE_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 }
    ],
    'SFG_PIZZA_DOUGH': [
      { itemModel: 'RawMaterial', code: 'RM_C501', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 50 }
    ],
    'SFG_PIZZA_DOUGH_PERSONAL': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 150 }
    ],
    'SFG_PIZZA_DOUGH_MEDIUM': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 240 }
    ],
    'SFG_PIZZA_DOUGH_LARGE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH', quantity: 350 }
    ],
    'SFG_GARLIC_BUTTER': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C504', quantity: 40 }
    ],
    'SFG_HERB_GARLIC_MAYO': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_C504', quantity: 30 }
    ],
    'SFG_CREAMY_VELVET_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 30 }
    ],
    'SFG_CLASSIC_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_KETCHUP', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 30 }
    ],
    'SFG_TANDOORI_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 50 }
    ],
    'SFG_SPICY_BURGER_SAUCE': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 50 }
    ],
    'SFG_CHEESY_GARLIC_DIP': [
      { itemModel: 'RawMaterial', code: 'RM_MAYO', quantity: 250 },
      { itemModel: 'RawMaterial', code: 'RM_C503', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LIQUID_CHEESE', quantity: 50 }
    ],
    'SFG_MARINATED_CHICK': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_DRY_COATING': [
      { itemModel: 'RawMaterial', code: 'RM_MAIDA', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 100 }
    ],
    'SFG_MARINATED_CHICKEN_LEG': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_LEG', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_MARINATED_CHICKEN_WINGS': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_WINGS', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_MARINATED_CHICKEN_STRIPS': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_MARINATED_CHICKEN_POPCORN': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_C510', quantity: 40 }
    ],
    'SFG_BOILED_PASTA': [
      { itemModel: 'RawMaterial', code: 'RM_PASTA_RAW', quantity: 1000 }
    ],
    'SFG_TOPPING_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 1000 }
    ],
    'SFG_PANEER_TOPPING': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 1000 }
    ],
    'SFG_CORN_FILLING': [
      { itemModel: 'RawMaterial', code: 'RM_CORN_RAW', quantity: 1000 }
    ],
    'SFG_VEG_FILLING': [
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 1000 }
    ],
    'SFG_PANEER_FILLING': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 1000 }
    ],
    'SFG_CHICKEN_FILLING': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_STRIPS', quantity: 6 }
    ],
    'SFG_FIRE_DUST_FRIES': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 12 }
    ],
    'SFG_FIRE_DUST_GRILL': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 10 }
    ],
    'SFG_FIRE_DUST_PIZZA': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 2.5 }
    ],
    'SFG_FIRE_DUST_WRAP': [
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 3.5 }
    ],
    'SFG_WHITE_SHAKE_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 42.5 }
    ],
    'SFG_DARK_SHAKE_BASE': [
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 42.5 }
    ],
    'SFG_SAUCE_PORTION_PERSONAL': [{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 35 }],
    'SFG_SAUCE_PORTION_MEDIUM': [{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 50 }],
    'SFG_SAUCE_PORTION_LARGE': [{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_SAUCE', quantity: 70 }],
    'SFG_CHEESE_PORTION_PERSONAL': [{ itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 60 }],
    'SFG_CHEESE_PORTION_MEDIUM': [{ itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 80 }],
    'SFG_CHEESE_PORTION_LARGE': [{ itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 120 }],
    'SFG_VEG_PORTION_PERSONAL': [{ itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 40 }],
    'SFG_VEG_PORTION_MEDIUM': [{ itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 60 }],
    'SFG_VEG_PORTION_LARGE': [{ itemModel: 'SemiFinishedGood', code: 'SFG_TOPPING_MIX', quantity: 100 }],
    'SFG_CORN_PORTION_PERSONAL': [{ itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 40 }],
    'SFG_CORN_PORTION_MEDIUM': [{ itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 60 }],
    'SFG_CORN_PORTION_LARGE': [{ itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 100 }],
    'SFG_PANEER_PORTION_PERSONAL': [{ itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_TOPPING', quantity: 40 }],
    'SFG_PANEER_PORTION_MEDIUM': [{ itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_TOPPING', quantity: 60 }],
    'SFG_PANEER_PORTION_LARGE': [{ itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_TOPPING', quantity: 100 }],
    'SFG_CHICKEN_PORTION_PERSONAL': [{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 41.6 }],
    'SFG_CHICKEN_PORTION_MEDIUM': [{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 62.4 }],
    'SFG_CHICKEN_PORTION_LARGE': [{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 104 }],


    'SFG_G205': [
      { itemModel: 'RawMaterial', code: 'RM_G205', quantity: 5000 }
    ],
    'SFG_G204': [
      { itemModel: 'RawMaterial', code: 'RM_G204', quantity: 5000 }
    ],
    'SFG_G201': [
      { itemModel: 'RawMaterial', code: 'RM_G201', quantity: 5000 }
    ],
    'SFG_G202': [
      { itemModel: 'RawMaterial', code: 'RM_G202', quantity: 5000 }
    ],
    'SFG_PRECOOKED_CHICKEN_MUTTON': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_RAW', quantity: 5000 }
    ],
    'SFG_PRECOOKED_BARRAH': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_BARRAH', quantity: 5000 }
    ],


    'SFG_PRECOOKED_KEEMA': [
      { itemModel: 'RawMaterial', code: 'RM_KEEMA_RAW', quantity: 5000 }
    ],
    'SFG_PRECOOKED_CHICKEN_TIKKA': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_CHICKEN_TIKKA', quantity: 5000 }
    ],'SFG_MARINATED_CHICKEN_T604': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_T604', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_BESAN', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 50 }
    ],
    'SFG_MARINATED_CHICKEN_T605': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 2000 },
      { itemModel: 'RawMaterial', code: 'RM_T605', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 30 }
    ],
    'SFG_MARINATED_SEEKH_T606': [
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_BREAST', quantity: 700 },
      { itemModel: 'RawMaterial', code: 'RM_CHICKEN_FAT', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_T606', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_DEWATERED_ONION', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 25 }
    ],
    'SFG_MARINATED_ALFAHAM_T607': [
      { itemModel: 'RawMaterial', code: 'RM_RAW_CHICKEN_WHOLE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_T607', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 }
    ],
    'SFG_T601_PASTE': [
      { itemModel: 'RawMaterial', code: 'RM_T601', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 400 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 100 }
    ],
    'SFG_T602_PASTE': [
      { itemModel: 'RawMaterial', code: 'RM_T602', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 400 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 100 }
    ],
    'SFG_T603_PASTE': [
      { itemModel: 'RawMaterial', code: 'RM_T603', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_HANG_CURD', quantity: 400 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 100 }
    ],
    'SFG_T602A_PASTE': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 600 },
      { itemModel: 'RawMaterial', code: 'RM_ACHARI_PASTE', quantity: 150 }
    ]

  };

  for (const sfgCode of Object.keys(sfgRecipeMappings)) {
    const sfgId = sfgIds[sfgCode];
    if (!sfgId) continue;
    
    const sfgItem = sfgData.find(s => s.code === sfgCode);
    const yieldQty = sfgItem ? sfgItem.batchYield : 1;

    const mapping = sfgRecipeMappings[sfgCode];
    const ingredients = mapping.map(m => {
      const id = m.itemModel === 'RawMaterial' ? rmIds[m.code] : sfgIds[m.code];
      return {
        itemModel: m.itemModel,
        itemId: id,
        quantity: m.quantity
      };
    }).filter(ing => ing.itemId !== undefined);

    await (Recipe as any).findOneAndUpdate(
      { targetModel: 'SemiFinishedGood', targetId: sfgId, userId },
      {
        $set: {
          targetYield: yieldQty,
          operationalYield: yieldQty,
          ingredients
        },
        $setOnInsert: {
          userId
        }
      },
      { upsert: true }
    );
  }

  // Dishes
  const dishData = [
    { name: 'Red Sauce Pasta', price: 250, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'White Sauce Pasta', price: 260, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Pink Sauce Pasta', price: 270, category: 'Pasta', packagingLogic: { takeaway: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PASTA_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_FORK'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Garlic Bread', price: 150, category: 'Sides', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Wings', price: 199, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_WING_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WING_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Strips', price: 219, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_STRIP_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_STRIP_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Popcorn', price: 179, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_POPCORN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_POPCORN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Leg Piece', price: 149, category: 'Starters', packagingLogic: { takeaway: [pkgIds['PKG_CHICKEN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHICKEN_BOX'], pkgIds['PKG_DIP_CUP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Classic Burger', price: 120, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Crispy Veggie Burger', price: 130, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Tandoori Burger', price: 140, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Paneer Burger', price: 150, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Classic Chicken Burger', price: 160, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Zinger Burger', price: 180, category: 'Burgers', packagingLogic: { takeaway: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BURGER_BOX'], pkgIds['PKG_BURGER_WRAP'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Crispy Chicken Sandwich', price: 220, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Classic Corn Cheese Sandwich', price: 180, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Veg Grilled Club', price: 170, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Peri-Peri Paneer Sandwich', price: 195, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Single Medu Vada', price: 60, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Double Medu Vada', price: 110, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medu Vada Portion', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_VADA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Peri Peri Fries', price: 120, category: 'Sides', packagingLogic: { takeaway: [pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SEASONING_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Onion Rava Dosa', price: 140, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Small Onion Rava Dosa', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Onion Rava Dosa', price: 130, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Onion Rava Dosa', price: 170, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_BUTTER_PAPER'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },

    { name: 'Veg Wrap', price: 110, category: 'Wraps', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Wrap', price: 140, category: 'Wraps', packagingLogic: { takeaway: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_WRAP_PAPER'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Club Sandwich', price: 150, category: 'Sandwich', packagingLogic: { takeaway: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SANDWICH_PAPER'], pkgIds['PKG_SANDWICH_BOX'], pkgIds['PKG_TISSUE'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Beverage System
    { name: 'Cold Coffee', price: 120, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chocolate Shake', price: 140, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Vanilla Shake', price: 130, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Strawberry Shake', price: 130, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mango Shake', price: 140, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Oreo Shake', price: 150, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'KitKat Shake', price: 160, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Hazelnut Shake', price: 150, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Hot Coffee', price: 90, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mocha Frappe', price: 160, category: 'Beverage', packagingLogic: { takeaway: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SHAKE_CUP'], pkgIds['PKG_LID'], pkgIds['PKG_STRAW'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Uttapams
    { name: 'Mini Uttapam', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Uttapam', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Uttapam', price: 150, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Small Mix Veg Uttapam', price: 90, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Mix Veg Uttapam', price: 130, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Mix Veg Uttapam', price: 170, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Mandi & Biryani
    { name: 'Shahi Lucknowi Biryani', price: 280, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Kyroz Indo Arabic White Mandi', price: 260, category: 'Mandi', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Kyroz Mutton Mandi', price: 450, category: 'Mandi', packagingLogic: { takeaway: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BIRYANI_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_FOIL'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Idlis
    { name: 'Mini Rice Idli', price: 60, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Rice Idli', price: 80, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Rice Idli', price: 100, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_UTTAPAM_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    
    // Dosas
    { name: 'Small Masala Dosa', price: 80, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Masala Dosa', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Masala Dosa', price: 160, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_DOSA_BOX'], pkgIds['PKG_CHUTNEY_CONT'], pkgIds['PKG_SAMBHAR_CONT'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },

    // Pizza variations
    { name: 'Personal Classic Veg Pizza', price: 180, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Classic Veg Pizza', price: 280, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Classic Veg Pizza', price: 380, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Corn Cheese Pizza', price: 190, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Corn Cheese Pizza', price: 295, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Corn Cheese Pizza', price: 399, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Farmhouse Pizza', price: 220, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Farmhouse Pizza', price: 320, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Farmhouse Pizza', price: 420, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Paneer Pizza', price: 240, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Paneer Pizza', price: 340, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Paneer Pizza', price: 440, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Personal Chicken Pizza', price: 260, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medium Chicken Pizza', price: 360, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Large Chicken Pizza', price: 460, category: 'Pizza', packagingLogic: { takeaway: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PIZZA_BOX'], pkgIds['PKG_CHILLI_SACHET'], pkgIds['PKG_OREGANO_SACHET'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Desi Handi Chicken', price: 350, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Barrah Masala', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_SERVING_PLATE'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SERVING_PLATE'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },
    { name: 'Butter Chicken', price: 380, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_HANDI']] } },
    { name: 'Chicken Changezi', price: 400, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Curry', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Tikka Masala', price: 380, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Kadhai Chicken', price: 360, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Murg Hariyali', price: 390, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Murg Mumtaz', price: 420, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_ROYAL_BOWL']] } },
    { name: 'Murg Musallam', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_OVAL_PLATE'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_PLATE']] } },
    { name: 'Murg Patiala', price: 430, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Mutton Bhuna Gosht', price: 480, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_IRON_KARAHI'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_IRON_KARAHI'], pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_IRON_KARAHI']] } },
    { name: 'Mutton Curry', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_HANDI']] } },
    { name: 'Mutton Handi', price: 470, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CLAY_HANDI']] } },
    { name: 'Mutton Rogan Josh', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_COPPER_KADHAI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Chicken Nizami Handi', price: 410, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CLAY_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CLAY_HANDI']] } },
    { name: 'Saagwala Meat', price: 460, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_BLACK_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_BLACK_BOWL']] } },
    { name: 'American Chopsuey', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_LARGE_SHALLOW_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_LARGE_SHALLOW_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_LARGE_SHALLOW_BOWL']] } },
    { name: 'Chilli Paneer Dry', price: 260, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chilli Paneer Gravy', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chilli Chicken Dry', price: 300, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chilli Chicken Gravy', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Veg Manchurian Dry', price: 240, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Veg Manchurian Gravy', price: 260, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Manchurian Dry', price: 280, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Manchurian Gravy', price: 300, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Honey Chilli Potato', price: 220, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Hot & Sour Soup', price: 160, category: 'Soup', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SOUP_BOWL']] } },
    { name: 'Aloo Gobhi Matar (Semi-Gravy)', price: 250, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Corn Palak Cheese', price: 280, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_OVAL_VEG_DISH']] } },
    { name: 'Kadhai Paneer', price: 320, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_COPPER_KADHAI']] } },
    { name: 'Lehsunia Paneer', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta Red', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Mushroom Do Pyaza', price: 290, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Navratan Korma', price: 350, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Palak Paneer', price: 300, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Paneer Butter Masala', price: 310, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Malai Kofta (Ivory)', price: 340, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_TAKEAWAY_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_DEEP_BOWL']] } },
    { name: 'Manchow Soup', price: 170, category: 'Soup', packagingLogic: { takeaway: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUP_BOWL'], pkgIds['PKG_SOUP_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SOUP_BOWL']] } },
    { name: 'Steamed Veg Momos', price: 150, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Steamed Chicken Momos', price: 170, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Fried Veg Momos', price: 160, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Fried Chicken Momos', price: 180, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Kurkure Veg Momos', price: 180, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Kurkure Chicken Momos', price: 200, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SNACK_BOX'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_SAUCE_CUP'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SNACK_BOX']] } },
    { name: 'Schezwan Fried Rice', price: 220, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Schezwan Noodles', price: 210, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Hakka Noodles', price: 200, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Veg Fried Rice', price: 210, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Fried Rice', price: 240, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken Lollipop', price: 280, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Crispy Chicken', price: 270, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Paneer Crispy', price: 250, category: 'Starter', packagingLogic: { takeaway: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_CHINESE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_CHINESE_BOWL']] } },
    { name: 'Chicken White Mandi', price: 450, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_MANDI_CONTAINER'], pkgIds['PKG_FOIL'], pkgIds['PKG_SPOON'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mix-Veg Uttapam', price: 180, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Plain Dosa', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Masala Dosa', price: 150, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Butter Dosa', price: 160, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Masala Uttapam', price: 170, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Onion Rava Dosa', price: 160, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Medu Vada', price: 100, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Regular Idli', price: 100, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Mini Idli', price: 120, category: 'South Indian', packagingLogic: { takeaway: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_SOUTH_INDIAN_CONTAINER'], pkgIds['PKG_CARRY_BAG']], dineIn: [] } },
    { name: 'Chicken Kali Mirch', price: 360, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_PREMIUM_WHITE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_PREMIUM_WHITE_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_PREMIUM_WHITE_BOWL']] } },
    { name: 'Chicken Lababdar', price: 370, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Mutton Rara', price: 390, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },
    { name: 'Chicken Pasanda', price: 410, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_ROYAL_BOWL'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_ROYAL_BOWL']] } },
    { name: 'Chicken Rara', price: 380, category: 'Main Course', packagingLogic: { takeaway: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['PKG_EARTHEN_HANDI'], pkgIds['PKG_LID'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_EARTHEN_HANDI']] } },

  ];

  const recipeMappings: Record<string, { itemModel: 'RawMaterial' | 'SemiFinishedGood' | 'Packaging'; code: string; quantity: number }[]> = {
    'Red Sauce Pasta': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_WATER_STOCK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 10 }
    ],
    'White Sauce Pasta': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Pink Sauce Pasta': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_WATER_STOCK', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 25 },
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Large Farmhouse Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAUCE_PORTION_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESE_PORTION_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PORTION_LARGE', quantity: 1 }
    ],
    'Personal Farmhouse Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAUCE_PORTION_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESE_PORTION_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PORTION_PERSONAL', quantity: 1 }
    ],
    'Medium Farmhouse Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAUCE_PORTION_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESE_PORTION_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PORTION_MEDIUM', quantity: 1 }
    ],
    'Personal Classic Veg Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAUCE_PORTION_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESE_PORTION_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PORTION_PERSONAL', quantity: 1 }
    ],
    'Medium Classic Veg Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAUCE_PORTION_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESE_PORTION_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PORTION_MEDIUM', quantity: 1 }
    ],
    'Large Classic Veg Pizza': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SAUCE_PORTION_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESE_PORTION_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PORTION_LARGE', quantity: 1 }
    ],
    'Personal Corn Cheese Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CORN_RAW', quantity: 30 }
    ],
    'Medium Corn Cheese Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 75.0 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 135.0 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 60.0 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 4.5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CORN_RAW', quantity: 45.0 }
    ],
    'Large Corn Cheese Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 6 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CORN_RAW', quantity: 60 }
    ],
    'Personal Paneer Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 40 }
    ],
    'Medium Paneer Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 75.0 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 135.0 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 60.0 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 4.5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 60.0 }
    ],
    'Large Paneer Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 6 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_PANEER_RAW', quantity: 80 }
    ],
    'Personal Chicken Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PORTION_PERSONAL', quantity: 1 }
    ],
    'Medium Chicken Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_MEDIUM', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 75.0 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 135.0 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 60.0 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 4.5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PORTION_PERSONAL', quantity: 1.5 }
    ],
    'Large Chicken Pizza': [
            { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 6 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PORTION_PERSONAL', quantity: 2 }
    ],
    'Garlic Bread': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_GARLIC_BUTTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHEESY_GARLIC_DIP', quantity: 1 }
    ],
    'Chicken Wings': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_WINGS', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Chicken Strips': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_STRIPS', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Chicken Popcorn': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_POPCORN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Chicken Leg Piece': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_LEG', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],
    'Classic Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Crispy Veggie Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Tandoori Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_TANDOORI_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Paneer Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Classic Chicken Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Zinger Burger': [
      { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ZINGER_PATTY', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_SPICY_BURGER_SAUCE', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],
    'Crispy Chicken Sandwich': [
            { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Classic Corn Cheese Sandwich': [
            { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CORN_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Veg Grilled Club': [
            { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],
    'Peri-Peri Paneer Sandwich': [
            { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_FILLING', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],

    'Veg Wrap': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }
    ],
    'Chicken Wrap': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }
    ],
    'Club Sandwich': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 3 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }
    ],
    'Cold Coffee': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 }
    ],
    'Chocolate Shake': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 45 }
    ],
    'Vanilla Shake': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_VANILLA_CORE', quantity: 30 }
    ],
    'Strawberry Shake': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_STRAWBERRY_CORE', quantity: 20 }
    ],
    'Mango Shake': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C507_SNOW_BASE', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_MANGO_SYRUP', quantity: 20 }
    ],
    'Oreo Shake': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_OREO_ADDON', quantity: 2 }
    ],
    'KitKat Shake': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_KITKAT_ADDON', quantity: 1 }
    ],
    'Hazelnut Shake': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_HAZELNUT_SYRUP', quantity: 15 }
    ],
    'Hot Coffee': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_HOT_COFFEE_BASE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_PREMIX', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 15 }
    ],
    'Mocha Frappe': [
            { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_C508_COCOA_BASE', quantity: 35 },
      { itemModel: 'RawMaterial', code: 'RM_COFFEE_POWDER', quantity: 10 }
    ],
    'Mini Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_SMALL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Regular Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Large Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Small Mix Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_SMALL', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Regular Mix Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Large Mix Veg Uttapam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER_LARGE', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_TOPPING', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Shahi Lucknowi Biryani': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BIRYANI_BATCH', quantity: 1 }
    ],
    'Kyroz Indo Arabic White Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_BATCH', quantity: 1 }
    ],
    'Kyroz Mutton Mandi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MANDI_BATCH_MUTTON', quantity: 1 }
    ],
    'Mini Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 90 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 120 }
    ],
    'Regular Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 130 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 120 }
    ],
    'Large Rice Idli': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 170 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 120 }
    ],
    'Medu Vada Portion': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 120 }
    ],
    'Single Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 0.5 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 120 }
    ],
    'Double Medu Vada': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 120 }
    ],
    'Small Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 75 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Regular Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 95 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Large Masala Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 115 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Small Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_SMALL', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 10 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Regular Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_REGULAR', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 15 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Large Onion Rava Dosa': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_LARGE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OIL_GHEE', quantity: 20 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: 100 }
    ],
    'Peri Peri Fries': [
      { itemModel: 'RawMaterial', code: 'RM_FRIES_RAW', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 30 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_FIRE_DUST_FRIES', quantity: 1 }
    ],
    'Desi Handi Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 300 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_TEJ_PATTA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CLOVES', quantity: 4 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CORIANDER_POWDER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 50 }
    ],
    'Barrah Masala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_BARRAH', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 }
    ],
    'Butter Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 22 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Chicken Changezi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 50 }
    ],
    'Chicken Curry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_CARDAMOM', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CLOVES', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],


    'Chicken Kali Mirch': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_GREEN_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 22 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Chicken Lababdar': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_CAPSICUM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KITCHEN_KING', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 }
    ],
    'Chicken Mutton Rara': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_KEEMA', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 }
    ],
    'Chicken Pasanda': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 180 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 8 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_ALMOND_PASTE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SUGAR', quantity: 2 }
    ],
    'Chicken Rara': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_MUTTON', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_KEEMA', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 }
    ],'Chicken Tikka': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chicken Half': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chicken Full': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 8 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 60 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Chicken Malai Tikka': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Afghani Chicken Half': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Afghani Chicken Full': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Chicken Seekh Kebab': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_SEEKH_T606', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Al Faham Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_ALFAHAM_T607', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_GARLIC_MAYO_HUMMUS', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'Packaging', code: 'PKG_ARABIAN_PLATTER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_KHABOOS', quantity: 1 }
    ],
    'Tandoori Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Tandoori Momos': [
      { itemModel: 'RawMaterial', code: 'RM_VEG_MOMOS', quantity: 6 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MOMO_CHUTNEY', quantity: 20 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Malai Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Hariyali Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Paneer': [
      { itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Chaap': [
      { itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ],
    'Achari Mushroom': [
      { itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_T602A_PASTE', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }
    ]

  };

  for (const dish of dishData) {
    const doc = await (Dish as any).findOneAndUpdate(
      { name: dish.name, userId }, 
      { 
        $set: { packagingLogic: dish.packagingLogic, category: dish.category, price: dish.price },
        $setOnInsert: { userId } 
      }, 
      { upsert: true, new: true }
    );
    
    // Create recipe mapping
    const mapping = recipeMappings[dish.name];
    if (mapping) {
      const ingredients = mapping.map(m => {
        let id;
        if (m.itemModel === 'RawMaterial') {
          id = rmIds[m.code];
        } else if (m.itemModel === 'SemiFinishedGood') {
          id = sfgIds[m.code];
        } else if (m.itemModel === 'Packaging') {
          id = pkgIds[m.code];
        }
        return {
          itemModel: m.itemModel,
          itemId: id,
          quantity: m.quantity
        };
      }).filter(ing => ing.itemId !== undefined);

      await (Recipe as any).findOneAndUpdate(
        { targetModel: 'Dish', targetId: doc._id, userId },
        {
          $set: {
            targetYield: 1,
            operationalYield: 1,
            ingredients
          },
          $setOnInsert: {
            userId
          }
        },
        { upsert: true }
      );
    }
  }

  // Seed Portion Stock (Inventory) for portion-tracked dishes
  const portionTrackedDishes = [
    { name: 'Shahi Lucknowi Biryani', yield: 9 },
    { name: 'Kyroz Indo Arabic White Mandi', yield: 6 },
    { name: 'Kyroz Mutton Mandi', yield: 6 }
  ];

  for (const track of portionTrackedDishes) {
    const dishDoc = await (Dish as any).findOne({ name: track.name, userId });
    if (dishDoc) {
      await (Inventory as any).findOneAndUpdate(
        { dishId: dishDoc._id, userId },
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
