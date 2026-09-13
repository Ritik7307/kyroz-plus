import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Order from '../models/Order';
import Customer from '../models/Customer';
import Dish from '../models/Dish';

const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const chatWithBusinessAi = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user?.userId;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!gemini) {
      res.status(500).json({ error: 'AI is not configured on the server.' });
      return;
    }

    // 1. Fetch Business Data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Orders and Sales (Last 30 Days)
    const recentOrders = await Order.find({ 
      userId, 
      createdAt: { $gte: thirtyDaysAgo } 
    }).lean();

    let totalRevenue30Days = 0;
    let totalRevenueToday = 0;
    let totalOrders30Days = recentOrders.length;
    let totalOrdersToday = 0;

    const dishQuantityMap: Record<string, number> = {};

    recentOrders.forEach((order: any) => {
      totalRevenue30Days += (order.totalRevenue || 0);
      if (new Date(order.createdAt) >= todayStart) {
        totalRevenueToday += (order.totalRevenue || 0);
        totalOrdersToday += 1;
      }
      
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (item.dishId) {
            const id = item.dishId.toString();
            dishQuantityMap[id] = (dishQuantityMap[id] || 0) + (item.quantity || 1);
          }
        });
      }
    });

    // Top 5 Dishes
    const sortedDishes = Object.entries(dishQuantityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    const topDishIds = sortedDishes.map(d => d[0]);
    const dishes = await Dish.find({ _id: { $in: topDishIds } }).select('name').lean();
    
    const topDishesList = sortedDishes.map(([dishId, qty]) => {
      const dish = dishes.find((d: any) => d._id.toString() === dishId);
      return `${dish ? dish.name : 'Unknown Dish'} (${qty} orders)`;
    });

    // Customers
    const totalCustomers = await Customer.countDocuments({ userId });
    const recentCustomers = await Customer.find({ userId }).sort({ createdAt: -1 }).limit(5).select('name phone').lean();

    // 2. Construct the Premium Blueprint Prompt Context
    const businessContext = `
[KYROZ+ SCALE - ADVANCED BI & MENU ENGINEERING CONTEXT]
-------------------------------------------------------
BUSINESS HEALTH (Last 30 Days):
- Total Revenue: ₹${totalRevenue30Days.toFixed(2)}
- Total Orders: ${totalOrders30Days}
- Average Order Value (AOV): ₹${totalOrders30Days > 0 ? (totalRevenue30Days / totalOrders30Days).toFixed(2) : 0}
- Total Revenue (Today): ₹${totalRevenueToday.toFixed(2)}

MENU ENGINEERING & PERFORMANCE:
- Top 5 Most Sold Dishes (Volume): ${topDishesList.length > 0 ? topDishesList.join(', ') : 'No dish data'}

CUSTOMER DATA:
- Total Registered Customers: ${totalCustomers}
- Most Recent Customers: ${recentCustomers.map((c: any) => (c.name || 'Unknown')).join(', ')}

INSTRUCTIONS:
You are the "Premium AI Restaurant Consultant" for KYROZ+ SCALE. You provide highly intelligent, data-driven business advice to the restaurant owner. 
Your core objective is NOT just to report numbers, but to answer:
1. What is happening? (Advanced BI)
2. Where is the problem? (Anomaly Detection)
3. What should change? (Menu Engineering)
4. What action to take? (Premium Consulting)

CRITICAL RULES:
- Never invent numbers or hallucinate missing data.
- If the owner asks why profit/margin is low, but you lack specific ingredient cost data, state clearly: "Actual purchase/ingredient data is unavailable for this calculation, but generally..."
- Maintain context of the conversation.
- If asked for pricing recommendations, suggest actionable steps (e.g., "Consider a ₹20 price increase on your Star items").
- Respond naturally, professionally, and strategically.
-------------------------------------------------------
`;

    // 3. Generate Response
    const model = gemini.getGenerativeModel({ model: "gemini-3.6-flash" });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: businessContext }] },
        { role: 'model', parts: [{ text: "Understood. I have securely processed the restaurant's business data and am ready to answer the owner's questions." }] },
        ...history.map((h: any) => ({
          role: h.role === 'kosa' || h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.content }]
        }))
      ],
      generationConfig: {
        temperature: 0.2, // Low temp for more accurate data reporting
      }
    });

    const result = await chat.sendMessage([{ text: message }]);
    const reply = result.response.text();

    res.status(200).json({ reply, suggestions: [] });
  } catch (error: any) {
    console.error('Error in Business AI Chat:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with Business AI.' });
  }
};
