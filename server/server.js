const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const activityRoutes = require('./routes/activityRoutes');
const targetRoutes = require('./routes/targetRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ── Middleware ────────────────────────────────────────────────────────────────
// CORS: in production only allow the deployed frontend origin
const corsOptions = isProd
  ? {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }
  : {}; // dev: allow all
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(isProd ? 'combined' : 'dev'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/activities', activityRoutes);
app.use('/api/target', targetRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    status: isDbConnected ? 'healthy' : 'degraded',
    database: isDbConnected ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌿 PlanetPulse server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
