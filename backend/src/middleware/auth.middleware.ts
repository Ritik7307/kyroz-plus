import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kyroz_super_secret_key_123';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    plan?: string;
    sessionId?: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET) as { userId: string; role: string; plan?: string; sessionId?: string };
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied. Unauthorized role.' });
      return;
    }
    next();
  };
};

export const isAdmin = authorizeRoles('admin');
export const isManager = authorizeRoles('admin', 'manager', 'user');
export const isCook = authorizeRoles('admin', 'manager', 'cook');
export const isBilling = authorizeRoles('admin', 'manager', 'billing');
