import mongoose from 'mongoose';
import RawMaterial from './src/models/RawMaterial';

const rmData = [
  { code: 'RM_C506', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_C505', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_C501', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_C504', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_BUTTER', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_MILK', consumptionUnit: 'ml', conversionFactor: 1000 },
  { code: 'RM_MAYO', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_C510', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_MAIDA', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_FRYING_OIL', consumptionUnit: 'ml', conversionFactor: 1000 },
  { code: 'RM_CHICKEN_LEG', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_CHICKEN_WINGS', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_KETCHUP', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_C503', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_LIQUID_CHEESE', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_BREAD', consumptionUnit: 'slices', conversionFactor: 20 },
  { code: 'RM_MAIN_FILLING', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_CHEESE', consumptionUnit: 'pcs', conversionFactor: 50 },
  { code: 'RM_C509', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_PATTY_MIX', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_BREADCRUMBS', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_COFFEE_PREMIX', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_CHOCO_SYRUP', consumptionUnit: 'ml', conversionFactor: 1000 },
  { code: 'RM_VANILLA_CORE', consumptionUnit: 'ml', conversionFactor: 1000 },
  { code: 'RM_STRAWBERRY_CORE', consumptionUnit: 'ml', conversionFactor: 1000 },
  { code: 'RM_SUGAR', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_COASTAL_CRUST', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_CHICKEN_RAW', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_RICE_RAW', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_DAHI_RAW', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_OIL_GHEE', consumptionUnit: 'ml', conversionFactor: 1000 },
  { code: 'RM_B401_PREMIX', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_BURGER_BUN', consumptionUnit: 'pcs', conversionFactor: 6 },
  { code: 'RM_WRAP_SHEET', consumptionUnit: 'pcs', conversionFactor: 10 },
  { code: 'RM_PASTA_RAW', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_POTATO', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_S302_TEMPER', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_S303_RAVA', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_S304_CRUNCH', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_MUTTON_RAW', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_S305_STEAM', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_CORN_RAW', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_PANEER_RAW', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_MIXED_VEG', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_B404A_PREMIX', consumptionUnit: 'gm', conversionFactor: 1000 },
  { code: 'RM_B404B_PREMIX', consumptionUnit: 'gm', conversionFactor: 1000 }
];

import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kyroz';

mongoose.connect(mongoUri).then(async () => {
  for (const rm of rmData) {
    const res = await RawMaterial.updateMany(
      { code: rm.code },
      { $set: { consumptionUnit: rm.consumptionUnit, conversionFactor: rm.conversionFactor } }
    );
    console.log('Updated', rm.code, 'in', res.modifiedCount, 'accounts');
  }
  mongoose.disconnect();
});
