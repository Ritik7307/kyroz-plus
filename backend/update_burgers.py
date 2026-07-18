import re
import sys

def update_burger_recipe(c, burger_name):
    # Regex to find the recipe block for a specific burger
    # 'Classic Burger': [ ... ],
    pattern = r"('" + burger_name + r"': \[\s*)([\s\S]*?)(\s*\])"
    
    match = re.search(pattern, c)
    if not match:
        print(f"Warning: {burger_name} not found!")
        return c
        
    prefix = match.group(1)
    inner_content = match.group(2)
    suffix = match.group(3)
    
    # 1. Ensure Burger Bun is exactly 1
    # Actually, it's already { itemModel: 'RawMaterial', code: 'RM_BURGER_BUN', quantity: 1 }
    
    # 2. Update Sauce quantity from 20 to 30
    inner_content = re.sub(r"quantity: 20", "quantity: 30", inner_content)
    
    # 3. Add Vegetables if not present
    # We will just append them
    veg_additions = [
        "      { itemModel: 'RawMaterial', code: 'RM_LETTUCE', quantity: 10 }",
        "      { itemModel: 'RawMaterial', code: 'RM_TOMATO', quantity: 20 }",
        "      { itemModel: 'RawMaterial', code: 'RM_ONION', quantity: 15 }",
        "      { itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }"
    ]
    
    if 'RM_LETTUCE' not in inner_content:
        # add a comma to the last existing item
        inner_content = inner_content.rstrip()
        if not inner_content.endswith(','):
            inner_content += ','
        inner_content += '\n' + ',\n'.join(veg_additions)
        
    return c[:match.start()] + prefix + inner_content + suffix + c[match.end():]

with open('src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

burgers = [
    'Classic Burger',
    'Crispy Veggie Burger',
    'Tandoori Burger',
    'Paneer Burger',
    'Classic Chicken Burger',
    'Zinger Burger'
]

for b in burgers:
    content = update_burger_recipe(content, b)
    
with open('src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Burgers successfully!")
