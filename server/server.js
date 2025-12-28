const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ========== MIDDLEWARE ==========
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS
const corsOrigins = process.env.FRONTEND_URL ? 
  process.env.FRONTEND_URL.split(',') : 
  ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', apiLimiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`   ↳ ${res.statusCode} ${duration}ms`);
  });
  
  next();
});

// ========== DATABASE CONNECTION ==========
const connectDB = async () => {
  try {
    // For mongoose 6+, these options are default and not needed
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Listen for connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('📊 MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Make sure MongoDB is running locally or Atlas connection string is correct');
    console.log('   2. Check if MONGODB_URI is set in .env file');
    console.log('   3. For MongoDB Atlas: Check network access and database user permissions');
    console.log('   4. For local MongoDB: Run "mongod" in a separate terminal');
    
    // Retry connection in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// ========== ROUTES ==========
// Import routes with error handling
try {
  const authRoutes = require('./routes/authroute');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('⚠️  Auth routes not found:', error.message);
}

try {
  const profileRoutes = require('./routes/profileroute');
  app.use('/api/profile', profileRoutes);
  console.log('✅ Profile routes loaded');
} catch (error) {
  console.log('⚠️  Profile routes not found:', error.message);
  // Create temporary profile routes
  const tempProfileRouter = express.Router();
  tempProfileRouter.get('/options', (req, res) => {
    res.json({ 
      success: true, 
      message: "Profile options (temporary)",
      data: {
        gender: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }],
        religion: [{ value: 'christianity', label: 'Christianity' }]
      }
    });
  });
  app.use('/api/profile', tempProfileRouter);
}

try {
  const adminRoutes = require('./routes/adminroute');
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.log('⚠️  Admin routes not found:', error.message);
}

// Health check with detailed DB info
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // Try a simple query to verify database is working
    let dbPing = 'unknown';
    if (dbState === 1) { // connected
      try {
        await mongoose.connection.db.admin().ping();
        dbPing = 'ok';
      } catch (pingError) {
        dbPing = 'ping-failed';
      }
    }
    
    res.json({ 
      status: 'OK',
      service: 'JWLovers API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        state: dbStates[dbState],
        stateCode: dbState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        ping: dbPing
      },
      uptime: `${Math.floor(process.uptime())} seconds`
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// API info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'JWLovers API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      admin: '/api/admin'
    },
    documentation: 'Add your API docs link here'
  });
});

// ========== ERROR HANDLING ==========
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    message: 'The requested endpoint does not exist',
    availableRoutes: [
      'GET /health - Health check',
      'GET /api - API information',
      'GET /api/profile/options - Profile options',
      'POST /api/auth/register - Register new user',
      'POST /api/auth/login - User login'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS origins: ${corsOrigins.join(', ')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API info: http://localhost:${PORT}/api`);
  console.log(`👤 Profile options: http://localhost:${PORT}/api/profile/options`);
});

// Graceful shutdown for server
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;