import re

with open('src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Load patch16 strings
with open('patch16.js', 'r', encoding='utf-8') as f:
    p = f.read()

def get_str(var_name):
    m = re.search(f'const {var_name} = `(.*?)`;', p, re.DOTALL)
    return m.group(1) if m else ''

rm_inj = get_str('rmInjectionStr')
pkg_inj = get_str('pkgInjectionStr')
sfg_def_inj = get_str('sfgDefInjectionStr')
dish_inj = get_str('dishInjectionStr')
sfg_rec_inj = get_str('sfgRecipeInjectionStr')

c = re.sub(r'(\s*\];\s*const pkgIds)', '\n' + rm_inj + r'\1', c)
c = re.sub(r'(\s*\];\s*const sfgIds)', '\n' + pkg_inj + r'\1', c)
c = re.sub(r'(\s*\];\s*const dishIds)', '\n' + sfg_def_inj + r'\1', c)
c = re.sub(r'(\s*\];\s*const sfgRecipeMappings)', '\n' + dish_inj + r'\1', c)

c = re.sub(r'(\s*};\s*for \(const sfgCode of Object\.keys\(sfgRecipeMappings\)\) {)', '\n' + sfg_rec_inj + r'\1', c)

with open('src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Injections complete. Did we get T604?", "T604" in c)
