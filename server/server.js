const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const activityRoutes = require('./routes/activityRoutes');
const targetRoutes = require('./routes/targetRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/activities', activityRoutes);
app.use('/api/target', targetRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌿 PlanetPulse server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
