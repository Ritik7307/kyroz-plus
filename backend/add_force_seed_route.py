import sys

with open('src/controllers/dish.controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

new_func = """
export const forceSeedDb = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    await (Recipe as any).deleteMany({ userId, entityModel: 'Dish' });
    await (Dish as any).deleteMany({ userId });
    await seedBlueprints(userId);
    res.status(200).json({ message: 'Database successfully cleared and re-seeded with EXACT 30gm recipes and correct naming!' });
  } catch (error) {
    console.error('forceSeedDb error:', error);
    res.status(500).json({ error: 'Failed to force seed db' });
  }
};
"""

c = c.replace('export const deleteAllDishes = ', new_func + '\nexport const deleteAllDishes = ')

with open('src/controllers/dish.controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/routes/dish.routes.ts', 'r', encoding='utf-8') as f:
    r = f.read()

r = r.replace('deleteDish, deleteAllDishes, getPublicDishes', 'deleteDish, deleteAllDishes, getPublicDishes, forceSeedDb')
r = r.replace("router.get('/public/:userId', getPublicDishes);", "router.get('/public/:userId', getPublicDishes);\nrouter.get('/public-force-seed/:userId', forceSeedDb);")

with open('src/routes/dish.routes.ts', 'w', encoding='utf-8') as f:
    f.write(r)

print("Added public force seed route")
