const fs = require('fs');
const path = require('path');

const files = ['patch11.js', 'patch12.js', 'patch13.js', 'patch14.js', 'patch15.js'];
let allSfgRecipes = "";
let allDishRecipes = "";

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  const sfgStart = content.indexOf('const sfgRecipeInjectionStr = `');
  if (sfgStart !== -1) {
    let sub = content.substring(sfgStart + 31);
    const sfgEnd = sub.indexOf('\\n  };');
    allSfgRecipes += sub.substring(0, sfgEnd).trim() + "\\n";
  }

  const dishStart = content.indexOf('const dishRecipeInjectionStr = `');
  if (dishStart !== -1) {
    let sub = content.substring(dishStart + 32);
    const dishEnd = sub.indexOf('\\n  };');
    allDishRecipes += sub.substring(0, dishEnd).trim() + "\\n";
  }
});

// Fix South Indian RM names
allSfgRecipes = allSfgRecipes.replace(/RM_S305/g, 'RM_S305_STEAM');
allSfgRecipes = allSfgRecipes.replace(/RM_S301/g, 'RM_COASTAL_CRUST');
allSfgRecipes = allSfgRecipes.replace(/RM_S302/g, 'RM_S302_TEMPER');
allSfgRecipes = allSfgRecipes.replace(/RM_S303/g, 'RM_S303_RAVA');
allSfgRecipes = allSfgRecipes.replace(/RM_S304/g, 'RM_S304_CRUNCH');
allDishRecipes = allDishRecipes.replace(/RM_S305/g, 'RM_S305_STEAM');
allDishRecipes = allDishRecipes.replace(/RM_S301/g, 'RM_COASTAL_CRUST');
allDishRecipes = allDishRecipes.replace(/RM_S302/g, 'RM_S302_TEMPER');
allDishRecipes = allDishRecipes.replace(/RM_S303/g, 'RM_S303_RAVA');
allDishRecipes = allDishRecipes.replace(/RM_S304/g, 'RM_S304_CRUNCH');

const filePath = path.resolve(__dirname, 'src/services/blueprintSeeder.service.ts');
let seederContent = fs.readFileSync(filePath, 'utf8');

if (!seederContent.includes("'American Chopsuey': [")) {
  const targetSFG = "  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {";
  const newSFG = allSfgRecipes + "\n  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {";
  seederContent = seederContent.replace(targetSFG, newSFG);

  const targetDish = "  };\n\n  for (const dish of dishData) {";
  const newDish = allDishRecipes + "\n  };\n\n  for (const dish of dishData) {";
  seederContent = seederContent.replace(targetDish, newDish);

  fs.writeFileSync(filePath, seederContent, 'utf8');
  console.log('Fixed missing recipes!');
} else {
  console.log('Recipes already injected!');
}
