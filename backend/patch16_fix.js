const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ensure missing Raw Materials exist
const newRms = `    { code: 'RM_CHAAT_MASALA', name: 'Chaat Masala', category: 'Condiment', purchaseUnit: 'kg', consumptionUnit: 'gm', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 400 },
    { code: 'RM_GARLIC_MAYO_HUMMUS', name: 'Garlic Mayo/Hummus', category: 'Condiment', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 2000, costPerPurchaseUnit: 250 },
    { code: 'RM_MINT_CHUTNEY', name: 'Mint Chutney', category: 'Condiment', purchaseUnit: 'litre', consumptionUnit: 'ml', conversionFactor: 1000, currentStock: 5000, costPerPurchaseUnit: 100 },\n`;

// Insert RMs if they aren't there
if (!content.includes('RM_CHAAT_MASALA')) {
  content = content.replace("  ];\n\n  const pkgIds", newRms + "  ];\n\n  const pkgIds");
}

// Helper to replace whole arrays in sfgRecipeMappings
const replaceRecipe = (dishName, newRecipe) => {
  const regex = new RegExp(`('${dishName}': \\[)([\\s\\S]*?)(\\])`, 'g');
  content = content.replace(regex, `$1\n${newRecipe}\n    $3`);
};

// 2. Fix T-604, T-605, T-606, T-607 Recipes
replaceRecipe('Chicken Tikka', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);

replaceRecipe('Tandoori Chicken Half', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);

replaceRecipe('Tandoori Chicken Full', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 8 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 60 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);

replaceRecipe('Chicken Malai Tikka', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 210 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);

replaceRecipe('Afghani Chicken Half', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 500 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);

replaceRecipe('Afghani Chicken Full', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 1000 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);

replaceRecipe('Chicken Seekh Kebab', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_SEEKH_T606', quantity: 90 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CHAAT_MASALA', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);

replaceRecipe('Al Faham Chicken', `      { itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_ALFAHAM_T607', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_GARLIC_MAYO_HUMMUS', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 10 },
      { itemModel: 'Packaging', code: 'PKG_ARABIAN_PLATTER', quantity: 1 },
      { itemModel: 'Packaging', code: 'PKG_KHABOOS', quantity: 1 }`);

// 3. Fix Veg Tandoor
const vegItems = [
  { name: 'Tandoori Paneer', baseRM: 'RM_PANEER', pasteSFG: 'SFG_T601_PASTE' },
  { name: 'Tandoori Chaap', baseRM: 'RM_SOYA_CHAAP', pasteSFG: 'SFG_T601_PASTE' },
  { name: 'Tandoori Mushroom', baseRM: 'RM_BUTTON_MUSHROOM', pasteSFG: 'SFG_T601_PASTE' },
  { name: 'Malai Paneer', baseRM: 'RM_PANEER', pasteSFG: 'SFG_T602_PASTE' },
  { name: 'Malai Chaap', baseRM: 'RM_SOYA_CHAAP', pasteSFG: 'SFG_T602_PASTE' },
  { name: 'Malai Mushroom', baseRM: 'RM_BUTTON_MUSHROOM', pasteSFG: 'SFG_T602_PASTE' },
  { name: 'Hariyali Paneer', baseRM: 'RM_PANEER', pasteSFG: 'SFG_T603_PASTE' },
  { name: 'Hariyali Chaap', baseRM: 'RM_SOYA_CHAAP', pasteSFG: 'SFG_T603_PASTE' },
  { name: 'Hariyali Mushroom', baseRM: 'RM_BUTTON_MUSHROOM', pasteSFG: 'SFG_T603_PASTE' },
  { name: 'Achari Paneer', baseRM: 'RM_PANEER', pasteSFG: 'SFG_T602A_PASTE' },
  { name: 'Achari Chaap', baseRM: 'RM_SOYA_CHAAP', pasteSFG: 'SFG_T602A_PASTE' },
  { name: 'Achari Mushroom', baseRM: 'RM_BUTTON_MUSHROOM', pasteSFG: 'SFG_T602A_PASTE' }
];

vegItems.forEach(item => {
  replaceRecipe(item.name, `      { itemModel: 'RawMaterial', code: '${item.baseRM}', quantity: 150 },
      { itemModel: 'SemiFinishedGood', code: '${item.pasteSFG}', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_CHUTNEY', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_MINT_ONION', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_LEMON_JUICE', quantity: 5 },
      { itemModel: 'Packaging', code: 'PKG_SERVING_PLATE', quantity: 1 }`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch 16 logic fixed!');
