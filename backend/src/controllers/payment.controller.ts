import { Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import PurchaseReminder from '../models/PurchaseReminder';

import GlobalSetting from '../models/GlobalSetting';

const JWT_SECRET = process.env.JWT_SECRET || 'kyroz_super_secret_key_123';

const DEFAULT_PLAN_PRICES = {
  'Starter': 2499 * 100, // ₹2499 (in paise)
  'Growth': 4999 * 100, // ₹4999 (in paise)
  'Scale': 9999 * 100 // ₹9999 (in paise)
};

// Initialize Razorpay
// We use a try-catch so the app doesn't crash if keys are missing in .env
let razorpay: Razorpay | null = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
} catch (error) {
  console.warn('Razorpay keys missing or invalid in .env. Payment features will fail.');
}

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plan } = req.body;
    
    if (!razorpay) {
      res.status(500).json({ error: 'Razorpay is not configured on the server.' });
      return;
    }

    if (plan !== 'Starter' && plan !== 'Growth' && plan !== 'Scale') {
      res.status(400).json({ error: 'Invalid plan selected' });
      return;
    }

    let amount = DEFAULT_PLAN_PRICES[plan as keyof typeof DEFAULT_PLAN_PRICES];

    // Read real-time configured pricing from GlobalSetting
    try {
      const pricingSetting = await GlobalSetting.findOne({ key: 'pricing' });
      if (pricingSetting && pricingSetting.value) {
        const val = pricingSetting.value as any;
        let planObj: any;
        if (plan === 'Starter') planObj = val.starter || val.basic;
        else if (plan === 'Growth') planObj = val.growth || val.pro;
        else if (plan === 'Scale') planObj = val.scale || val.elite;

        if (planObj && planObj.price) {
          const discount = planObj.discount || 0;
          const finalPrice = Math.round(planObj.price * (1 - discount / 100));
          amount = finalPrice * 100;
        }
      }
    } catch (priceErr) {
      console.error('Error fetching dynamic pricing for order:', priceErr);
    }

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      res.status(500).json({ error: 'Razorpay secret is not configured' });
      return;
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      res.status(400).json({ error: 'Invalid payment signature' });
      return;
    }

    // Payment is successful! Update User Plan
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.subscriptionPlan = plan;
    const now = new Date();
    if (user.subscriptionExpiryDate && new Date(user.subscriptionExpiryDate) > now) {
      user.subscriptionExpiryDate = new Date(new Date(user.subscriptionExpiryDate).getTime() + 30 * 24 * 60 * 60 * 1000);
    } else {
      user.subscriptionExpiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    await user.save();

    // Cancel any pending purchase reminders since the user has now purchased
    if (user.phone) {
      try {
        await PurchaseReminder.updateMany(
          { phone: user.phone, status: 'PENDING' },
          { $set: { status: 'PURCHASED' } }
        );
      } catch (reminderErr) {
        console.error('Error updating purchase reminder status:', reminderErr);
      }
    }

    // Generate a new token with the upgraded plan
    const token = jwt.sign(
      { userId: user._id, role: user.role, plan: user.subscriptionPlan, sessionId: req.user?.sessionId, subscriptionExpiryDate: user.subscriptionExpiryDate }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Payment successful, plan upgraded!',
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role, plan: user.subscriptionPlan, subscriptionExpiryDate: user.subscriptionExpiryDate }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
