import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import sopRoutes from './routes/sop.routes';
import aiRoutes from './routes/ai.routes';
import sessionRoutes from './routes/session.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KYROZ API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
