const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add portionData and PortionMaster seeding block
const portionBlock = `
  // Portions
  const portionData = [
    { code: 'PORTION_PIZZA_DOUGH_PERSONAL', name: 'Personal Pizza Dough Ball', sfgCode: 'SFG_PIZZA_DOUGH', quantity: 150, unit: 'gm' },
    { code: 'PORTION_PIZZA_DOUGH_MEDIUM', name: 'Medium Pizza Dough Ball', sfgCode: 'SFG_PIZZA_DOUGH', quantity: 240, unit: 'gm' },
    { code: 'PORTION_PIZZA_DOUGH_LARGE', name: 'Large Pizza Dough Ball', sfgCode: 'SFG_PIZZA_DOUGH', quantity: 350, unit: 'gm' },
    { code: 'PORTION_ALOO_PATTY', name: 'Aloo Patty', sfgCode: 'SFG_VEG_PATTY_MIX', quantity: 75, unit: 'gm' },
    { code: 'PORTION_VEG_PATTY', name: 'Veg Patty', sfgCode: 'SFG_VEG_PATTY_MIX', quantity: 75, unit: 'gm' },
    { code: 'PORTION_CHICKEN_PATTY', name: 'Chicken Patty', sfgCode: 'SFG_CHICKEN_PATTY_MIX', quantity: 77, unit: 'gm' },
    { code: 'PORTION_PANEER_PATTY', name: 'Paneer Patty', sfgCode: 'SFG_PANEER_PATTY_MIX', quantity: 76, unit: 'gm' },
    { code: 'PORTION_ZINGER_PATTY', name: 'Zinger Patty', sfgCode: 'SFG_ZINGER_PATTY', quantity: 120, unit: 'gm' },
    { code: 'PORTION_CLASSIC_BURGER_SAUCE', name: 'Classic Burger Sauce Portion', sfgCode: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 30, unit: 'gm' },
    { code: 'PORTION_TANDOORI_BURGER_SAUCE', name: 'Tandoori Burger Sauce Portion', sfgCode: 'SFG_TANDOORI_BURGER_SAUCE', quantity: 30, unit: 'gm' },
    { code: 'PORTION_SPICY_BURGER_SAUCE', name: 'Spicy Burger Sauce Portion', sfgCode: 'SFG_SPICY_BURGER_SAUCE', quantity: 30, unit: 'gm' },
    { code: 'PORTION_CHEESY_GARLIC_DIP', name: 'Cheesy Garlic Dip Portion', sfgCode: 'SFG_CHEESY_GARLIC_DIP', quantity: 30, unit: 'gm' },
    { code: 'PORTION_GARLIC_BUTTER', name: 'Herb Garlic Butter Portion', sfgCode: 'SFG_GARLIC_BUTTER', quantity: 20, unit: 'gm' },
    { code: 'PORTION_HERB_GARLIC_MAYO_15', name: 'Herb Garlic Mayo 15gm', sfgCode: 'SFG_HERB_GARLIC_MAYO', quantity: 15, unit: 'gm' },
    { code: 'PORTION_FIRE_DUST_FRIES', name: 'Fire Dust for Fries', sfgCode: 'SFG_DRY_SEASONING_BATCH', quantity: 12, unit: 'gm' },
    { code: 'PORTION_FIRE_DUST_NUGGETS', name: 'Fire Dust for Nuggets', sfgCode: 'SFG_DRY_SEASONING_BATCH', quantity: 8, unit: 'gm' },
    { code: 'PORTION_FIRE_DUST_GRILL', name: 'Fire Dust for Grill', sfgCode: 'SFG_DRY_SEASONING_BATCH', quantity: 5, unit: 'gm' },
    { code: 'PORTION_FIRE_DUST_BURGER', name: 'Fire Dust for Burger', sfgCode: 'SFG_DRY_SEASONING_BATCH', quantity: 1, unit: 'gm' },
    { code: 'PORTION_MARINATED_CHICKEN_POPCORN', name: 'Popcorn Chicken Portion', sfgCode: 'SFG_MARINATED_CHICKEN_POPCORN', quantity: 180, unit: 'gm' },
    { code: 'PORTION_MARINATED_CHICKEN_STRIPS', name: 'Strips Chicken Portion', sfgCode: 'SFG_MARINATED_CHICKEN_STRIPS', quantity: 180, unit: 'gm' },
    { code: 'PORTION_MARINATED_CHICKEN_WINGS', name: 'Wings Chicken Portion', sfgCode: 'SFG_MARINATED_CHICKEN_WINGS', quantity: 200, unit: 'gm' },
    { code: 'PORTION_MARINATED_CHICKEN_LEG', name: 'Leg Chicken Portion', sfgCode: 'SFG_MARINATED_CHICKEN_LEG', quantity: 250, unit: 'gm' },
    { code: 'PORTION_DRY_COATING_60', name: 'Dry Coating 60gm', sfgCode: 'SFG_DRY_COATING', quantity: 60, unit: 'gm' },
    { code: 'PORTION_DRY_COATING_65', name: 'Dry Coating 65gm', sfgCode: 'SFG_DRY_COATING', quantity: 65, unit: 'gm' },
    { code: 'PORTION_DRY_COATING_80', name: 'Dry Coating 80gm', sfgCode: 'SFG_DRY_COATING', quantity: 80, unit: 'gm' },
  ];

  const portionIds: any = {};
  for (const port of portionData) {
    const sfgId = sfgIds[port.sfgCode];
    if (!sfgId) continue;
    const doc = await PortionMaster.findOneAndUpdate(
      { name: port.name, userId },
      { 
        $set: { 
          ingredients: [{ sfgId, quantity: port.quantity, unit: port.unit }]
        } 
      },
      { upsert: true, new: true }
    );
    portionIds[port.code] = doc._id;
  }

  // Dishes
`;

content = content.replace('  // Dishes\n', portionBlock);

// 2. Replace the dishRecipeMappings strings
const replacements = [
  // C-501 Dough
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_PERSONAL', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_PIZZA_DOUGH_PERSONAL', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_MEDIUM', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_PIZZA_DOUGH_MEDIUM', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_DOUGH_LARGE', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_PIZZA_DOUGH_LARGE', quantity: 1 }" },
  
  // C-502 Patty
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_PATTY', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_ALOO_PATTY', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_VEG_PATTY', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_CHICKEN_PATTY', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_CHICKEN_PATTY', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_PANEER_PATTY', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_PANEER_PATTY', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_ZINGER_PATTY', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_ZINGER_PATTY', quantity: 1 }" },
  
  // C-503 Sauces (Classic Burger uses 20g of CLASSIC_BURGER_SAUCE, but now we use portion. For portion we just use 1 quantity)
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_CLASSIC_BURGER_SAUCE', quantity: 20 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_CLASSIC_BURGER_SAUCE', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_TANDOORI_BURGER_SAUCE', quantity: 20 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_TANDOORI_BURGER_SAUCE', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_SPICY_BURGER_SAUCE', quantity: 20 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_SPICY_BURGER_SAUCE', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_CHEESY_GARLIC_DIP', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_CHEESY_GARLIC_DIP', quantity: 1 }" },
  
  // C-504 Herb Butter/Mayo
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_GARLIC_BUTTER', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_GARLIC_BUTTER', quantity: 1 }" },
  // Wait, in sandwiches it might use HERB_GARLIC_MAYO quantity 1. Let's map it:
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_HERB_GARLIC_MAYO_15', quantity: 1 }" },

  // C-509 Fire Dust
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_FIRE_DUST_WRAP', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_FIRE_DUST_BURGER', quantity: 1 }" },
  
  // C-510 Crispy Chicken
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_WINGS', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_WINGS', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_STRIPS', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_STRIPS', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_POPCORN', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_POPCORN', quantity: 1 }" },
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_LEG', quantity: 1 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_MARINATED_CHICKEN_LEG', quantity: 1 }" },
  // Dry Coating replaces 100g of dry coating with specific portion
  // But wait, the dry coating is currently 100 everywhere. Let's just make it a single portion.
  { from: "{ itemModel: 'SemiFinishedGood', code: 'SFG_DRY_COATING', quantity: 100 }", to: "{ itemModel: 'PortionMaster', code: 'PORTION_DRY_COATING_80', quantity: 1 }" }
];

for (const r of replacements) {
  content = content.split(r.from).join(r.to);
}

// 3. We also need to map the portionIds in the dish loop!
const mapIdStr = `const id = m.itemModel === 'RawMaterial' ? rmIds[m.code] : sfgIds[m.code];`;
const newMapIdStr = `let id = null;
      if (m.itemModel === 'RawMaterial') id = rmIds[m.code];
      else if (m.itemModel === 'SemiFinishedGood') id = sfgIds[m.code];
      else if (m.itemModel === 'PortionMaster') id = portionIds[m.code];`;

content = content.replace(mapIdStr, newMapIdStr);

// Let's replace the one in dishRecipeMappings too
const dishMapIdStr = `const id = m.itemModel === 'RawMaterial' ? rmIds[m.code] : sfgIds[m.code];`;
const newDishMapIdStr = `let id = null;
      if (m.itemModel === 'RawMaterial') id = rmIds[m.code];
      else if (m.itemModel === 'SemiFinishedGood') id = sfgIds[m.code];
      else if (m.itemModel === 'PortionMaster') id = portionIds[m.code];`;
      
content = content.replace(dishMapIdStr, newDishMapIdStr); // this replaces the first occurrence (SFGs), let's replace globally just in case.

content = content.split(`const id = m.itemModel === 'RawMaterial' ? rmIds[m.code] : sfgIds[m.code];`).join(`let id = null;
      if (m.itemModel === 'RawMaterial') id = rmIds[m.code];
      else if (m.itemModel === 'SemiFinishedGood') id = sfgIds[m.code];
      else if (m.itemModel === 'PortionMaster') id = portionIds[m.code];`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Seeder successfully patched with new architectures!');
