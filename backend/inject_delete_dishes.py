import sys

with open('src/controllers/dish.controller.ts', 'r', encoding='utf-8') as f:
    c = f.read()

new_func = """
export const deleteAllDishes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await Recipe.deleteMany({ userId, entityModel: 'Dish' });
    await Dish.deleteMany({ userId });
    res.status(200).json({ message: 'All dishes and their recipes have been deleted successfully.' });
  } catch (error) {
    console.error('deleteAllDishes error:', error);
    res.status(500).json({ error: 'Failed to delete dishes' });
  }
};
"""

c = c.replace('export const getDishes = ', new_func + '\nexport const getDishes = ')

with open('src/controllers/dish.controller.ts', 'w', encoding='utf-8') as f:
    f.write(c)
