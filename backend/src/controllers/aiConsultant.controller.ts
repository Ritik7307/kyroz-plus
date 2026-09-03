import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Order from '../models/Order';
import Dish from '../models/Dish';
import WasteRecord from '../models/WasteRecord';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const consultAI = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'AI Consultant is not configured (Missing Gemini Key)' });
      return;
    }

    // --- 1. Gather Business Context (Controlled Data Layer) ---
    // In a real implementation, we would call our internal BI functions, 
    // but here we replicate the core stats quickly for the prompt context.
    const start = new Date(new Date().setDate(new Date().getDate() - 30));
    
    // Revenue & Cost
    const orders = await Order.find({ userId, createdAt: { $gte: start } }).lean();
    let totalRevenue = 0;
    let totalFoodCost = 0;
    orders.forEach(o => {
      totalRevenue += o.totalRevenue || 0;
      o.items.forEach((i: any) => totalFoodCost += (i.ingredientPrice || 0) * (i.quantity || 1));
    });
    const foodCostPercentage = totalRevenue > 0 ? (totalFoodCost / totalRevenue) * 100 : 0;
    
    // Menu Engineering (Top 3 items by volume)
    const dishMap = new Map();
    orders.forEach(o => {
      o.items.forEach((i: any) => {
        const id = i.dishId.toString();
        const curr = dishMap.get(id) || 0;
        dishMap.set(id, curr + (i.quantity || 1));
      });
    });
    
    // Convert to array and sort
    const topDishesIds = Array.from(dishMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    const topDishes = await Dish.find({ _id: { $in: topDishesIds } }).select('name price').lean();

    // --- 2. Construct Prompt ---
    const systemPrompt = `You are the KYROZ+ SCALE Premium AI Restaurant Consultant. You provide intelligent business advice to restaurant owners based on their actual data.
Never invent numbers. Do not hallucinate missing data. Distinguish between actual data and recommendations.

CURRENT BUSINESS CONTEXT (Last 30 Days):
- Total Revenue: ₹${totalRevenue.toFixed(2)}
- Total Orders: ${orders.length}
- Food Cost Percentage: ${foodCostPercentage.toFixed(1)}% (Target is usually < 35%)
- Top Selling Items: ${topDishes.map(d => d.name).join(', ') || 'None yet'}

USER QUESTION:
${query}

Provide a structured, professional, and actionable response in the context of the data above. If the user asks for a price change, propose the change clearly but remind them to use the approval UI.`;

    // --- 3. Call Gemini ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('AI Consultant error:', error);
    res.status(500).json({ error: 'Failed to generate AI consultation' });
  }
};
