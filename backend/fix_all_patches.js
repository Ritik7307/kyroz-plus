const fs = require('fs');

const patches = ['patch11.js', 'patch12.js', 'patch13.js', 'patch14.js', 'patch15.js'];

patches.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace Regex with String for SFG Recipes
  content = content.replace(
    "/\\\\};\\\\s*for \\\\(const sfgCode of Object.keys\\\\(sfgRecipeMappings\\\\)\\\\)/", 
    "\"  };\\n\\n  for (const sfgCode of Object.keys(sfgRecipeMappings)) {\""
  );

  // Replace Regex with String for Dish Recipes
  content = content.replace(
    "/\\\\};\\\\s*for \\\\(const dish of dishData\\\\) \\\\{/", 
    "\"  };\\n\\n  for (const dish of dishData) {\""
  );

  if (p === 'patch15.js') {
    // Fix South Indian RM codes so they don't use duplicates and they match existing RM definitions
    // The existing RMs are: RM_COASTAL_CRUST (S-301), RM_S302_TEMPER, RM_S303_RAVA, RM_S304_CRUNCH, RM_S305_STEAM.
    content = content.replace(/RM_S305/g, 'RM_S305_STEAM');
    content = content.replace(/RM_S301/g, 'RM_COASTAL_CRUST');
    content = content.replace(/RM_S302/g, 'RM_S302_TEMPER');
    content = content.replace(/RM_S303/g, 'RM_S303_RAVA');
    content = content.replace(/RM_S304/g, 'RM_S304_CRUNCH');
    
    // Also wait, patch15 injects RM_S305, RM_S301, RM_S302, RM_S303, RM_S304.
    // I should remove the RM Injection from patch15 entirely because they already exist!
    // Or just let it inject RM_S305_STEAM again? No, that would be duplicate code and could fail.
    // Let's just remove the RM Injection block from patch15.
    content = content.replace(/const rmInjection = \`[\\s\\S]*?console\.log\('RM Inject: true'\);\n}/, '');
  }

  fs.writeFileSync(p, content, 'utf8');
  console.log('Fixed', p);
});
