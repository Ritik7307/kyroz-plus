import dotenv from 'dotenv';
dotenv.config();

console.log('--- KYYROZ-PLUS SERVER STARTUP ---');
console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT FOUND');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'FOUND' : 'NOT FOUND');
console.log('-----------------------------');

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
console.log('Loaded auth routes');
import userRoutes from './routes/user.routes';
console.log('Loaded user routes');
import sopRoutes from './routes/sop.routes';
console.log('Loaded sop routes');
import aiRoutes from './routes/ai.routes';
import sessionRoutes from './routes/session.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';
import masterSopRoutes from './routes/masterSop.routes';
import dishRoutes from './routes/dish.routes';
import uploadRoutes from './routes/upload.routes';
import inventoryRoutes from './routes/inventory.routes';
import orderRoutes from './routes/order.routes';
import sopPacketRoutes from './routes/sopPacket.routes';
import testimonialRoutes from './routes/testimonial.routes';
import notificationRoutes from './routes/notification.routes';
import customerRoutes from './routes/customer.routes';
console.log('All routes imported');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
console.log('Middleware configured');

// Request Logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/public', express.static('public'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/kyroz';
console.log('Connecting to MongoDB...');
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
app.use('/api/dishes', dishRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sop-packets', sopPacketRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/customers', customerRoutes);

app.get('/api/debug-routes', (req, res) => {
  res.json({ message: 'Routes are active' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KYROZ API is running' });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});