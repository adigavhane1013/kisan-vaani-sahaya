const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/diagnose'));
app.use('/api', require('./routes/stt'));
app.use('/api', require('./routes/tts'));
app.use('/api', require('./routes/price'));
app.use('/api', require('./routes/scheme'));
app.use('/api', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Demo mode check
app.get('/api/config', (req, res) => {
  res.json({
    demoMode: !process.env.VERTEX_API_KEY || process.env.DEMO_MODE === 'true',
    features: {
      stt: !!process.env.VERTEX_API_KEY,
      tts: !!process.env.VERTEX_API_KEY,
      vision: !!process.env.VERTEX_API_KEY,
      marketData: !!process.env.AGMARKNET_API_KEY
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  res.status(500).json({ 
    error: error.message || 'Internal server error',
    demo: !process.env.VERTEX_API_KEY
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🌱 Project Kisan Backend running on port ${PORT}`);
  console.log(`Demo Mode: ${!process.env.VERTEX_API_KEY || process.env.DEMO_MODE === 'true'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});