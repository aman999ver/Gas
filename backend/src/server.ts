import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth';
import inquiryRoutes from './routes/inquiries';
import projectRoutes from './routes/projects';

dotenv.config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads/projects');
fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || '*'); // Allow any origin
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - updated configuration
app.use(express.static(path.join(__dirname, '../public')));
console.log('Static files directory:', path.join(__dirname, '../public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://geniusappsolu:Wiome3guu7CJCHpi@cluster0.luqgj8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/projects', projectRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: dbStatus
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   - Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   - Auth Endpoint: http://localhost:${PORT}/api/auth`);
  console.log(`   - Inquiries Endpoint: http://localhost:${PORT}/api/inquiries`);
  console.log(`   - Projects Endpoint: http://localhost:${PORT}/api/projects`);
}); 