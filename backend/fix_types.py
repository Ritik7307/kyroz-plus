import sys

with open('src/controllers/dish.controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the previous flawed injection
c = c.replace('await Recipe.deleteMany', 'await (Recipe as any).deleteMany')
c = c.replace('await Dish.deleteMany', 'await (Dish as any).deleteMany')

with open('src/controllers/dish.controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)
