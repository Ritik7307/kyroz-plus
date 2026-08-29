const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const tandoorDishes = [
    // Chicken Tikka & Tandoori Chicken (T-604, T-605)
    { name: 'Chicken Tikka (6 Pcs)', price: 299, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Tandoori Chicken (Half)', price: 349, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Tandoori Chicken (Full)', price: 599, pkg: 'PKG_BIRYANI_CONTAINER' },
    { name: 'Chicken Malai Tikka (6 Pcs)', price: 329, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Afghani Chicken (Half)', price: 379, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Afghani Chicken (Full)', price: 649, pkg: 'PKG_BIRYANI_CONTAINER' },
    
    // Seekh Kebab (T-606)
    { name: 'Chicken Seekh Kebab (2 Pcs)', price: 249, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    
    // Al Faham (T-607)
    { name: 'Al Faham Chicken (Whole)', price: 699, pkg: 'PKG_BIRYANI_CONTAINER' },

    // Veg Tandoor (Paneer)
    { name: 'Tandoori Paneer Tikka', price: 249, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Malai Paneer Tikka', price: 279, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Hariyali Paneer Tikka', price: 259, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Achari Paneer Tikka', price: 259, pkg: 'PKG_TAKEAWAY_CONTAINER' },

    // Veg Tandoor (Chaap)
    { name: 'Tandoori Soya Chaap', price: 199, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Malai Soya Chaap', price: 229, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Hariyali Soya Chaap', price: 209, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Achari Soya Chaap', price: 209, pkg: 'PKG_TAKEAWAY_CONTAINER' },

    // Veg Tandoor (Mushroom)
    { name: 'Tandoori Mushroom', price: 229, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Malai Mushroom', price: 259, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Hariyali Mushroom', price: 239, pkg: 'PKG_TAKEAWAY_CONTAINER' },
    { name: 'Achari Mushroom', price: 239, pkg: 'PKG_TAKEAWAY_CONTAINER' },

    // Veg Tandoor (Momos)
    { name: 'Tandoori Momos (6 Pcs)', price: 179, pkg: 'PKG_TAKEAWAY_CONTAINER' }
];

const fallbackPkg = (pkg) => {
    return `pkgIds['${pkg}'] || pkgIds['PKG_BIRYANI_CONTAINER']`;
}

let dishInjectionStr = `    // Extended Tandoor Menu\n`;
tandoorDishes.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: 'Tandoor', packagingLogic: { takeaway: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], delivery: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

let recipeInjectionStr = `    // Extended Tandoor Recipes\n`;
tandoorDishes.forEach(d => {
    let items = [];
    
    // Chicken Logic
    if (d.name.includes('Chicken Tikka (6 Pcs)')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 210 }`);
    else if (d.name.includes('Tandoori Chicken (Half)')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 500 }`);
    else if (d.name.includes('Tandoori Chicken (Full)')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T604', quantity: 1000 }`);
    else if (d.name.includes('Malai Tikka (6 Pcs)')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 210 }`);
    else if (d.name.includes('Afghani Chicken (Half)')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 500 }`);
    else if (d.name.includes('Afghani Chicken (Full)')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_CHICKEN_T605', quantity: 1000 }`);
    else if (d.name.includes('Seekh Kebab')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_SEEKH_T606', quantity: 90 }`);
    else if (d.name.includes('Al Faham')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_MARINATED_AL_FAHAM_T607', quantity: 1 }`);
    
    // Veg Logic
    else if (d.name.includes('Paneer')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_PANEER', quantity: 150 }`);
        if (d.name.includes('Malai')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 }`);
        else if (d.name.includes('Hariyali')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 }`);
        else if (d.name.includes('Achari')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T602A_ACHARI_PASTE', quantity: 60 }`);
        else items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 }`);
    }
    else if (d.name.includes('Chaap')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_SOYA_CHAAP', quantity: 150 }`);
        if (d.name.includes('Malai')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 }`);
        else if (d.name.includes('Hariyali')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 }`);
        else if (d.name.includes('Achari')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T602A_ACHARI_PASTE', quantity: 60 }`);
        else items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 }`);
    }
    else if (d.name.includes('Mushroom')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_BUTTON_MUSHROOM', quantity: 150 }`);
        if (d.name.includes('Malai')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T602_PASTE', quantity: 60 }`);
        else if (d.name.includes('Hariyali')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T603_PASTE', quantity: 60 }`);
        else if (d.name.includes('Achari')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T602A_ACHARI_PASTE', quantity: 60 }`);
        else items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 }`);
    }
    else if (d.name.includes('Momos')) {
        items.push(`{ itemModel: 'RawMaterial', code: 'RM_VEG_MOMOS', quantity: 6 }`); // 6 pieces
        items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_T601_PASTE', quantity: 60 }`);
    }

    recipeInjectionStr += `    '${d.name}': [ ${items.join(', ')} ],\n`;
});

if (!content.includes('Extended Tandoor Menu')) {
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected extended Tandoor dishes into blueprintSeeder.service.ts!');
} else {
    console.log('Already injected.');
}
