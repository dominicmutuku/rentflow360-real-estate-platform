// Main server file for Rentflow360 Real Estate Platform
// This file sets up the Express server, database connection, and routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import route modules
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const inquiryRoutes = require('./routes/inquiries');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Security and performance middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // Allow cookies
})); // Enable CORS for frontend communication
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Database connection
const connectDB = async () => {
  try {
    // Connection options for MongoDB Atlas
    const options = {
      serverSelectionTimeoutMS: 10000, // Keep trying to connect for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('🌐 URI:', process.env.MONGODB_URI ? 'URI configured' : 'URI not found');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`📍 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔒 Ready state: ${conn.connection.readyState}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Authentication failed. Check your MongoDB Atlas username and password');
      console.log('💡 Make sure the password is URL-encoded (@ = %40)');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.log('💡 DNS resolution failed. Possible causes:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the MongoDB Atlas cluster URL');
      console.log('   - Check if your IP is whitelisted in MongoDB Atlas');
      console.log('   - Try using a different DNS server');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Connection timeout. Check your network connectivity');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify your MongoDB Atlas cluster is running');
    console.log('2. Check Network Access settings in MongoDB Atlas');
    console.log('3. Ensure your current IP is whitelisted (or use 0.0.0.0/0 for testing)');
    console.log('4. Verify the connection string format');
    
    // For development, we'll continue without database
    if (process.env.NODE_ENV === 'development') {
      console.log('\n⚠️  Running in development mode without database connection');
      console.log('📝 Some features may not work properly');
      return;
    }
    
    process.exit(1);
  }
};

// Connect to database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);           // Authentication routes
app.use('/api/properties', propertyRoutes); // Property management routes
app.use('/api/users', userRoutes);          // User management routes
app.use('/api/search', searchRoutes);       // Search and filter routes
app.use('/api/inquiries', inquiryRoutes);   // Property inquiry routes
app.use('/api/admin', adminRoutes);         // Admin management routes
app.use('/api/analytics', analyticsRoutes); // Analytics routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Rentflow360 server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Rentflow360 API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      users: '/api/users',
      search: '/api/search',
      health: '/api/health'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ['/api/auth', '/api/properties', '/api/users', '/api/search']
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error.stack);
  
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Rentflow360 server running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🏠 Environment: ${process.env.NODE_ENV || 'development'}`);
});