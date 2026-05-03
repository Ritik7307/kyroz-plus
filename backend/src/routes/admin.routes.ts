import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';
import User from '../models/User';

const router = Router();

// Get all users (Admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-otpHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Get global stats (Admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    res.json({
      totalUsers,
      memberCount: totalUsers - adminCount,
      revenue: (totalUsers - adminCount) * 1499, // Estimation
      systemStatus: 'Healthy'
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

export default router;
