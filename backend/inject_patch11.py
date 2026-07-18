import re

with open('src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    c = f.read()

with open('patch11.js', 'r', encoding='utf-8') as f:
    p = f.read()

def get_str(var_name):
    m = re.search(f'const {var_name} = `(.*?)`;', p, re.DOTALL)
    return m.group(1) if m else ''

rm_inj = get_str('rmInjection')
pkg_inj = get_str('pkgInjection')
sfg_def_inj = get_str('sfgInjection')
dish_inj = get_str('dishInjection')
sfg_rec_inj = get_str('sfgRecipeInjectionStr')
dish_rec_inj = get_str('dishRecipeInjectionStr')

# sfgRecipeInjectionStr has a trailing "  };\n\n  for (const sfgCode of Object.keys(sfgRecipeMappings))" which we need to strip for clean injection
sfg_rec_inj = re.sub(r'\s*};\s*for \(const sfgCode of Object\.keys\(sfgRecipeMappings\)\)', '', sfg_rec_inj)

# dishRecipeInjectionStr has a trailing "  };\n\n  for (const dish of dishData) {" which we need to strip
dish_rec_inj = re.sub(r'\s*};\s*for \(const dish of dishData\) \{', '', dish_rec_inj)

c = re.sub(r'(\s*\];\s*const pkgIds)', '\n' + rm_inj + r'\1', c)
c = re.sub(r'(\s*\];\s*const sfgIds)', '\n' + pkg_inj + r'\1', c)
c = re.sub(r'(\s*\];\s*const dishIds)', '\n' + sfg_def_inj + r'\1', c)
c = re.sub(r'(\s*\];\s*const sfgRecipeMappings)', '\n' + dish_inj + r'\1', c)
c = re.sub(r'(\s*};\s*for \(const sfgCode of Object\.keys\(sfgRecipeMappings\)\) {)', '\n' + sfg_rec_inj + r'\1', c)
c = re.sub(r'(\s*};\s*for \(const dish of dishData\) {)', '\n' + dish_rec_inj + r'\1', c)

with open('src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Injections complete. Did we get Chopsuey?", "American Chopsuey" in c)
