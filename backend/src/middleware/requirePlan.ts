import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

const PLAN_LEVELS = {
  'Starter': 1,
  'Growth': 2,
  'Scale': 3
};

export const requirePlan = (requiredPlan: 'Starter' | 'Growth' | 'Scale') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userPlan = req.user?.plan as 'Starter' | 'Growth' | 'Scale' | undefined;

    // Admins bypass all plan checks
    if (req.user?.role === 'admin') {
      return next();
    }

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
