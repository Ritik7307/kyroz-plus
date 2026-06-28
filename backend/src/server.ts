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
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
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
import kotRoutes from './routes/kot.routes';
import sopPacketRoutes from './routes/sopPacket.routes';
import testimonialRoutes from './routes/testimonial.routes';
import notificationRoutes from './routes/notification.routes';
import customerRoutes from './routes/customer.routes';
import wastageRoutes from './routes/wastage.routes';
import costingRoutes from './routes/costing.routes';
import eliteRoutes from './routes/elite.routes';
import marketingRoutes from './routes/marketing.routes';
import whatsappRoutes from './routes/whatsapp.routes';
import whatsappWebhookRoutes from './routes/whatsappWebhook.routes';
import googleFormRoutes from './routes/googleForm.routes';
console.log('All routes imported');

import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

const PORT = process.env.PORT || 5000;

const numWorkers = process.env.WEB_CONCURRENCY ? parseInt(process.env.WEB_CONCURRENCY, 10) : numCPUs;

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers based on WEB_CONCURRENCY or numCPUs
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();
  
  // Trust proxy is required if you are behind a reverse proxy (like Nginx or a load balancer)
  // This ensures rate limiting works correctly based on the real client IP.
  app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
console.log('Middleware configured');

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

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
app.use('/api/kots', kotRoutes);
app.use('/api/sop-packets', sopPacketRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/wastage', wastageRoutes);
app.use('/api/costing', costingRoutes);
app.use('/api/elite', eliteRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/whatsapp/webhook', whatsappWebhookRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/google-form', googleFormRoutes);
app.get('/api/debug-routes', (req, res) => {
  res.json({ message: 'Routes are active' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KYROZ API is running' });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
} // End of worker process block