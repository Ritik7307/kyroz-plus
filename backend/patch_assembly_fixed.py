import re

with open('src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix Pizzas
# We need to find the pizza blocks and replace their contents.
pizza_flavors = ['Corn Cheese', 'Paneer', 'Chicken']
sizes = ['Personal', 'Medium', 'Large']
multiplier = {'Personal': 1, 'Medium': 1.5, 'Large': 2}
extra_topping = {
    'Corn Cheese': ("RawMaterial", "RM_CORN_RAW", 30),
    'Paneer': ("RawMaterial", "RM_PANEER_RAW", 40),
    'Chicken': ("SemiFinishedGood", "SFG_CHICKEN_PORTION_PERSONAL", 1)
}

for flavor in pizza_flavors:
    for size in sizes:
        burger_name = f"{size} {flavor} Pizza"
        
        # We replace the entire block inside the recipe mappings
        # Search for: 'Personal Corn Cheese Pizza': [ ... ],
        pattern = r"('" + burger_name + r"': \[\s*)([\s\S]*?)(\s*\])"
        
        m = multiplier[size]
        topping_model, topping_code, topping_qty = extra_topping[flavor]
        
        new_block = f"""      {{ itemModel: 'SemiFinishedGood', code: 'SFG_PIZZA_BASE_{size.upper()}', quantity: 1 }},
      {{ itemModel: 'SemiFinishedGood', code: 'SFG_PREPARED_PIZZA_SAUCE', quantity: {50 * m} }},
      {{ itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: {90 * m} }},
      {{ itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: {40 * m} }},
      {{ itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: {3 * m} }},
      {{ itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }},
      {{ itemModel: '{topping_model}', code: '{topping_code}', quantity: {topping_qty * m} }}"""

        c = re.sub(pattern, r"\1" + new_block + r"\3", c)


# Sandwiches
sandwiches = {
    'Crispy Chicken Sandwich': ("SemiFinishedGood", "SFG_CHICKEN_FILLING", 50),
    'Classic Corn Cheese Sandwich': ("SemiFinishedGood", "SFG_CORN_FILLING", 50),
    'Veg Grilled Club': ("SemiFinishedGood", "SFG_VEG_FILLING", 50),
    'Peri-Peri Paneer Sandwich': ("SemiFinishedGood", "SFG_PANEER_FILLING", 50)
}

for name, (model, code, qty) in sandwiches.items():
    pattern = r"('" + name + r"': \[\s*)([\s\S]*?)(\s*\])"
    
    new_block = f"""      {{ itemModel: 'RawMaterial', code: 'RM_BREAD', quantity: 2 }},
      {{ itemModel: 'SemiFinishedGood', code: 'SFG_HERB_GARLIC_MAYO', quantity: 1 }},
      {{ itemModel: 'SemiFinishedGood', code: 'SFG_CREAMY_VELVET_SAUCE', quantity: 1 }},
      {{ itemModel: '{model}', code: '{code}', quantity: {qty} }},
      {{ itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 }},
      {{ itemModel: 'RawMaterial', code: 'RM_CHEESE', quantity: 1 }},
      {{ itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }},
      {{ itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }}"""
      
    c = re.sub(pattern, r"\1" + new_block + r"\3", c)


# Shakes
shakes = {
    'Vanilla Shake': ('RM_C507_SNOW_BASE', 40, 'RawMaterial', 'RM_VANILLA_CORE', 30),
    'Cold Coffee': ('RM_C507_SNOW_BASE', 35, 'RawMaterial', 'RM_COFFEE_POWDER', 10),
    'Strawberry Shake': ('RM_C507_SNOW_BASE', 40, 'RawMaterial', 'RM_STRAWBERRY_CORE', 20),
    'Mango Shake': ('RM_C507_SNOW_BASE', 40, 'RawMaterial', 'RM_MANGO_SYRUP', 20),
    'Chocolate Shake': ('RM_C508_COCOA_BASE', 45, None, None, None),
    'Oreo Shake': ('RM_C508_COCOA_BASE', 45, 'RawMaterial', 'RM_OREO_ADDON', 2),
    'KitKat Shake': ('RM_C508_COCOA_BASE', 45, 'RawMaterial', 'RM_KITKAT_ADDON', 1),
    'Hazelnut Shake': ('RM_C508_COCOA_BASE', 40, 'RawMaterial', 'RM_HAZELNUT_SYRUP', 15),
    'Mocha Frappe': ('RM_C508_COCOA_BASE', 35, 'RawMaterial', 'RM_COFFEE_POWDER', 10)
}

for name, (base, base_qty, model, code, qty) in shakes.items():
    pattern = r"('" + name + r"': \[\s*)([\s\S]*?)(\s*\])"
    
    new_block = f"""      {{ itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 }},
      {{ itemModel: 'RawMaterial', code: '{base}', quantity: {base_qty} }}"""
      
    if model and code and qty:
        new_block += f",\n      {{ itemModel: '{model}', code: '{code}', quantity: {qty} }}"
        
    c = re.sub(pattern, r"\1" + new_block + r"\3", c)

# Pastas (Red, White, Pink)
pastas = {
    'Red Sauce Pasta': f"""      {{ itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 }},
      {{ itemModel: 'RawMaterial', code: 'RM_WATER_STOCK', quantity: 200 }},
      {{ itemModel: 'RawMaterial', code: 'RM_C506', quantity: 50 }},
      {{ itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 10 }},
      {{ itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 }},
      {{ itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 10 }}""",
    'White Sauce Pasta': f"""      {{ itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 }},
      {{ itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 200 }},
      {{ itemModel: 'RawMaterial', code: 'RM_C505', quantity: 45 }},
      {{ itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 10 }},
      {{ itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 }},
      {{ itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }}""",
    'Pink Sauce Pasta': f"""      {{ itemModel: 'SemiFinishedGood', code: 'SFG_BOILED_PASTA', quantity: 200 }},
      {{ itemModel: 'RawMaterial', code: 'RM_WATER_STOCK', quantity: 100 }},
      {{ itemModel: 'RawMaterial', code: 'RM_MILK', quantity: 100 }},
      {{ itemModel: 'RawMaterial', code: 'RM_C506', quantity: 25 }},
      {{ itemModel: 'RawMaterial', code: 'RM_C505', quantity: 20 }},
      {{ itemModel: 'RawMaterial', code: 'RM_OLIVE_OIL', quantity: 5 }},
      {{ itemModel: 'RawMaterial', code: 'RM_BUTTER', quantity: 5 }},
      {{ itemModel: 'RawMaterial', code: 'RM_MIXED_VEG', quantity: 40 }},
      {{ itemModel: 'RawMaterial', code: 'RM_CHEESE_BLEND', quantity: 10 }},
      {{ itemModel: 'RawMaterial', code: 'RM_C509', quantity: 1 }}"""
}

for name, new_block in pastas.items():
    pattern = r"('" + name + r"': \[\s*)([\s\S]*?)(\s*\])"
    c = re.sub(pattern, r"\1" + new_block + r"\3", c)


with open('src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated Pizzas, Sandwiches, Shakes, and Pastas successfully!")
