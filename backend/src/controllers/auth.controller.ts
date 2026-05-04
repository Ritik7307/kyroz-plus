import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { UAParser } from 'ua-parser-js';
import User from '../models/User';
import Session from '../models/Session';
import { AuthRequest } from '../middleware/auth.middleware';
import { syncMasterSopsForUser } from '../services/sop.service';

const JWT_SECRET = process.env.JWT_SECRET || 'kyroz_super_secret_key_123';

const PLAN_LIMITS = {
  'Basic': 1,
  'Pro': 2,
  'Elite': 3,
  'Admin': 999
};

// Create transporter function to use Port 465 (SSL) for maximum reliability with Gmail
const getTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, shopName, shopAddress, gstNumber } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    
    // Hash OTP - reduced rounds for speed (still secure for 5-min OTP)
    const otpHash = await bcrypt.hash(plainOtp, 6);

    // Single DB operation instead of two
    try {
      await User.findOneAndUpdate(
        { email },
        { 
          $set: { 
            otpHash, 
            otpExpiresAt,
            ...(name && { name }),
            ...(shopName && { shopName }),
            ...(shopAddress && { shopAddress }),
            ...(gstNumber && { gstNumber })
          } 
        },
        { upsert: true, new: true }
      );
    } catch (dbError: any) {
      console.error('Database error while saving user/OTP:', dbError);
      res.status(500).json({ error: 'Database error', details: dbError.message });
      return;
    }

    console.log(`[DEBUG] OTP for ${email}: ${plainOtp}`);
    // Send Real Email in background to speed up UI
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: `"KYROZ Security" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your KYROZ Login Code',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">Welcome to KYROZ</h2>
            <p style="color: #666; font-size: 16px;">Your 6-digit verification code is:</p>
            <h1 style="font-size: 48px; letter-spacing: 5px; color: #d4af37; margin: 20px 0;">${plainOtp}</h1>
            <p style="color: #999; font-size: 14px;">This code will expire in 5 minutes. Do not share it with anyone.</p>
          </div>
        `
      };
      
      // Fire and forget (errors logged in console)
      getTransporter().sendMail(mailOptions)
        .then(() => console.log(`Sent real email OTP to ${email}`))
        .catch(err => console.error('Nodemailer background error:', err));
    } else {
      console.log(`[MOCK EMAIL OTP] Sent to ${email}: ${plainOtp}`);
    }

    res.status(200).json({ message: 'OTP sent to email successfully' });
  } catch (error: any) {
    console.error('General error in sendOtp:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    
    if (!user || !user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Sync Master SOPs in background
    syncMasterSopsForUser(user._id as any).catch(err => console.error('BG Sync failed:', err));

    // Clear OTP
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // ----------------------------------------------------
    // SESSION MANAGEMENT & DEVICE LIMIT LOGIC
    // ----------------------------------------------------
    const parser = new UAParser(req.headers['user-agent']);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const deviceInfo = `${browser.name || 'Unknown Browser'} on ${os.name || 'Unknown OS'}`;
    const ipAddress = req.ip || req.socket.remoteAddress || 'Unknown IP';

    // Check existing active sessions
    const activeSessions = await Session.find({ userId: user._id }).sort({ lastActive: 1 });
    
    const limit = PLAN_LIMITS[user.subscriptionPlan as keyof typeof PLAN_LIMITS] || 1;

    // If limit exceeded, kick out the oldest session
    if (activeSessions.length >= limit) {
      const oldestSession = activeSessions[0];
      await Session.findByIdAndDelete(oldestSession._id);
      console.log(`Removed oldest session for user ${user.email} due to device limits.`);
    }

    // Create new session
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
      token, 
      user: { id: user._id, email: user.email, name: user.name, role: user.role, plan: user.subscriptionPlan } 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Server error while verifying OTP' });
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
    const { name, shopName, shopAddress, gstNumber } = req.body;
    
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (shopName) user.shopName = shopName;
    if (shopAddress) user.shopAddress = shopAddress;
    if (gstNumber) user.gstNumber = gstNumber;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};
