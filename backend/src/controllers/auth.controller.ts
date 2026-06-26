import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UAParser } from 'ua-parser-js';
import User from '../models/User';
import Session from '../models/Session';
import { AuthRequest } from '../middleware/auth.middleware';
import { syncMasterSopsForUser } from '../services/sop.service';
import { Resend } from 'resend';

const JWT_SECRET = process.env.JWT_SECRET || 'kyroz_super_secret_key_123';

const PLAN_LIMITS = {
  'Starter': 1,
  'Growth': 1,
  'Scale': 4,
  'Admin': 999
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, shopName, shopAddress, gstNumber } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      shopName,
      shopAddress,
      gstNumber,
      role: 'user', // Default role for signups
      subscriptionPlan: 'None'
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    console.error('❌ [AUTH] Signup Error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Admin Password Bypass
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    let user;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      user = await User.findOne({ email });
      if (!user) {
        user = new User({ email, role: 'admin', subscriptionPlan: 'Admin', name: 'Super Admin' });
        await user.save();
      } else if (user.role !== 'admin') {
        user.role = 'admin';
        user.subscriptionPlan = 'Admin';
        await user.save();
      }
      console.log(`[AUTH] Admin Login: ${email}`);
    } else {
      user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }
      
      if (!user.password) {
        res.status(400).json({ error: 'Invalid credentials. User might be registered without a password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }
      console.log(`[AUTH] User Login: ${email}`);
    }

    // Sync Master SOPs in background
    syncMasterSopsForUser(user._id as any).catch(err => console.error('BG Sync failed:', err));

    // ----------------------------------------------------
    // SESSION MANAGEMENT & DEVICE LIMIT LOGIC
    // ----------------------------------------------------
    const parser = new UAParser(req.headers['user-agent']);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const deviceInfo = `${browser.name || 'Unknown Browser'} on ${os.name || 'Unknown OS'}`;
    const ipAddress = req.ip || req.socket?.remoteAddress || 'Unknown IP';

    const activeSessions = await Session.find({ userId: user._id }).sort({ lastActive: 1 });
    const limit = PLAN_LIMITS[user.subscriptionPlan as keyof typeof PLAN_LIMITS] || 1;

    if (activeSessions.length >= limit) {
      const oldestSession = activeSessions[0];
      await Session.findByIdAndDelete(oldestSession._id);
      console.log(`Removed oldest session for user ${user.email} due to device limits.`);
    }

    const newSession = new Session({
      userId: user._id,
      deviceInfo,
      ipAddress,
      lastActive: new Date()
    });
    await newSession.save();
    // ----------------------------------------------------

    const token = jwt.sign(
      { userId: user._id, role: user.role, plan: user.subscriptionPlan, sessionId: newSession._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role, plan: user.subscriptionPlan, shopName: user.shopName, permissions: user.permissions || [] }
    });
  } catch (error: any) {
    console.error('❌ [AUTH] Login Error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Requires a custom auth middleware that extracts sessionId
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.sessionId) {
        await Session.findByIdAndDelete(decoded.sessionId);
      }
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-otpHash');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, shopName, shopAddress, gstNumber, gstPercentage, paymentQrCode, selectedSopCategory } = req.body;

    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (shopName) user.shopName = shopName;
    if (shopAddress) user.shopAddress = shopAddress;
    if (gstNumber) user.gstNumber = gstNumber;
    if (gstPercentage !== undefined) user.gstPercentage = gstPercentage;
    if (paymentQrCode !== undefined) user.paymentQrCode = paymentQrCode;
    if (selectedSopCategory !== undefined) user.selectedSopCategory = selectedSopCategory;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};
