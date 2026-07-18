import re

with open('src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Rename Aloo Patty
c = c.replace("name: 'Aloo Patty'", "name: 'C-502 Patty (SFG)'")
# Rename Classic Burger Sauce
c = c.replace("name: 'Classic Burger Sauce'", "name: 'C-503 Burger Sauce (SFG)'")
# Rename Veg Patty to just be in line with C-502 if needed, but let's just do Aloo Patty for now.
# Also "Lettuce" is fine, but they wrote "Lettuce/Cabbage"
c = c.replace("name: 'Lettuce'", "name: 'Lettuce/Cabbage'")

# Wait, they also specified "C-502 Patty (SFG)" and "C-503 Burger Sauce (SFG)" in the SFG Master.
# Let's write the changes back.

with open('src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print("Renamed components")
