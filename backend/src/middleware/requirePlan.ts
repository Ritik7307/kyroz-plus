import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

const PLAN_LEVELS = {
  'Basic': 1,
  'Pro': 2,
  'Elite': 3
};

export const requirePlan = (requiredPlan: 'Basic' | 'Pro' | 'Elite') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userPlan = req.user?.plan as 'Basic' | 'Pro' | 'Elite' | undefined;

    if (!userPlan) {
      res.status(403).json({ error: 'No subscription plan found.' });
      return;
    }

    if (PLAN_LEVELS[userPlan] < PLAN_LEVELS[requiredPlan]) {
      res.status(403).json({ 
        error: `Access Denied. This feature requires the ${requiredPlan} plan. Please upgrade.` 
      });
      return;
    }

    next();
  };
};
