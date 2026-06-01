import { Router } from 'express';
import { authenticateToken, isAdmin, AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import User from '../models/User';
import MasterSop from '../models/MasterSop';
import Notification from '../models/Notification';
import GlobalSetting from '../models/GlobalSetting';

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

// Push notification to all users (Admin only)
router.post('/push-notification', authenticateToken, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, type } = req.body;
    const users = await User.find({ role: { $ne: 'admin' } }); // Push to non-admins
    
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || 'info',
      category: 'admin'
    }));

    await Notification.insertMany(notifications);
    res.json({ message: `Notification pushed to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to push notifications' });
  }
});

// Get global settings (specifically pricing) - PUBLIC ROUTE (for main website)
router.get('/settings/:key', async (req: Response | any, res: Response) => {
  try {
    const setting = await GlobalSetting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch global setting' });
  }
});

// Update global settings - ADMIN ONLY
router.put('/settings/:key', authenticateToken, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await GlobalSetting.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Settings updated successfully', setting: setting.value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update global setting' });
  }
});

export default router;
