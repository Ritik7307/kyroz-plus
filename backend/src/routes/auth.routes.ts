import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { sendOtp, verifyOtp, logout, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rate limiter for sending OTPs to prevent brute force/spam
const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 OTP requests per minute
  message: { error: 'Too many OTP requests. Please wait a minute.' }
});

router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.get('/me', authenticateToken, getProfile);
router.put('/update-profile', authenticateToken, updateProfile);

export default router;
