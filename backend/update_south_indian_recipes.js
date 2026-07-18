const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// SFG Defs to update
content = content.replace(
  /{ code: 'SFG_COCONUT_CHUTNEY', name: 'Coconut Chutney', batchYield: 87, yieldUnit: 'portions', currentStock: 2000, costPerUnit: 0.08 }/g,
  "{ code: 'SFG_COCONUT_CHUTNEY', name: 'Coconut Chutney', batchYield: 3500, yieldUnit: 'gm', currentStock: 5000, costPerUnit: 0.08 }"
);

// We need to carefully update recipe mappings for Dosa, Idli, Vada, Uttapam
// To make it easy, we will just use a regex replace function

const updateRecipes = (dishTypes, coconutQty, redQty, sambharQty) => {
  dishTypes.forEach(dish => {
    // We match the whole dish array block
    const regex = new RegExp(`('${dish}': \\[)([\\s\\S]*?)(\\])`, 'g');
    content = content.replace(regex, (match, start, items, end) => {
      // Replace Coconut Chutney
      let newItems = items.replace(
        /\{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: [0-9.]+ \}/g,
        `{ itemModel: 'SemiFinishedGood', code: 'SFG_COCONUT_CHUTNEY', quantity: ${coconutQty} }`
      );
      
      // Replace Red Chutney Portion with Red Kara Chutney
      newItems = newItems.replace(
        /\{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_CHUTNEY_PORTION', quantity: [0-9.]+ \}/g,
        `{ itemModel: 'SemiFinishedGood', code: 'SFG_RED_KARA_CHUTNEY', quantity: ${redQty} }`
      );
      
      // Replace Sambhar Portion with Premium Sambhar
      newItems = newItems.replace(
        /\{ itemModel: 'SemiFinishedGood', code: 'SFG_SAMBHAR_PORTION', quantity: [0-9.]+ \}/g,
        `{ itemModel: 'SemiFinishedGood', code: 'SFG_PREMIUM_SAMBHAR', quantity: ${sambharQty} }`
      );
      
      return start + newItems + end;
    });
  });
}

// Dosa
updateRecipes([
  'Small Masala Dosa', 'Regular Masala Dosa', 'Large Masala Dosa',
  'Onion Rava Dosa', 'Small Onion Rava Dosa', 'Regular Onion Rava Dosa', 'Large Onion Rava Dosa'
], 40, 30, 100);

// Idli
updateRecipes([
  'Mini Rice Idli', 'Regular Rice Idli', 'Large Rice Idli'
], 50, 40, 120);

// Vada
updateRecipes([
  'Medu Vada Portion', 'Single Medu Vada', 'Double Medu Vada'
], 50, 40, 120);

// Uttapam (assume same as Dosa since it's a pancake)
updateRecipes([
  'Mini Uttapam', 'Regular Uttapam', 'Large Uttapam',
  'Small Mix Veg Uttapam', 'Regular Mix Veg Uttapam', 'Large Mix Veg Uttapam'
], 40, 30, 100);

fs.writeFileSync(filePath, content, 'utf8');
console.log('South Indian recipes updated with specific exact amounts!');
