const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const chineseDishes = [
    // Soups
    { name: 'Veg Hot & Sour', price: 129, pkg: 'PKG_SOUP_BOWL' },
    { name: 'Chicken Hot & Sour', price: 149, pkg: 'PKG_SOUP_BOWL' },
    { name: 'Lemon Coriander Soup', price: 129, pkg: 'PKG_SOUP_BOWL' },
    { name: 'Veg Manchow Soup', price: 139, pkg: 'PKG_SOUP_BOWL' },
    { name: 'Chicken Manchow Soup', price: 159, pkg: 'PKG_SOUP_BOWL' },
    { name: 'Seafood Manchow Soup', price: 199, pkg: 'PKG_SOUP_BOWL' },
    { name: 'Spicy Garlic Soup', price: 129, pkg: 'PKG_SOUP_BOWL' },

    // Momos
    { name: 'Steamed Veg Momos', price: 129, pkg: 'PKG_SNACK_BOX' },
    { name: 'Steamed Chicken Momos', price: 149, pkg: 'PKG_SNACK_BOX' },
    { name: 'Steamed Cheese Momos', price: 159, pkg: 'PKG_SNACK_BOX' },
    { name: 'Fried Veg Momos', price: 149, pkg: 'PKG_SNACK_BOX' },
    { name: 'Fried Chicken Momos', price: 169, pkg: 'PKG_SNACK_BOX' },
    { name: 'Kurkure Veg Momos', price: 179, pkg: 'PKG_SNACK_BOX' },
    { name: 'Kurkure Chicken Momos', price: 199, pkg: 'PKG_SNACK_BOX' },
    { name: 'Tandoori Veg Momos', price: 189, pkg: 'PKG_SNACK_BOX' },
    { name: 'Tandoori Chicken Momos', price: 209, pkg: 'PKG_SNACK_BOX' },

    // Dry Starters
    { name: 'Chilli Paneer Dry', price: 249, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chilli Chicken Dry', price: 279, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chilli Soya Chaap Dry', price: 229, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chilli Mushroom Dry', price: 239, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chilli Potato Dry', price: 179, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Veg Manchurian Dry', price: 199, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chicken Manchurian Dry', price: 249, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Honey Chilli Potato', price: 199, pkg: 'PKG_STARTER_BOX' },
    { name: 'Honey Chilli Lotus Stem', price: 229, pkg: 'PKG_STARTER_BOX' },
    { name: 'Crispy Corn', price: 189, pkg: 'PKG_STARTER_BOX' },
    { name: 'Salt & Pepper', price: 199, pkg: 'PKG_STARTER_BOX' },
    { name: 'Chicken Lollipop', price: 249, pkg: 'PKG_STARTER_BOX' },
    { name: 'Crispy Chicken', price: 279, pkg: 'PKG_STARTER_BOX' },
    { name: 'Paneer Crispy', price: 249, pkg: 'PKG_STARTER_BOX' },

    // Gravy Dishes
    { name: 'Chilli Paneer Gravy', price: 259, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chilli Chicken Gravy', price: 289, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Veg Manchurian Gravy', price: 209, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chicken Manchurian Gravy', price: 259, pkg: 'PKG_CHINESE_BOWL' },

    // Noodles & Rice
    { name: 'Veg Hakka Noodles', price: 199, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Chicken Hakka Noodles', price: 239, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Veg Fried Rice', price: 199, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Egg Fried Rice', price: 219, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Chicken Fried Rice', price: 249, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Burnt Garlic Rice', price: 209, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Burnt Garlic Noodles', price: 209, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Schezwan Rice', price: 219, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Schezwan Noodles', price: 219, pkg: 'PKG_NOODLE_CONTAINER' },
    { name: 'Schezwan Chicken Rice', price: 259, pkg: 'PKG_NOODLE_CONTAINER' },

    // Sweet & Sour
    { name: 'American Chopsuey', price: 249, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Chinese Bhel', price: 199, pkg: 'PKG_CHINESE_BOWL' },
    { name: 'Crispy Noodle Bowl', price: 229, pkg: 'PKG_CHINESE_BOWL' }
];

// Fallbacks for packaging if not defined
const fallbackPkg = (pkg) => {
    // just return the same or 'PKG_FOOD_CONTAINER' if we want safety, but let's assume they might not exist
    return `pkgIds['${pkg}'] || pkgIds['PKG_BIRYANI_CONTAINER']`;
}

let dishInjectionStr = `    // Extended Chinese Menu\n`;
chineseDishes.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: 'Chinese', packagingLogic: { takeaway: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], delivery: [${fallbackPkg(d.pkg)}, pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

let recipeInjectionStr = `    // Extended Chinese Recipes\n`;
chineseDishes.forEach(d => {
    // Basic mapping logic
    let items = [];
    if (d.name.includes('Momos')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_RUBY_SAUCE', quantity: 30 }`);
    else if (d.name.includes('Soup')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_SOUP_BASE', quantity: 120 }`);
    else if (d.name.includes('Noodles') || d.name.includes('Rice')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_NOODLES', quantity: 200 }`);
    else if (d.name.includes('Chilli') || d.name.includes('Manchurian')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_CHILLI_BASE', quantity: 100 }`);
    else items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_CHINESE_BASE', quantity: 100 }`); // Fallback

    recipeInjectionStr += `    '${d.name}': [ ${items.join(', ')} ],\n`;
});

if (!content.includes('Extended Chinese Menu')) {
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected extended Chinese dishes into blueprintSeeder.service.ts!');
} else {
    console.log('Already injected.');
}
