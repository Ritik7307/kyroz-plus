const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const patches = [
  {
    from: `    'Chicken Popcorn': [
      { itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_POPCORN', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_DRY_COATING_80', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],`,
    to: `    'Chicken Popcorn': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_POPCORN', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],`
  },
  {
    from: `    'Chicken Strips': [
      { itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_STRIPS', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_DRY_COATING_80', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],`,
    to: `    'Chicken Strips': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_STRIPS', quantity: 180 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],`
  },
  {
    from: `    'Chicken Wings': [
      { itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_WINGS', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_DRY_COATING_80', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],`,
    to: `    'Chicken Wings': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_WINGS', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 65 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 12 },
      { itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }
    ],`
  },
  {
    from: `    'Chicken Leg Piece': [
      { itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_LEG', quantity: 1 },
      { itemModel: 'PortionMaster', code: 'PORTION_DRY_COATING_80', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 50 }
    ],`,
    to: `    'Chicken Leg Piece': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_LEG', quantity: 250 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 80 },
      { itemModel: 'RawMaterial', code: 'RM_FRYING_OIL', quantity: 15 },
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

// Convert PORTION_FIRE_DUST_BURGER to RM_C509 in Pizzas for complete raw material accuracy
content = content.replace(/\{ itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 \}/g, "{ itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 3 applied successfully! Replaced:', replaced);
