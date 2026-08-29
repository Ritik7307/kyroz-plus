const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const southIndianDishes = [
    // Dosas
    { name: 'Plain Dosa', price: 129, pkg: 'PKG_DOSA_BOX' },
    { name: 'Masala Dosa', price: 149, pkg: 'PKG_DOSA_BOX' },
    { name: 'Butter Dosa', price: 159, pkg: 'PKG_DOSA_BOX' },
    { name: 'Mysore Masala Dosa', price: 169, pkg: 'PKG_DOSA_BOX' },
    { name: 'Cheese Dosa', price: 179, pkg: 'PKG_DOSA_BOX' },
    { name: 'Paper Dosa', price: 119, pkg: 'PKG_DOSA_BOX' },
    
    // Rava Dosas
    { name: 'Plain Rava Dosa', price: 149, pkg: 'PKG_DOSA_BOX' },
    { name: 'Onion Rava Dosa', price: 159, pkg: 'PKG_DOSA_BOX' },
    { name: 'Masala Rava Dosa', price: 169, pkg: 'PKG_DOSA_BOX' },
    { name: 'Cheese Rava Dosa', price: 189, pkg: 'PKG_DOSA_BOX' },

    // Uttapams
    { name: 'Plain Uttapam', price: 129, pkg: 'PKG_DOSA_BOX' },
    { name: 'Onion Uttapam', price: 139, pkg: 'PKG_DOSA_BOX' },
    { name: 'Mix-Veg Uttapam', price: 149, pkg: 'PKG_DOSA_BOX' },
    { name: 'Cheese Uttapam', price: 169, pkg: 'PKG_DOSA_BOX' },
    { name: 'Masala Uttapam', price: 159, pkg: 'PKG_DOSA_BOX' },

    // Idlis
    { name: 'Plain Idli', price: 99, pkg: 'PKG_DOSA_BOX' },
    { name: 'Mini Idli', price: 89, pkg: 'PKG_DOSA_BOX' },
    { name: 'Butter Idli', price: 119, pkg: 'PKG_DOSA_BOX' },
    { name: 'Fried Idli', price: 129, pkg: 'PKG_DOSA_BOX' },

    // Vadas
    { name: 'Medu Vada', price: 99, pkg: 'PKG_DOSA_BOX' },
    { name: 'Mini Vada', price: 89, pkg: 'PKG_DOSA_BOX' },
    { name: 'Sambar Vada', price: 109, pkg: 'PKG_DOSA_BOX' },
    { name: 'Curd Vada', price: 129, pkg: 'PKG_DOSA_BOX' },

    // Combos
    { name: 'Idli Vada Combo', price: 149, pkg: 'PKG_DOSA_BOX' },
    { name: 'South Indian Combo Meal', price: 249, pkg: 'PKG_BIRYANI_CONTAINER' }
];

// Fallback for packages
const fallbackPkg = (pkg) => {
    return `pkgIds['${pkg}'] || pkgIds['PKG_BIRYANI_CONTAINER']`;
}

let dishInjectionStr = `    // Extended South Indian Menu\n`;
southIndianDishes.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: 'South Indian', packagingLogic: { takeaway: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], delivery: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

let recipeInjectionStr = `    // Extended South Indian Recipes\n`;
southIndianDishes.forEach(d => {
    let items = [];
    if (d.name.includes('Dosa')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }`);
    else if (d.name.includes('Uttapam')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_UTTAPAM_BATTER', quantity: 180 }`);
    else if (d.name.includes('Idli')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_IDLI_BATTER', quantity: 100 }`);
    else if (d.name.includes('Vada')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_VADA_BATTER', quantity: 70 }`);
    else items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_DOSA_BATTER', quantity: 100 }`); // Fallback
    
    // Add Chutney and Sambhar logic for all South Indian dishes
    items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: 40 }`);
    items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR', quantity: 120 }`);
    
    if (d.name.includes('Masala')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_ALOO_MASALA', quantity: 120 }`);

    recipeInjectionStr += `    '${d.name}': [ ${items.join(', ')} ],\n`;
});

if (!content.includes('Extended South Indian Menu')) {
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected extended South Indian dishes into blueprintSeeder.service.ts!');
} else {
    console.log('Already injected.');
}
