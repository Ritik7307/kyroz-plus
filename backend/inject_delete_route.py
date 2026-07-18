import sys
import re

with open('src/routes/dish.routes.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Make sure deleteAllDishes is imported
c = c.replace('deleteDish, getPublicDishes', 'deleteDish, deleteAllDishes, getPublicDishes')

# Insert the route before deleteDish route
new_route = "router.delete('/all', authenticateToken, isManager, deleteAllDishes);\n"
c = c.replace("router.delete('/:id',", new_route + "router.delete('/:id',")

with open('src/routes/dish.routes.ts', 'w', encoding='utf-8') as f:
    f.write(c)
