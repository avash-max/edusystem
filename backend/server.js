const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===================== MIDDLEWARE =====================
// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ===================== HEALTH CHECK =====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EduLearn API is running',
    timestamp: new Date().toISOString()
  });
});

// ===================== DATABASE CONNECTION =====================
// TODO: Add MongoDB connection
// const connectDB = require('./config/db');
// connectDB();

// ===================== ROUTES =====================
// TODO: Import and use routes
// const authRoutes = require('./routes/auth');
// const courseRoutes = require('./routes/courses');
// const assignmentRoutes = require('./routes/assignments');
// const gradeRoutes = require('./routes/grades');
// const userRoutes = require('./routes/users');

// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/assignments', assignmentRoutes);
// app.use('/api/grades', gradeRoutes);
// app.use('/api/users', userRoutes);

// ===================== ERROR HANDLING =====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ===================== START SERVER =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════╗
    ║     EduLearn LMS - Backend API     ║
    ╠════════════════════════════════════╣
    ║  Server started on port ${PORT}       ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}          ║
    ║  Homepage: http://localhost:${PORT}        ║
    ║  Health: http://localhost:${PORT}/api/health ║
    ╚════════════════════════════════════╝
  `);
});

module.exports = app;
