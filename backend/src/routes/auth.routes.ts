import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, logout, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rate limiter for login to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per 15 minutes
  message: { error: 'Too many login requests. Please wait 15 minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getProfile);
router.put('/update-profile', authenticateToken, updateProfile);

export default router;
