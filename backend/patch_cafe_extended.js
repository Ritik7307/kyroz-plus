const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const dishesToAdd = [
    // Pizzas
    { name: '10 Inch Farmhouse Pizza', price: 349, pkg: 'PKG_PIZZA_BOX' },
    { name: '10 Inch Veggie Supreme Pizza', price: 399, pkg: 'PKG_PIZZA_BOX' },
    { name: '10 Inch Paneer Tikka Pizza', price: 399, pkg: 'PKG_PIZZA_BOX' },
    { name: '10 Inch Chicken Tikka Pizza', price: 449, pkg: 'PKG_PIZZA_BOX' },
    { name: '10 Inch Cheese Burst Pizza', price: 499, pkg: 'PKG_PIZZA_BOX' },
    { name: '12 Inch Margherita Pizza', price: 399, pkg: 'PKG_PIZZA_BOX' },
    { name: '12 Inch Farmhouse Pizza', price: 449, pkg: 'PKG_PIZZA_BOX' },
    { name: '12 Inch Veggie Supreme Pizza', price: 499, pkg: 'PKG_PIZZA_BOX' },
    { name: '12 Inch Paneer Tikka Pizza', price: 499, pkg: 'PKG_PIZZA_BOX' },
    { name: '12 Inch Chicken Tikka Pizza', price: 549, pkg: 'PKG_PIZZA_BOX' },
    { name: '12 Inch Cheese Burst Pizza', price: 599, pkg: 'PKG_PIZZA_BOX' },

    // Burgers
    { name: 'Aloo Tikki Burger', price: 99, pkg: 'PKG_BURGER_BOX' },
    { name: 'Crispy Veg Burger', price: 129, pkg: 'PKG_BURGER_BOX' },
    { name: 'Chicken Zinger Burger', price: 199, pkg: 'PKG_BURGER_BOX' },
    { name: 'Tandoori Paneer Burger', price: 179, pkg: 'PKG_BURGER_BOX' },
    { name: 'Cheese Burger', price: 159, pkg: 'PKG_BURGER_BOX' },

    // Wraps
    { name: 'Peri-Peri Paneer Wrap', price: 199, pkg: 'PKG_WRAP_BOX' },
    { name: 'Crispy Chicken Wrap', price: 229, pkg: 'PKG_WRAP_BOX' },
    { name: 'Zing Crunchy Roll', price: 249, pkg: 'PKG_WRAP_BOX' },

    // Sandwiches
    { name: 'Veg Club Sandwich', price: 149, pkg: 'PKG_SANDWICH_BOX' },
    { name: 'Corn & Cheese Sandwich', price: 179, pkg: 'PKG_SANDWICH_BOX' },
    { name: 'Peri-Peri Paneer Sandwich', price: 199, pkg: 'PKG_SANDWICH_BOX' },
    { name: 'Crispy Chicken Sandwich', price: 229, pkg: 'PKG_SANDWICH_BOX' },
    { name: 'Cheese Grill Sandwich', price: 159, pkg: 'PKG_SANDWICH_BOX' },

    // Pastas
    { name: 'White Sauce Penne', price: 229, pkg: 'PKG_PASTA_BOWL' },
    { name: 'White Sauce Fusilli', price: 229, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Alfredo Pasta', price: 249, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Mushroom Alfredo', price: 279, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Cheese Alfredo Pasta', price: 299, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Arrabbiata Pasta', price: 229, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Red Sauce Penne', price: 229, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Red Sauce Fusilli', price: 229, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Spicy Marinara Pasta', price: 249, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Pink Penne', price: 249, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Pink Fusilli', price: 249, pkg: 'PKG_PASTA_BOWL' },
    { name: 'Cheese Pink Pasta', price: 279, pkg: 'PKG_PASTA_BOWL' },

    // Snacks/Sides
    { name: 'Classic Garlic Bread', price: 129, pkg: 'PKG_PIZZA_BOX' },
    { name: 'Cheese Garlic Bread', price: 159, pkg: 'PKG_PIZZA_BOX' },
    { name: 'Peri Peri French Fries', price: 129, pkg: 'PKG_BURGER_BOX' },
    { name: 'Chicken Nuggets', price: 179, pkg: 'PKG_CHICKEN_BUCKET' },
    { name: 'Paneer Grill', price: 229, pkg: 'PKG_BURGER_BOX' },
    { name: 'Chicken Grill', price: 249, pkg: 'PKG_BURGER_BOX' },
    { name: 'Crispy Strips', price: 229, pkg: 'PKG_CHICKEN_BUCKET' },
    { name: 'Chicken Wings', price: 249, pkg: 'PKG_CHICKEN_BUCKET' },
    { name: 'Leg Piece', price: 149, pkg: 'PKG_CHICKEN_BUCKET' },

    // Shakes & Beverages
    { name: 'Chocolate Shake', price: 169, pkg: 'PKG_BEVERAGE_CUP' },
    { name: 'Mango Shake', price: 179, pkg: 'PKG_BEVERAGE_CUP' },
    { name: 'Strawberry Shake', price: 179, pkg: 'PKG_BEVERAGE_CUP' },
    { name: 'Oreo Shake', price: 199, pkg: 'PKG_BEVERAGE_CUP' },
    { name: 'KitKat Shake', price: 199, pkg: 'PKG_BEVERAGE_CUP' },
    { name: 'Hazelnut Shake', price: 229, pkg: 'PKG_BEVERAGE_CUP' },
    { name: 'Mocha', price: 189, pkg: 'PKG_BEVERAGE_CUP' }
];

let dishInjectionStr = `    // Extended Cafe Menu\n`;
dishesToAdd.forEach(d => {
    dishInjectionStr += `    { name: '${d.name}', price: ${d.price}, category: 'Cafe', packagingLogic: { takeaway: [pkgIds['${d.pkg}'], pkgIds['PKG_CARRY_BAG']], delivery: [pkgIds['${d.pkg}'], pkgIds['PKG_CARRY_BAG']], dineIn: [pkgIds['PKG_SERVING_PLATE']] } },\n`;
});

// For recipes, we'll map them to basic components just so they exist in costing
let recipeInjectionStr = `    // Extended Cafe Recipes\n`;
dishesToAdd.forEach(d => {
    // Basic mapping logic
    let items = [];
    if (d.name.includes('Pizza')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE', quantity: 1 }`);
    else if (d.name.includes('Burger')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 }`);
    else if (d.name.includes('Wrap')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_VEG_PATTY', quantity: 1 }`);
    else if (d.name.includes('Pasta')) items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 }`);
    else items.push(`{ itemModel: 'SemiFinishedGood', code: 'SFG_BURGER_SAUCE', quantity: 30 }`); // Fallback

    recipeInjectionStr += `    '${d.name}': [ ${items.join(', ')} ],\n`;
});

if (!content.includes('Extended Cafe Menu')) {
    content = content.replace("const dishData = [", "const dishData = [\n" + dishInjectionStr);
    content = content.replace(/(const dishRecipeMappings: Record<string, \{ itemModel: string, code: string, quantity: number \}\[\]> = \{)/, "$1\n" + recipeInjectionStr);
    
    // The user requested NO sub categories for these, but they also want the OLD ones to be 'Cafe'
    // Let's replace 'Pizza', 'Burger', 'Wrap', 'Snacks', 'Pasta', 'Beverages' for the existing C-500 ones
    content = content.replace(/category: 'Pizza'/g, "category: 'Cafe'");
    content = content.replace(/category: 'Burger'/g, "category: 'Cafe'");
    content = content.replace(/category: 'Wrap'/g, "category: 'Cafe'");
    content = content.replace(/category: 'Snacks'/g, "category: 'Cafe'");
    content = content.replace(/category: 'Pasta'/g, "category: 'Cafe'");
    content = content.replace(/category: 'Beverages'/g, "category: 'Cafe'");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully injected extended Cafe dishes into blueprintSeeder.service.ts!');
} else {
    console.log('Already injected.');
}
