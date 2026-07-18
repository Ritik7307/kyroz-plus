const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const patches = [
  {
    from: `    'Pink Sauce Pasta': [
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
    ],`,
    to: `    'Pink Sauce Pasta': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 150 },
      { itemModel: 'RawMaterial', code: 'RM_WATER_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_C505', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_C506', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],`
  },
  {
    from: `    'Veg Wrap': [
      { itemModel: 'PortionMaster', code: 'PORTION_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 }
    ],`,
    to: `    'Veg Wrap': [
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY_MIX', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1.5 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],`
  },
  {
    from: `    'Chicken Wrap': [
      { itemModel: 'PortionMaster', code: 'PORTION_CHICKEN_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 }
    ],`,
    to: `    'Chicken Wrap': [
      { itemModel: 'RawMaterial', code: 'RM_WRAP_SHEET', quantity: 1 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICK', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1.5 },
      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }
    ],`
  },
  {
    from: `    'Club Sandwich': [
      { itemModel: 'PortionMaster', code: 'PORTION_VEG_PATTY', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 3 },
      { itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 }
    ],`,
    to: `    'Club Sandwich': [
      { itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_GARLIC_BUTTER', quantity: 0.75 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],`
  }
];

let replaced = 0;
patches.forEach(p => {
  if (content.includes(p.from)) {
    content = content.replace(p.from, p.to);
    replaced++;
  } else {
    console.error('Could not find section to patch for:', p.to.split(':')[0].trim());
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 2 applied successfully! Replaced:', replaced);
