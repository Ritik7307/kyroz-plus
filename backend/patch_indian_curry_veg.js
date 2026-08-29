const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const indianCurryVegDishes = [
    { name: 'Aloo Gobhi Matar', price: 219, pkg: 'PKG_500ML_BOWL' },
    { name: 'Corn Palak Cheese', price: 249, pkg: 'PKG_500ML_BOWL' },
    { name: 'Kadhai Paneer', price: 279, pkg: 'PKG_COPPER_KADHAI' },
    { name: 'Lehsunia Paneer', price: 289, pkg: 'PKG_500ML_BOWL' },
    { name: 'Malai Kofta (Ivory)', price: 299, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Malai Kofta Red', price: 299, pkg: 'PKG_500ML_BOWL' },
    { name: 'Mushroom Do Pyaza', price: 269, pkg: 'PKG_500ML_BOWL' },
    { name: 'Palak Paneer', price: 279, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Paneer Butter Masala', price: 289, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Paneer Dhaniya Adraki', price: 289, pkg: 'PKG_500ML_BOWL' },
    { name: 'Paneer Lababdar', price: 299, pkg: 'PKG_500ML_BOWL' },
    { name: 'Paneer Pasanda', price: 319, pkg: 'PKG_500ML_BOWL' },
    { name: 'Shahi Paneer', price: 289, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Signature Panch-Ratan Curry Veg', price: 329, pkg: 'PKG_500ML_BOWL' },
    { name: 'Veg Handi', price: 259, pkg: 'PKG_500ML_BOWL' },
    { name: 'Veg Jalfrezi', price: 249, pkg: 'PKG_500ML_BOWL' }
];

const fallbackPkg = (pkg) => {
    return `pkgIds['${pkg}'] || pkgIds['PKG_BIRYANI_CONTAINER']`;
}

let dishInjectionStr = `    // Indian Curry Veg Menu\n`;
indianCurryVegDishes.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: 'Indian Curry', packagingLogic: { takeaway: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], delivery: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

let recipeInjectionStr = `    // Indian Curry Veg Recipes\n`;
indianCurryVegDishes.forEach(d => {
    let items = [];
    if (d.name === 'Aloo Gobhi Matar') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_POTATO', quantity: 80 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_CAULIFLOWER', quantity: 80 }`);
    } else if (d.name === 'Corn Palak Cheese') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 140 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 60 }`);
    } else if (d.name === 'Kadhai Paneer') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 200 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 }`);
    } else if (d.name === 'Lehsunia Paneer') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 160 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 40 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }`);
    } else if (d.name === 'Malai Kofta (Ivory)') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 200 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_KOFTA', quantity: 4 }`);
    } else if (d.name === 'Malai Kofta Red') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 120 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 80 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_KOFTA', quantity: 2 }`);
    } else if (d.name === 'Mushroom Do Pyaza') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 120 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 80 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_MUSHROOM', quantity: 120 }`);
    } else if (d.name === 'Palak Paneer') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 200 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 }`);
    } else if (d.name === 'Paneer Butter Masala') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 200 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 }`);
    } else if (d.name === 'Paneer Dhaniya Adraki') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 140 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 60 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }`);
    } else if (d.name === 'Paneer Lababdar') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 140 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 60 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }`);
    } else if (d.name === 'Paneer Pasanda') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 160 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 40 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }`);
    } else if (d.name === 'Shahi Paneer') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 200 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 180 }`);
    } else if (d.name === 'Signature Panch-Ratan Curry Veg') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 80 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 60 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 60 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 40 }`);
    } else if (d.name === 'Veg Handi') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 80 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 60 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 60 }`);
    } else if (d.name === 'Veg Jalfrezi') {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 120 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 80 }`);
    }
    
    // Some general fallback items
    if (items.length === 0) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 50 }`);
    }
    
    recipeInjectionStr += `    '${d.name}': [ ${items.join(', ')} ],\n`;
});

if (!content.includes('Indian Curry Veg Menu')) {
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected Indian Curry Veg dishes into blueprintSeeder.service.ts!');
} else {
    console.log('Already injected.');
}
