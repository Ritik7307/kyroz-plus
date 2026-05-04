import dotenv from 'dotenv';
dotenv.config();

console.log('--- KYROZ SERVER STARTUP ---');
console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT FOUND');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'FOUND' : 'NOT FOUND');
console.log('-----------------------------');

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import sopRoutes from './routes/sop.routes';
import aiRoutes from './routes/ai.routes';
import sessionRoutes from './routes/session.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import masterSopRoutes from './routes/masterSop.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Request Logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/public', express.static('public'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sops', sopRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/master-sops', masterSopRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KYROZ API is running' });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});