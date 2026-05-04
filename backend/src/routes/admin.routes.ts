import { Router } from 'express';
import { authenticateToken, isAdmin, AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import User from '../models/User';
import MasterSop from '../models/MasterSop';

const router = Router();

// Get all users (Admin or Manager)
router.get('/users', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Only Admin or Manager can see users
    if (req.user?.role !== 'admin' && req.user?.role !== 'manager') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const users = await User.find().select('-otpHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Update user role
router.put('/users/:id/role', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;

    // Only Admin or Manager can change roles
    if (currentUserRole !== 'admin' && currentUserRole !== 'manager') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Safety: Managers cannot promote to Admin
    if (currentUserRole === 'manager' && role === 'admin') {
      return res.status(403).json({ error: 'Managers cannot assign Admin role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Safety: Cannot change your own role
    if (user._id.toString() === currentUserId) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    user.role = role;
    await user.save();
    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating role' });
  }
});

// Get global stats (Admin only)
router.get('/stats', authenticateToken, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const masterSopCount = await MasterSop.countDocuments();
    res.json({
      totalUsers,
      memberCount: totalUsers - adminCount,
      revenue: (totalUsers - adminCount) * 1499, // Estimation
      masterSopCount,
      systemStatus: 'Healthy'
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

export default router;
