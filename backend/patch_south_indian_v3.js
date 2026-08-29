const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

if (content.includes('// KYROZ S-300 Engine V3 Injection')) {
    console.log('Already injected.');
    process.exit(0);
}

// 1. We will define the POS Dishes.
const newDishes = [
    { name: 'V3 Plain Dosa', price: 120, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Masala Dosa', price: 150, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Butter Dosa', price: 160, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Onion Rava Dosa', price: 170, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Mix-Veg Uttapam', price: 180, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Masala Uttapam', price: 190, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Medu Vada (Single)', price: 80, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Regular Idli (2 Pcs)', price: 100, pkg: 'PKG_DOSA_BOX', category: 'South Indian' },
    { name: 'V3 Mini Idli (Plate)', price: 110, pkg: 'PKG_DOSA_BOX', category: 'South Indian' }
];

let dishInjectionStr = `    // KYROZ S-300 Engine V3 Injection\n`;
newDishes.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: '${d.category}', packagingLogic: { takeaway: [pkgIds['${d.pkg}'] || pkgIds['PKG_BIRYANI_CONTAINER']], delivery: [pkgIds['${d.pkg}'] || pkgIds['PKG_BIRYANI_CONTAINER']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

// 2. We will define the Recipe Mappings (Costing Matrix)
// Each dish deducts specific SFGs and RMs.
const newRecipes = {
    'V3 Plain Dosa': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER_S301', quantity: 100 }",
        "{ itemModel: 'RawMaterial', code: 'RM_REFINED_OIL', quantity: 5 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 }"
    ],
    'V3 Masala Dosa': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER_S301', quantity: 100 }",
        "{ itemModel: 'RawMaterial', code: 'RM_REFINED_OIL', quantity: 5 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA_S302', quantity: 120 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 }"
    ],
    'V3 Butter Dosa': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER_S301', quantity: 100 }",
        "{ itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 }"
    ],
    'V3 Onion Rava Dosa': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RAVA_BATTER_S303', quantity: 120 }",
        "{ itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 }",
        "{ itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 2 }",
        "{ itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 3 }",
        "{ itemModel: 'RawMaterial', code: 'RM_REFINED_OIL', quantity: 8 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 }"
    ],
    'V3 Mix-Veg Uttapam': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 180 }", // S-305 used for Uttapam per prompt
        "{ itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 10 }",
        "{ itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 10 }",
        "{ itemModel: 'RawMaterial', code: 'RM_GREEN_CHILLI', quantity: 10 }",
        "{ itemModel: 'RawMaterial', code: 'RM_FRESH_CORIANDER', quantity: 10 }",
        "{ itemModel: 'RawMaterial', code: 'RM_REFINED_OIL', quantity: 8 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 }"
    ],
    'V3 Masala Uttapam': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 180 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA_S302', quantity: 80 }",
        "{ itemModel: 'RawMaterial', code: 'RM_REFINED_OIL', quantity: 8 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 30 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 100 }"
    ],
    'V3 Medu Vada (Single)': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER_S304', quantity: 70 }",
        "{ itemModel: 'RawMaterial', code: 'RM_REFINED_OIL', quantity: 8 }", // Oil absorption
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 50 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 120 }"
    ],
    'V3 Regular Idli (2 Pcs)': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 100 }", // 50g per pc * 2
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 50 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 120 }"
    ],
    'V3 Mini Idli (Plate)': [
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER_S305', quantity: 100 }", // Assuming 5 pcs * 20g
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_S306', quantity: 40 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY_S307', quantity: 50 }",
        "{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_S308', quantity: 120 }"
    ]
};

let recipeInjectionStr = `    // KYROZ S-300 Engine V3 Injection\n`;
Object.keys(newRecipes).forEach(dishName => {
    recipeInjectionStr += `    '${dishName}': [ ${newRecipes[dishName].join(', ')} ],\n`;
});

content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected South Indian S-300 V3 architecture into blueprintSeeder.service.ts!');
