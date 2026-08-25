import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import RawMaterial from '../src/models/RawMaterial';
import SemiFinishedGood from '../src/models/SemiFinishedGood';
import Packaging from '../src/models/Packaging';
import Dish from '../src/models/Dish';
import Recipe from '../src/models/Recipe';
import Inventory from '../src/models/Inventory';
import User from '../src/models/User';

const CATEGORY = 'INDIAN VEG';

const rawMaterialsData = [
  { code: 'RM_G201', name: 'G-201 SUNSET BASE', unit: 'kg' },
  { code: 'RM_G202', name: 'G-202 IVORY BASE', unit: 'kg' },
  { code: 'RM_G203', name: 'G-203 EMERALD MIX', unit: 'kg' },
  { code: 'RM_G204', name: 'G-204 ROASTED RUST', unit: 'kg' },
  { code: 'RM_G205', name: 'G-205 ROYAL ROGAN', unit: 'kg' },
  { code: 'RM_K801', name: 'K-801 ROYAL PUNCH', unit: 'kg' },
  { code: 'RM_K802', name: 'K-802 WOK SPICE', unit: 'kg' },
  { code: 'RM_K806', name: 'K-806 ZESTFUL ZING', unit: 'kg' },
  
  // Veggies & Base
  { code: 'RM_POTATO', name: 'Pre-fried Potato Cubes', unit: 'kg' },
  { code: 'RM_CAULI', name: 'Pre-fried Cauliflower Florets', unit: 'kg' },
  { code: 'RM_PEAS', name: 'Boiled Green Peas', unit: 'kg' },
  { code: 'RM_CORN', name: 'Boiled Sweet Corn', unit: 'kg' },
  { code: 'RM_MUSH', name: 'Button Mushroom', unit: 'kg' },
  { code: 'RM_CAPS', name: 'Capsicum Cubes', unit: 'kg' },
  { code: 'RM_ONION_C', name: 'Onion Cubes', unit: 'kg' },
  { code: 'RM_ONION_P', name: 'Onion Petals', unit: 'kg' },
  { code: 'RM_MIXVEG_B', name: 'Blanched Mix Vegetables', unit: 'kg' },
  { code: 'RM_MIXVEG_S', name: 'Pre-steamed Mix Veg', unit: 'kg' },

  // Proteins & Dairy
  { code: 'RM_PANEER', name: 'Fresh Paneer', unit: 'kg' },
  { code: 'RM_PANEER_G', name: 'Grated Paneer', unit: 'kg' },
  { code: 'RM_PANEER_C', name: 'Paneer Cubes', unit: 'kg' },
  { code: 'RM_PANEER_S', name: 'Paneer Sticks', unit: 'kg' },
  { code: 'RM_CHEESE', name: 'Processed Cheese', unit: 'kg' },
  { code: 'RM_BUTTER', name: 'Butter', unit: 'kg' },
  { code: 'RM_GHEE', name: 'Desi Ghee', unit: 'kg' },
  { code: 'RM_OIL', name: 'Refined Oil', unit: 'L' },
  { code: 'RM_CREAM', name: 'Fresh Cream', unit: 'L' },
  { code: 'RM_CURD', name: 'Curd', unit: 'kg' },
  { code: 'RM_MILK', name: 'Milk', unit: 'L' },

  // Spices & Herbs
  { code: 'RM_JEERA', name: 'Jeera', unit: 'kg' },
  { code: 'RM_HING', name: 'Hing', unit: 'kg' },
  { code: 'RM_GGP', name: 'Ginger Garlic Paste', unit: 'kg' },
  { code: 'RM_GC', name: 'Green Chilli', unit: 'kg' },
  { code: 'RM_KASH_CH', name: 'Kashmiri Chilli', unit: 'kg' },
  { code: 'RM_KASOORI', name: 'Kasoori Methi', unit: 'kg' },
  { code: 'RM_BP', name: 'Crushed Black Pepper', unit: 'kg' },
  { code: 'RM_COR', name: 'Fresh Coriander', unit: 'kg' },
  { code: 'RM_GIN_J', name: 'Ginger Juliennes', unit: 'kg' },
  { code: 'RM_RED_CH', name: 'Dry Red Chilli', unit: 'pcs' },
  { code: 'RM_GARLIC_C', name: 'Chopped Garlic', unit: 'kg' },
  { code: 'RM_CARD', name: 'Green Cardamom', unit: 'pcs' },
  { code: 'RM_CARD_P', name: 'Cardamom Powder', unit: 'kg' },
  { code: 'RM_MACE', name: 'Mace', unit: 'kg' },
  { code: 'RM_SALT', name: 'Salt', unit: 'kg' },

  // Sweeteners & Fruits/Nuts
  { code: 'RM_SUGAR', name: 'Sugar', unit: 'kg' },
  { code: 'RM_HONEY', name: 'Honey', unit: 'kg' },
  { code: 'RM_SUGAR_HONEY', name: 'Sugar/Honey', unit: 'kg' },
  { code: 'RM_PINEAPPLE', name: 'Pineapple Chunks', unit: 'kg' },
  { code: 'RM_CASHEW', name: 'Fried Cashew', unit: 'kg' },
  { code: 'RM_RAISIN', name: 'Raisins', unit: 'kg' },
  { code: 'RM_ALMOND', name: 'Almond Flakes', unit: 'kg' },
  { code: 'RM_POM', name: 'Pomegranate Seeds', unit: 'kg' },
  
  // Miscellaneous
  { code: 'RM_WATER', name: 'Water', unit: 'L' },
  { code: 'RM_WATER_H', name: 'Hot Water', unit: 'L' },
  { code: 'RM_STOCK', name: 'Capsicum/Onion Stock', unit: 'L' },
  { code: 'RM_STOCK_V', name: 'Vegetable Stock / Water', unit: 'L' },
  { code: 'RM_VINEGAR', name: 'Vinegar/Lemon Juice', unit: 'L' },

  // Pre-made/Third Party
  { code: 'RM_KOFTA_W', name: 'Premium Fried Stuffed Paneer & Khoya Kofta', unit: 'pcs' },
  { code: 'RM_KOFTA_M', name: 'Malai Kofta', unit: 'pcs' },
  { code: 'RM_PANEER_SW', name: 'Paneer Sandwiches (Stuffed)', unit: 'pcs' },
  { code: 'RM_MAKHANA', name: 'Roasted Makhana', unit: 'kg' },
  { code: 'RM_MAKHANA_F', name: 'Fried Makhana', unit: 'kg' },
];

const sfgData = [
  { code: 'SFG_G201', name: 'G-201 SUNSET BASE', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_G202', name: 'G-202 IVORY BASE', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_G203', name: 'G-203 EMERALD MIX', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_G204', name: 'G-204 ROASTED RUST', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_G205', name: 'G-205 ROYAL ROGAN', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_POTATO', name: 'Pre-fried Potato', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_CAULI', name: 'Pre-fried Cauliflower', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_PEAS', name: 'Boiled Green Peas', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_PANEER_C', name: 'Paneer Cubes', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_VEGMIX', name: 'Kadhai Veg Mix', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_GARLIC', name: 'Golden Garlic Topping', batchYield: 1, yieldUnit: 'kg' },
  { code: 'SFG_KOFTA_W', name: 'Fried Kofta', batchYield: 100, yieldUnit: 'pcs' },
  { code: 'SFG_KOFTA_M', name: 'Malai Kofta', batchYield: 50, yieldUnit: 'pcs' },
  { code: 'SFG_PANEER_SW', name: 'Stuffed Paneer Sandwich', batchYield: 50, yieldUnit: 'pcs' },
  { code: 'SFG_MIXVEG_B', name: 'Blanched Veg Mix', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_MAKHANA', name: 'Fried Makhana', batchYield: 1, yieldUnit: 'kg' },
  { code: 'SFG_MIXVEG_S', name: 'Pre-steamed Mix Veg', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_MIXVEG_J', name: 'Blanched Mix Vegetables', batchYield: 5, yieldUnit: 'kg' },
  { code: 'SFG_ROAST_M', name: 'Roasted Makhana', batchYield: 1, yieldUnit: 'kg' },
];

const packagingData = [
  { code: 'PKG_IV_01', name: 'Flat Ceramic Plate / Oval Veg Dish', unit: 'pc' },
  { code: 'PKG_IV_02', name: 'Takeaway Container', unit: 'pc' },
  { code: 'PKG_IV_03', name: 'Carry Bag', unit: 'pc' },
  { code: 'PKG_IV_04', name: '500 ml Bowl', unit: 'pc' },
  { code: 'PKG_IV_05', name: 'Lid', unit: 'pc' },
  { code: 'PKG_IV_06', name: 'Copper Kadhai / Ceramic Handi', unit: 'pc' },
  { code: 'PKG_IV_07', name: 'Premium Deep Bowl/Handi', unit: 'pc' },
  { code: 'PKG_IV_08', name: 'Royal Handi/Bowl', unit: 'pc' },
  { code: 'PKG_IV_09', name: '500 ml Handi/Bowl', unit: 'pc' },
];

const dishesData = [
  {
    name: 'Aloo Gobhi Matar (Semi-Gravy)',
    price: 240,
    recipe: [
      { name: 'G-205 ROYAL ROGAN', type: 'SFG', qty: 150, unit: 'gm' },
      { name: 'Pre-fried Potato Cubes', type: 'RM', qty: 80, unit: 'gm' },
      { name: 'Pre-fried Cauliflower Florets', type: 'RM', qty: 80, unit: 'gm' },
      { name: 'Boiled Green Peas', type: 'RM', qty: 40, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Desi Ghee', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Hot Water', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Jeera', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Hing', type: 'RM', qty: 0.2, unit: 'gm' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Green Chilli', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Crushed Black Pepper', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Fresh Coriander', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Ginger Juliennes', type: 'RM', qty: 5, unit: 'gm' },
    ],
    pkgs: ['Flat Ceramic Plate / Oval Veg Dish', 'Takeaway Container', 'Carry Bag']
  },
  {
    name: 'Corn Palak Cheese',
    price: 280,
    recipe: [
      { name: 'G-203 EMERALD MIX', type: 'SFG', qty: 140, unit: 'gm' },
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 60, unit: 'gm' },
      { name: 'Boiled Sweet Corn', type: 'RM', qty: 40, unit: 'gm' },
      { name: 'Paneer Cubes', type: 'RM', qty: 50, unit: 'gm' },
      { name: 'Processed Cheese', type: 'RM', qty: 20, unit: 'gm' },
      { name: 'Butter', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Milk', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Green Chilli', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Sugar', type: 'RM', qty: 1, unit: 'gm' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Kadhai Paneer',
    price: 290,
    recipe: [
      { name: 'G-204 ROASTED RUST', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Fresh Paneer', type: 'RM', qty: 180, unit: 'gm' },
      { name: 'Capsicum Cubes', type: 'RM', qty: 20, unit: 'gm' },
      { name: 'Onion Cubes', type: 'RM', qty: 20, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Desi Ghee', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Capsicum/Onion Stock', type: 'RM', qty: 40, unit: 'ml' },
      { name: 'Dry Red Chilli', type: 'RM', qty: 2, unit: 'pcs' },
      { name: 'Jeera', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Curd', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-802 WOK SPICE', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Crushed Black Pepper', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Green Chilli', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Ginger Juliennes', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Fresh Coriander', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Grated Paneer', type: 'RM', qty: 5, unit: 'gm' },
    ],
    pkgs: ['Copper Kadhai / Ceramic Handi', 'Lid', 'Carry Bag']
  },
  {
    name: 'Lehsunia Paneer',
    price: 300,
    recipe: [
      { name: 'G-203 EMERALD MIX', type: 'SFG', qty: 160, unit: 'gm' },
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 40, unit: 'gm' },
      { name: 'Paneer Cubes', type: 'RM', qty: 150, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Desi Ghee', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Chopped Garlic', type: 'RM', qty: 20, unit: 'gm' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Green Chilli', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Water', type: 'RM', qty: 35, unit: 'ml' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Salt', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Golden Garlic Topping', type: 'SFG', qty: 10, unit: 'gm' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Malai Kofta (Ivory)',
    price: 320,
    recipe: [
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Fried Kofta', type: 'SFG', qty: 4, unit: 'pcs' },
      { name: 'Desi Ghee', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Milk', type: 'RM', qty: 40, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Green Cardamom', type: 'RM', qty: 2, unit: 'pcs' },
      { name: 'Mace', type: 'RM', qty: 0.25, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Sugar/Honey', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Cardamom Powder', type: 'RM', qty: 0.25, unit: 'gm' },
      { name: 'Almond Flakes', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Grated Paneer', type: 'RM', qty: 5, unit: 'gm' },
    ],
    pkgs: ['Premium Deep Bowl/Handi', 'Lid', 'Carry Bag']
  },
  {
    name: 'Malai Kofta Red',
    price: 310,
    recipe: [
      { name: 'G-201 SUNSET BASE', type: 'SFG', qty: 120, unit: 'gm' },
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 80, unit: 'gm' },
      { name: 'Malai Kofta', type: 'SFG', qty: 2, unit: 'pcs' },
      { name: 'Butter', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Water', type: 'RM', qty: 45, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Sugar/Honey', type: 'RM', qty: 3, unit: 'gm' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Mushroom Do Pyaza',
    price: 280,
    recipe: [
      { name: 'G-204 ROASTED RUST', type: 'SFG', qty: 120, unit: 'gm' },
      { name: 'G-205 ROYAL ROGAN', type: 'SFG', qty: 80, unit: 'gm' },
      { name: 'Button Mushroom', type: 'RM', qty: 120, unit: 'gm' },
      { name: 'Onion Petals', type: 'RM', qty: 60, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Butter', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Green Chilli', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'K-802 WOK SPICE', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Water', type: 'RM', qty: 25, unit: 'ml' },
      { name: 'Fresh Coriander', type: 'RM', qty: 2, unit: 'gm' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Navratan Korma',
    price: 330,
    recipe: [
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Blanched Mix Vegetables', type: 'RM', qty: 80, unit: 'gm' },
      { name: 'Fresh Paneer', type: 'RM', qty: 60, unit: 'gm' },
      { name: 'Fried Makhana', type: 'SFG', qty: 20, unit: 'gm' },
      { name: 'Pineapple Chunks', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Fried Cashew', type: 'RM', qty: 10, unit: 'gm' },
      { name: 'Raisins', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Desi Ghee', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Milk', type: 'RM', qty: 40, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Green Cardamom', type: 'RM', qty: 2, unit: 'pcs' },
      { name: 'Mace', type: 'RM', qty: 0.25, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Sugar/Honey', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Pomegranate Seeds', type: 'RM', qty: 5, unit: 'gm' },
    ],
    pkgs: ['Royal Handi/Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Palak Paneer',
    price: 270,
    recipe: [
      { name: 'G-203 EMERALD MIX', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Fresh Paneer', type: 'RM', qty: 180, unit: 'gm' },
      { name: 'Desi Ghee', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Vegetable Stock / Water', type: 'RM', qty: 40, unit: 'ml' },
      { name: 'Dry Red Chilli', type: 'RM', qty: 2, unit: 'pcs' },
      { name: 'Jeera', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Chopped Garlic', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Green Chilli', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Sugar', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Ginger Juliennes', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Grated Paneer', type: 'RM', qty: 5, unit: 'gm' },
    ],
    pkgs: ['Premium Bowl/Handi', 'Lid', 'Carry Bag']
  },
  {
    name: 'Paneer Butter Masala',
    price: 310,
    recipe: [
      { name: 'G-201 SUNSET BASE', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Fresh Paneer', type: 'RM', qty: 180, unit: 'gm' },
      { name: 'Butter', type: 'RM', qty: 20, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Milk', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Green Chilli', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Fresh Coriander', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Grated Paneer', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Honey', type: 'RM', qty: 2, unit: 'gm' },
    ],
    pkgs: ['Premium Bowl/Handi', 'Lid', 'Carry Bag']
  },
  {
    name: 'Paneer Dhaniya Adraki',
    price: 300,
    recipe: [
      { name: 'G-205 ROYAL ROGAN', type: 'SFG', qty: 140, unit: 'gm' },
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 60, unit: 'gm' },
      { name: 'Paneer Cubes', type: 'RM', qty: 150, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Desi Ghee', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Ginger Juliennes', type: 'RM', qty: 10, unit: 'gm' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Fresh Coriander', type: 'RM', qty: 10, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-802 WOK SPICE', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Water', type: 'RM', qty: 30, unit: 'ml' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Paneer Lababdar',
    price: 320,
    recipe: [
      { name: 'G-201 SUNSET BASE', type: 'SFG', qty: 140, unit: 'gm' },
      { name: 'G-205 ROYAL ROGAN', type: 'SFG', qty: 60, unit: 'gm' },
      { name: 'Paneer Cubes', type: 'RM', qty: 150, unit: 'gm' },
      { name: 'Butter', type: 'RM', qty: 8, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Ginger Juliennes', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'Fresh Coriander', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Water', type: 'RM', qty: 30, unit: 'ml' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Paneer Pasanda',
    price: 340,
    recipe: [
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 160, unit: 'gm' },
      { name: 'G-201 SUNSET BASE', type: 'SFG', qty: 40, unit: 'gm' },
      { name: 'Stuffed Paneer Sandwich', type: 'SFG', qty: 2, unit: 'pcs' },
      { name: 'Butter', type: 'RM', qty: 8, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Water', type: 'RM', qty: 35, unit: 'ml' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Fresh Coriander', type: 'RM', qty: 2, unit: 'gm' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Shahi Paneer',
    price: 310,
    recipe: [
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 200, unit: 'gm' },
      { name: 'Fresh Paneer', type: 'RM', qty: 180, unit: 'gm' },
      { name: 'Desi Ghee', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Milk', type: 'RM', qty: 40, unit: 'ml' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
    ],
    pkgs: ['Royal Handi/Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Signature Panch-Ratan Curry Veg',
    price: 350,
    recipe: [
      { name: 'G-201 SUNSET BASE', type: 'SFG', qty: 80, unit: 'gm' },
      { name: 'G-202 IVORY BASE', type: 'SFG', qty: 60, unit: 'gm' },
      { name: 'G-205 ROYAL ROGAN', type: 'SFG', qty: 60, unit: 'gm' },
      { name: 'Fresh Paneer', type: 'RM', qty: 40, unit: 'gm' },
      { name: 'Button Mushroom', type: 'RM', qty: 40, unit: 'gm' },
      { name: 'Boiled Sweet Corn', type: 'RM', qty: 30, unit: 'gm' },
      { name: 'Boiled Green Peas', type: 'RM', qty: 30, unit: 'gm' },
      { name: 'Roasted Makhana', type: 'SFG', qty: 20, unit: 'gm' },
      { name: 'Desi Ghee', type: 'RM', qty: 10, unit: 'gm' },
      { name: 'Butter', type: 'RM', qty: 5, unit: 'gm' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'K-802 WOK SPICE', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Milk', type: 'RM', qty: 40, unit: 'ml' },
      { name: 'Sugar/Honey', type: 'RM', qty: 3, unit: 'gm' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Veg Handi',
    price: 270,
    recipe: [
      { name: 'G-204 ROASTED RUST', type: 'SFG', qty: 80, unit: 'gm' },
      { name: 'G-201 SUNSET BASE', type: 'SFG', qty: 60, unit: 'gm' },
      { name: 'G-205 ROYAL ROGAN', type: 'SFG', qty: 60, unit: 'gm' },
      { name: 'Pre-steamed Mix Veg', type: 'RM', qty: 100, unit: 'gm' },
      { name: 'Paneer Cubes', type: 'RM', qty: 40, unit: 'gm' },
      { name: 'Butter', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 3, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'K-802 WOK SPICE', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Curd', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Fresh Cream', type: 'RM', qty: 15, unit: 'ml' },
      { name: 'Kasoori Methi', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Water', type: 'RM', qty: 40, unit: 'ml' },
    ],
    pkgs: ['500 ml Handi/Bowl', 'Lid', 'Carry Bag']
  },
  {
    name: 'Veg Jalfrezi',
    price: 260,
    recipe: [
      { name: 'G-204 ROASTED RUST', type: 'SFG', qty: 120, unit: 'gm' },
      { name: 'G-205 ROYAL ROGAN', type: 'SFG', qty: 80, unit: 'gm' },
      { name: 'Blanched Mix Vegetables', type: 'RM', qty: 100, unit: 'gm' },
      { name: 'Paneer Sticks', type: 'RM', qty: 40, unit: 'gm' },
      { name: 'Refined Oil', type: 'RM', qty: 10, unit: 'ml' },
      { name: 'Ginger Garlic Paste', type: 'RM', qty: 3, unit: 'gm' },
      { name: 'K-802 WOK SPICE', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'K-801 ROYAL PUNCH', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'K-806 ZESTFUL ZING', type: 'RM', qty: 0.5, unit: 'gm' },
      { name: 'Curd', type: 'RM', qty: 15, unit: 'gm' },
      { name: 'Kashmiri Chilli', type: 'RM', qty: 1, unit: 'gm' },
      { name: 'Sugar', type: 'RM', qty: 2, unit: 'gm' },
      { name: 'Vinegar/Lemon Juice', type: 'RM', qty: 5, unit: 'ml' },
      { name: 'Water', type: 'RM', qty: 20, unit: 'ml' },
    ],
    pkgs: ['500 ml Bowl', 'Lid', 'Carry Bag']
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    if (users.length === 0) {
      throw new Error('No user found in the database to link inventory to.');
    }
    
    for (const user of users) {
      const userId = user._id;
      console.log(`\n--- Seeding for User ID: ${userId} (${user.email}) ---`);

      const rmMap = new Map();
      const sfgMap = new Map();
      const pkgMap = new Map();

      // 1. Raw Materials
      for (const rm of rawMaterialsData) {
        let existing = await RawMaterial.findOne({ name: rm.name, userId });
        if (!existing) {
          existing = await RawMaterial.create({
            code: rm.code,
            name: rm.name,
            purchaseUnit: rm.unit,
            consumptionUnit: rm.unit,
            category: CATEGORY,
            currentStock: 100,
            costPerPurchaseUnit: 0,
            userId
          });
        }
        rmMap.set(rm.name, existing);
      }
      console.log(`Seeded ${rmMap.size} Raw Materials for ${user.email}`);

      // 2. SFGs
      for (const sfg of sfgData) {
        let existing = await SemiFinishedGood.findOne({ name: sfg.name, userId });
        if (!existing) {
          existing = await SemiFinishedGood.create({
            code: sfg.code,
            name: sfg.name,
            batchYield: sfg.batchYield,
            yieldUnit: sfg.yieldUnit,
            currentStock: 50,
            costPerUnit: 0,
            userId
          });
        }
        sfgMap.set(sfg.name, existing);
      }
      console.log(`Seeded ${sfgMap.size} SFGs for ${user.email}`);

      // 3. Packaging
      for (const pkg of packagingData) {
        let existing = await Packaging.findOne({ name: pkg.name, userId });
        if (!existing) {
          existing = await Packaging.create({
            code: pkg.code,
            name: pkg.name,
            unit: pkg.unit,
            currentStock: 500,
            costPerUnit: 0,
            userId
          });
        }
        pkgMap.set(pkg.name, existing);
      }
      console.log(`Seeded ${pkgMap.size} Packaging items for ${user.email}`);

      // 4. Dishes & Recipes
      for (const d of dishesData) {
        let dish = await Dish.findOne({ name: d.name, userId });
        if (!dish) {
          const pkgIds = d.pkgs.map(pName => pkgMap.get(pName)?._id).filter(Boolean);
          
          dish = await Dish.create({
            name: d.name,
            price: d.price,
            category: CATEGORY,
            ingredientPrice: 0,
            packagingLogic: {
              dineIn: [],
              takeaway: pkgIds,
              delivery: pkgIds
            },
            userId
          });

          // Create Inventory tracker
          await Inventory.create({
            dishId: dish._id,
            platesPerPacket: 10,
            totalPlates: 100,
            userId
          });
        }

        // Create Recipe
        let recipe = await Recipe.findOne({ targetModel: 'Dish', targetId: dish._id, userId });
        if (recipe) {
          await Recipe.deleteOne({ _id: recipe._id });
        }

        const ingredients = d.recipe.map(r => {
          let itemId;
          let itemModel;
          
          if (r.type === 'RM') {
            itemId = rmMap.get(r.name)?._id;
            itemModel = 'RawMaterial';
          } else if (r.type === 'SFG') {
            itemId = sfgMap.get(r.name)?._id;
            itemModel = 'SemiFinishedGood';
          }

          let qty = r.qty;
          if (r.unit === 'ml' || r.unit === 'gm') {
            const rmInfo = rmMap.get(r.name);
            const sfgInfo = sfgMap.get(r.name);
            
            if (rmInfo && rmInfo.consumptionUnit === 'L' && r.unit === 'ml') qty = qty / 1000;
            if (rmInfo && rmInfo.consumptionUnit === 'kg' && r.unit === 'gm') qty = qty / 1000;
            
            if (sfgInfo && sfgInfo.yieldUnit === 'L' && r.unit === 'ml') qty = qty / 1000;
            if (sfgInfo && sfgInfo.yieldUnit === 'kg' && r.unit === 'gm') qty = qty / 1000;
          }

          return {
            itemModel,
            itemId,
            quantity: qty
          };
        }).filter(i => i.itemId);

        const packagingItems = d.pkgs.map(pName => {
          const pId = pkgMap.get(pName)?._id;
          if (!pId) return null;
          return {
            itemModel: 'Packaging',
            itemId: pId,
            quantity: 1
          };
        }).filter(Boolean);

        await Recipe.create({
          targetModel: 'Dish',
          targetId: dish._id,
          targetYield: 1,
          operationalYield: 1,
          ingredients: [...ingredients, ...packagingItems],
          userId
        });
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
