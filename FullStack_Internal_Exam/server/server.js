const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/auth_portal');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('⚠️  MongoDB is not running locally. Please install and start MongoDB:');
    console.log('   Option 1: Install MongoDB Community Server from https://www.mongodb.com/try/download/community');
    console.log('   Option 2: Use MongoDB Atlas (cloud) at https://www.mongodb.com/atlas');
    console.log('   Option 3: Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.log('🔄 Server will continue running, but authentication features won\'t work without database');
    return false;
  }
};

// Connect to database (non-blocking)
let isDBConnected = false;
connectDB().then(connected => {
  isDBConnected = connected;
});

// Database check middleware for auth routes
const checkDB = (req, res, next) => {
  if (!isDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database not available. Please ensure MongoDB is running.',
      error: 'DATABASE_CONNECTION_FAILED',
      instructions: {
        option1: 'Install MongoDB Community Server from https://www.mongodb.com/try/download/community',
        option2: 'Use MongoDB Atlas (cloud) at https://www.mongodb.com/atlas',
        option3: 'Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest'
      }
    });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Authentication API is running!',
    database: isDBConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: isDBConnected ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Auth routes with database check
app.use('/api/auth', checkDB, require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});