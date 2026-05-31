import { Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'kyroz_super_secret_key_123';

const PLAN_PRICES = {
  'Basic': 999 * 100, // ₹999 (in paise)
  'Pro': 1999 * 100, // ₹1999 (in paise)
  'Elite': 2999 * 100 // ₹2999 (in paise)
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

    if (plan !== 'Basic' && plan !== 'Pro' && plan !== 'Elite') {
      res.status(400).json({ error: 'Invalid plan selected' });
      return;
    }

    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];

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
    await user.save();

    // Generate a new token with the upgraded plan
    // Preserve the old sessionId so we don't log them out
    const token = jwt.sign(
      { userId: user._id, role: user.role, plan: user.subscriptionPlan, sessionId: req.user?.sessionId }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Payment successful, plan upgraded!',
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role, plan: user.subscriptionPlan }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
