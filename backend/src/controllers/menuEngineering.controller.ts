import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Order from '../models/Order';
import Dish from '../models/Dish';

export const getClassification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { days = 30 } = req.query;
    const start = new Date(new Date().setDate(new Date().getDate() - Number(days)));

    // Fetch all active dishes
    const dishes = await Dish.find({ userId }).lean();
    const dishMap = new Map();
    dishes.forEach((d: any) => {
      dishMap.set(d._id.toString(), {
        _id: d._id,
        name: d.name,
        price: d.price,
        ingredientPrice: d.ingredientPrice || 0,
        category: d.category,
        quantitySold: 0,
        totalRevenue: 0,
        totalCost: 0
      });
    });

    // Fetch orders to calculate demand
    const orders = await Order.find({
      userId,
      createdAt: { $gte: start }
    }).lean();

    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const dId = item.dishId.toString();
        if (dishMap.has(dId)) {
          const stats = dishMap.get(dId);
          stats.quantitySold += (item.quantity || 1);
          stats.totalRevenue += (item.price || 0) * (item.quantity || 1);
          stats.totalCost += (item.ingredientPrice || 0) * (item.quantity || 1);
        }
      });
    });

    const results = Array.from(dishMap.values());
    if (results.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Calculate averages to determine "High/Low"
    const avgQuantitySold = results.reduce((sum, r) => sum + r.quantitySold, 0) / results.length;
    // Calculate average contribution margin %
    let totalMargin = 0;
    results.forEach(r => {
      r.contributionMargin = r.totalRevenue > 0 ? ((r.totalRevenue - r.totalCost) / r.totalRevenue) * 100 : 0;
      totalMargin += r.contributionMargin;
    });
    const avgMargin = totalMargin / results.length;

    const classified = results.map(r => {
      const isHighDemand = r.quantitySold >= avgQuantitySold;
      const isHighMargin = r.contributionMargin >= avgMargin;
      
      let classification = 'Dead Item';
      if (isHighDemand && isHighMargin) classification = 'Star';
      else if (isHighDemand && !isHighMargin) {
        // Distinguish Cash Cow vs Low Margin based on a threshold (e.g., > 20%)
        classification = r.contributionMargin > 20 ? 'Cash Cow' : 'Low Margin';
      }
      else if (!isHighDemand && isHighMargin) classification = 'Puzzle'; // low demand, high margin

      return {
        ...r,
        classification,
        action: getAction(classification)
      };
    });

    res.status(200).json(classified);
  } catch (error) {
    console.error('Menu Engineering error:', error);
    res.status(500).json({ error: 'Failed to classify menu items' });
  }
};

const getAction = (classification: string) => {
  switch (classification) {
    case 'Star': return 'Promote, Feature prominently, Maintain quality';
    case 'Cash Cow': return 'Maintain, Upselling, Combos';
    case 'Low Margin': return 'Price increase, Recipe optimization, Portion optimization';
    case 'Puzzle': return 'Improve visibility, Reposition, Discount';
    case 'Dead Item': return 'Improve, Reposition, Remove from menu';
    default: return '';
  }
};

export const getSimulation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dishId, proposedPrice } = req.body;
    if (!dishId || !proposedPrice) {
      res.status(400).json({ error: 'Missing dishId or proposedPrice' });
      return;
    }

    const dish = await Dish.findById(dishId).lean() as any;
    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
      return;
    }

    const currentPrice = dish.price;
    const foodCost = dish.ingredientPrice || 0;
    
    const currentContribution = currentPrice - foodCost;
    const currentFoodCostPercent = currentPrice > 0 ? (foodCost / currentPrice) * 100 : 0;

    const proposedContribution = proposedPrice - foodCost;
    const proposedFoodCostPercent = proposedPrice > 0 ? (foodCost / proposedPrice) * 100 : 0;

    // Simulate 5% drop in volume for price increase, 5% gain for price decrease
    const volumeChange = proposedPrice > currentPrice ? -0.05 : (proposedPrice < currentPrice ? 0.05 : 0);

    res.status(200).json({
      currentPrice,
      currentFoodCostPercent: currentFoodCostPercent.toFixed(1),
      currentContribution,
      proposedPrice,
      proposedFoodCostPercent: proposedFoodCostPercent.toFixed(1),
      proposedContribution,
      volumeChangeImpact: `${(volumeChange * 100).toFixed(1)}%`
    });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
};
