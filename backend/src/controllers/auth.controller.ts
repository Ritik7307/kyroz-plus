import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { UAParser } from 'ua-parser-js';
import User from '../models/User';
import Session from '../models/Session';
import { AuthRequest } from '../middleware/auth.middleware';
import { syncMasterSopsForUser } from '../services/sop.service';

const JWT_SECRET = process.env.JWT_SECRET || 'kyroz_super_secret_key_123';

const PLAN_LIMITS = {
  'Starter': 1,
  'Growth': 1,
  'Scale': 4,
  'Admin': 999
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, shopName, shopAddress, gstNumber, isSignup } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Admin/Staff Password Bypass
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let adminUser = await User.findOne({ email });
      if (!adminUser) {
        adminUser = new User({ email, role: 'admin', subscriptionPlan: 'Admin', name: 'Super Admin' });
        await adminUser.save();
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        adminUser.subscriptionPlan = 'Admin';
        await adminUser.save();
      }

      console.log(`[AUTH] Admin Password Login: ${email}`);
      const parser = new UAParser(req.headers['user-agent']);
      const deviceInfo = `${parser.getBrowser().name || 'Unknown'} on ${parser.getOS().name || 'Unknown'}`;
      
      const newSession = new Session({
        userId: adminUser._id,
        deviceInfo,
        ipAddress: req.ip || 'Unknown',
        lastActive: new Date()
      });
      await newSession.save();

      const token = jwt.sign(
        { userId: adminUser._id, role: adminUser.role, plan: adminUser.subscriptionPlan, sessionId: newSession._id }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      res.status(200).json({ 
        message: 'Admin login successful',
        isDirectLogin: true,
        token,
        user: { 
          id: adminUser._id, 
          email: adminUser.email, 
          name: adminUser.name, 
          role: adminUser.role, 
          plan: adminUser.subscriptionPlan 
        } 
      });
      return;
    }

    // Regular Staff Password Login
    if (password) {
      const user = await User.findOne({ email });
      if (user && user.password && await bcrypt.compare(password, user.password)) {
        console.log(`[AUTH] Staff Password Login: ${email}`);
        
        const parser = new UAParser(req.headers['user-agent']);
        const deviceInfo = `${parser.getBrowser().name || 'Unknown'} on ${parser.getOS().name || 'Unknown'}`;
        
        const newSession = new Session({
          userId: user._id,
          deviceInfo,
          ipAddress: req.ip || 'Unknown',
          lastActive: new Date()
        });
        await newSession.save();

        const token = jwt.sign(
          { userId: user._id, role: user.role, plan: user.subscriptionPlan, sessionId: newSession._id }, 
          JWT_SECRET, 
          { expiresIn: '7d' }
        );

        res.status(200).json({ 
          message: 'Login successful',
          isDirectLogin: true,
          token,
          user: { 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            role: user.role, 
            plan: user.subscriptionPlan,
            shopName: user.shopName
          } 
        });
        return;
      }
    }

    // Signup vs Login separation
    const existingUser = await User.findOne({ email });

    if (!isSignup && !existingUser) {
      // Trying to login but user doesn't exist
      res.status(404).json({ error: 'Account not found. Please sign up first.' });
      return;
    }

    if (isSignup && existingUser && existingUser.name) {
      // Allow them to proceed to verify, but maybe they should just log in. 
      // It will just overwrite OTP, which is fine.
    }

    // Generate 6-digit OTP
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    
    // Hash OTP
    const otpHash = await bcrypt.hash(plainOtp, 4);

    await User.findOneAndUpdate(
      { email },
      { 
        $set: { 
          otpHash, 
          otpExpiresAt,
          ...(name && { name }),
          ...(phone && { phone }),
          ...(shopName && { shopName }),
          ...(shopAddress && { shopAddress }),
          ...(gstNumber && { gstNumber })
        } 
      },
      { upsert: true, new: true }
    );

    console.log(`[AUTH] Generating OTP for ${email}: ${plainOtp}`);
    
    try {
      // Send email asynchronously without awaiting to reduce latency
      resend.emails.send({
        from: `KYROZ Security <no-reply@kyrozplus.com>`,
        to: email,
        subject: 'Your KYROZ Login Code',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #d4af37; border-radius: 10px;">
            <h2>Your KYROZ Login Code</h2>
            <p style="font-size: 32px; font-weight: bold; color: #d4af37; letter-spacing: 5px;">${plainOtp}</p>
            <p>Enter this code to verify your identity. Valid for 5 minutes.</p>
          </div>
        `
      })
      .then(() => {
        console.log(`✅ [RESEND] OTP sent to ${email}`);
      })
      .catch((resendErr: any) => {
        console.error('❌ [RESEND] Error:', resendErr);
      });
      
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err: any) {
      console.error('❌ [RESEND] Setup Error:', err);
      res.status(500).json({ error: 'Email Sending Failed', details: err.message });
    }
  } catch (error: any) {
    console.error('❌ [AUTH] Error:', error);
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
    const ipAddress = req.ip || req.socket?.remoteAddress || 'Unknown IP';

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
