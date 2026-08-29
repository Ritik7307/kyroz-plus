import sys

with open('backend/src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()


# Dish
content = content.replace(
    '''  const dishIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const dish of dishData) {
    const createdDish = await Dish.create({ ...dish, userId });
    dishIds[dish.name] = createdDish._id as mongoose.Types.ObjectId;
  }''',
    '''  const dishIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const dish of dishData) {
    const createdDish = await Dish.findOneAndUpdate({ name: dish.name, userId }, { $set: { ...dish, userId, isInventoryLinked: true, ingredientPrice: Math.floor(dish.price * 0.35) } }, { upsert: true, new: true });
    if(createdDish) dishIds[dish.name] = createdDish._id as mongoose.Types.ObjectId;
  }'''
)

# SFG Recipe
content = content.replace(
    '''      await Recipe.create({
        targetModel: 'SemiFinishedGood',
        targetId: sfgIds[sfg.code],
        ingredients: [
          { itemModel: 'RawMaterial', itemId: rmIds[rmCode], quantity: sfg.batchYield }
        ],
        targetYield: sfg.batchYield,
        operationalYield: sfg.batchYield,
        userId
      });''',
    '''      await Recipe.findOneAndUpdate(
        { targetModel: 'SemiFinishedGood', targetId: sfgIds[sfg.code], userId },
        { $set: {
          ingredients: [
            { itemModel: 'RawMaterial', itemId: rmIds[rmCode], quantity: sfg.batchYield }
          ],
          targetYield: sfg.batchYield,
          operationalYield: sfg.batchYield,
          userId
        } },
        { upsert: true, new: true }
      );'''
)

with open('backend/src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)
