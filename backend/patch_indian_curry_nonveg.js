const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const indianCurryNonVegDishes = [
    { name: 'Desi Handi Chicken', price: 349, pkg: 'PKG_EARTHEN_HANDI' },
    { name: 'Desi Handi Mutton', price: 449, pkg: 'PKG_EARTHEN_HANDI' },
    { name: 'Chicken Barrah Masala', price: 359, pkg: 'PKG_500ML_BOWL' },
    { name: 'Mutton Barrah Masala', price: 459, pkg: 'PKG_500ML_BOWL' },
    { name: 'Butter Chicken', price: 349, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Chicken Changezi', price: 369, pkg: 'PKG_500ML_BOWL' },
    { name: 'Chicken Curry', price: 319, pkg: 'PKG_500ML_BOWL' },
    { name: 'Chicken Kali Mirch', price: 349, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Chicken Lababdar', price: 359, pkg: 'PKG_500ML_BOWL' },
    { name: 'Chicken Rara', price: 379, pkg: 'PKG_500ML_BOWL' },
    { name: 'Mutton Rara', price: 479, pkg: 'PKG_500ML_BOWL' },
    { name: 'Chicken Pasanda', price: 369, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Chicken Tikka Masala', price: 349, pkg: 'PKG_500ML_BOWL' },
    { name: 'Kadhai Chicken', price: 339, pkg: 'PKG_COPPER_KADHAI' },
    { name: 'Murg Hariyali', price: 349, pkg: 'PKG_500ML_BOWL' },
    { name: 'Murg Mumtaz', price: 379, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Murg Musallam', price: 499, pkg: 'PKG_OVAL_PLATE' },
    { name: 'Murg Patiala', price: 369, pkg: 'PKG_500ML_BOWL' },
    { name: 'Mutton Bhuna Gosht', price: 449, pkg: 'PKG_IRON_KARAHI' },
    { name: 'Mutton Curry', price: 429, pkg: 'PKG_PREMIUM_BOWL' },
    { name: 'Mutton Handi', price: 459, pkg: 'PKG_CLAY_HANDI' },
    { name: 'Mutton Rogan Josh', price: 459, pkg: 'PKG_COPPER_HANDI' },
    { name: 'Chicken Nizami Handi', price: 369, pkg: 'PKG_CLAY_HANDI' },
    { name: 'Saag Chicken', price: 329, pkg: 'PKG_COPPER_HANDI' },
    { name: 'Saag Mutton', price: 439, pkg: 'PKG_COPPER_HANDI' }
];

const fallbackPkg = (pkg) => {
    return `pkgIds['${pkg}'] || pkgIds['PKG_BIRYANI_CONTAINER']`;
}

let dishInjectionStr = `    // Indian Curry Non-Veg Menu\n`;
indianCurryNonVegDishes.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: 'Indian Curry', packagingLogic: { takeaway: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], delivery: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

let recipeInjectionStr = `    // Indian Curry Non-Veg Recipes\n`;
indianCurryNonVegDishes.forEach(d => {
    let items = [];
    if (d.name.includes('Chicken')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }`);
    } else if (d.name.includes('Mutton')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_MUTTON', quantity: 200 }`);
    } else if (d.name.includes('Murg')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }`);
    }

    if (d.name.includes('Handi') || d.name.includes('Curry') || d.name.includes('Rogan')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 }`);
    }
    if (d.name.includes('Butter') || d.name.includes('Tikka') || d.name.includes('Lababdar')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SUNSET_BASE', quantity: 150 }`);
    }
    if (d.name.includes('Kali Mirch') || d.name.includes('Pasanda') || d.name.includes('Nizami')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_IVORY_BASE', quantity: 150 }`);
    }
    if (d.name.includes('Hariyali') || d.name.includes('Saag')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_EMERALD_MIX', quantity: 150 }`);
    }
    if (d.name.includes('Kadhai') || d.name.includes('Bhuna')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROASTED_RUST', quantity: 150 }`);
    }
    
    // Some general fallback items
    if (items.length === 0) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_ROYAL_ROGAN', quantity: 150 }`);
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_CHICKEN', quantity: 200 }`);
    }
    
    recipeInjectionStr += `    '${d.name}': [ ${items.join(', ')} ],\n`;
});

if (!content.includes('Indian Curry Non-Veg Menu')) {
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected Indian Curry Non-Veg dishes into blueprintSeeder.service.ts!');
} else {
    console.log('Already injected.');
}
