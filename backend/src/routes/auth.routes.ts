import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { sendOtp, verifyOtp, logout, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rate limiter for sending OTPs to prevent brute force/spam
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: { error: 'Too many OTP requests from this IP, please try again after 15 minutes' }
});

router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.get('/me', authenticateToken, getProfile);
router.put('/update-profile', authenticateToken, updateProfile);

export default router;
