import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';

export const getMyData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Example logic to return feature flags based on plan
    let unlockedFeatures = ['sop_library'];
    
    if (user.subscriptionPlan === 'Pro' || user.subscriptionPlan === 'Elite') {
      unlockedFeatures.push('costing_tools', 'unlimited_ai');
    }
    
    if (user.subscriptionPlan === 'Elite') {
      unlockedFeatures.push('scaling_strategy');
    }

    res.status(200).json({
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        plan: user.subscriptionPlan,
        features: unlockedFeatures
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching user data' });
  }
};
