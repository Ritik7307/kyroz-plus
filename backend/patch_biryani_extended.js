const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const biryaniDishes = [
    { name: 'Mutton Biryani', price: 399, pkg: 'PKG_BIRYANI_CONTAINER' },
    { name: 'Veg Biryani', price: 249, pkg: 'PKG_BIRYANI_CONTAINER' },
    { name: 'Paneer Biryani', price: 279, pkg: 'PKG_BIRYANI_CONTAINER' },
    { name: 'Chicken Biryani (Family Pack)', price: 799, pkg: 'PKG_BIRYANI_CONTAINER' },
    { name: 'Mutton Biryani (Family Pack)', price: 999, pkg: 'PKG_BIRYANI_CONTAINER' },
    { name: 'Veg Biryani (Family Pack)', price: 699, pkg: 'PKG_BIRYANI_CONTAINER' },
    { name: 'Paneer Biryani (Family Pack)', price: 749, pkg: 'PKG_BIRYANI_CONTAINER' }
];

let dishInjectionStr = `    // Extended Biryani Menu\n`;
biryaniDishes.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: 'Biryani', packagingLogic: { takeaway: [pkgIds['${d.pkg}'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['${d.pkg}'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

let recipeInjectionStr = `    // Extended Biryani Recipes\n`;
biryaniDishes.forEach(d => {
    // Basic mapping logic
    let items = [];
    items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_COOKED_BIRYANI', quantity: ${d.name.includes('Family Pack') ? 1400 : 350} }`);
    recipeInjectionStr += `    '${d.name}': [ ${items.join(', ')} ],\n`;
});

if (!content.includes('Extended Biryani Menu')) {
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected extended Biryani dishes into blueprintSeeder.service.ts!');
} else {
    console.log('Already injected.');
}
