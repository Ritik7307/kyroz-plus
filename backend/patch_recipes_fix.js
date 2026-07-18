const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const sfgInjectionStr = `    ,'SFG_G203': [
      { itemModel: 'RawMaterial', code: 'RM_G203', quantity: 5000 }
    ],
    'SFG_KADHAI_VEG_MIX': [
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 2500 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 2500 }
    ],
    'SFG_PRECOOKED_HARIYALI_TIKKA': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_HARIYALI_TIKKA', quantity: 5000 }
    ],
    'SFG_EGG_OMELETTE': [
      { itemModel: 'RawMaterial', code: 'RM_EGG_RAW', quantity: 25 }
    ],
    'SFG_PRECOOKED_MUTTON': [
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_MUTTON', quantity: 5000 }
    ]
  };

  for (const sfgCode of Object.keys(sfgRecipeMappings))`;

if (!content.includes("'SFG_G203':")) {
  content = content.replace(/\\};\\s*for \\(const sfgCode of Object.keys\\(sfgRecipeMappings\\)\\)/, sfgInjectionStr);
  console.log('Injected missing SFG recipes!');
}

const dishInjectionStr = `    ,'Chicken Tikka Masala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 }
    ],
    'Kadhai Chicken': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CRUSHED_BLACK_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Murg Hariyali': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_HARIYALI_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_MINT', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_GRATED_PANEER', quantity: 10 }
    ],
    'Murg Mumtaz': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 50 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_FRUITS', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 }
    ],
    'Murg Musallam': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_PRECOOKED_TANDOORI_CHICKEN', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_KEEMA', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_SAFFRON_MILK', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_BOILED_EGG', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_FRUITS', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 }
    ],
    'Murg Patiala': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 80 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_TIKKA', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_EGG_OMELETTE', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 45 }
    ],
    'Mutton Bhuna Gosht': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_SPICES', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K802', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Mutton Curry': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 200 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 60 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CINNAMON', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Mutton Handi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 120 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G204', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_WHOLE_RED_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_BAY_LEAF', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FINE_CHOPPED_ONION', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_FINE_CHOPPED_TOMATO', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_CORIANDER_POWDER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Mutton Rogan Josh': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 160 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_MUSTARD_OIL', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_MUTTON_STOCK', quantity: 50 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CARDAMOM', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_BLACK_CARDAMOM', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CINNAMON', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 30 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_GINGER_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_FENNEL_POWDER', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_KEWRA_WATER', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_RATAN_JOT_OIL', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 }
    ],
    'Chicken Nizami Handi': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G202', quantity: 100 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G201', quantity: 40 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_CHICKEN_TIKKA', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_CAPSICUM_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_ONION_CUBES', quantity: 20 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 40 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_SHAHI_JEERA', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_WHITE_PEPPER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_CARDAMOM_POWDER', quantity: 0.5 },
      { itemModel: 'RawMaterial', code: 'RM_FRESH_CREAM', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_BIRISTA', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_FRIED_CASHEW', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K806', quantity: 0.5 }
    ],
    'Saagwala Meat': [
      { itemModel: 'SemiFinishedGood', code: 'SFG_G203', quantity: 140 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_G205', quantity: 60 },
      { itemModel: 'SemiFinishedGood', code: 'SFG_PRECOOKED_MUTTON', quantity: 200 },
      { itemModel: 'RawMaterial', code: 'RM_DESI_GHEE', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_MEAT_STOCK', quantity: 45 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_GARLIC_PASTE', quantity: 3 },
      { itemModel: 'RawMaterial', code: 'RM_CHOPPED_GARLIC', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 },
      { itemModel: 'RawMaterial', code: 'RM_KASHMIRI_CHILLI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_K801', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_CURD', quantity: 15 },
      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 },
      { itemModel: 'RawMaterial', code: 'RM_KASOORI_METHI', quantity: 1 },
      { itemModel: 'RawMaterial', code: 'RM_GINGER_JULIENNES', quantity: 5 },
      { itemModel: 'RawMaterial', code: 'RM_DRY_RED_CHILLI', quantity: 1 }
    ]
  };

  for (const dish of dishData) {`;

if (!content.includes("'Saagwala Meat':")) {
  content = content.replace(/\\};\\s*for \\(const dish of dishData\\) \\{/, dishInjectionStr);
  console.log('Injected missing Dish recipes!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch Recipes Fix applied successfully!');
