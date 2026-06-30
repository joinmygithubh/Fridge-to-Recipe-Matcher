require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const fridgeRoutes = require('./routes/fridge');
const shoppingListRoutes = require('./routes/shoppingList');

const app = express();
const PORT = process.env.PORT || 5000;

// Security + parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), time: new Date().toISOString() });
});

// Rate limiting + routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/recipe', generalLimiter, recipeRoutes);
app.use('/api/fridge', generalLimiter, fridgeRoutes);
app.use('/api/shopping-list', generalLimiter, shoppingListRoutes);

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start the server only after the database connects.
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

if (require.main === module) {
  start();
}

module.exports = app;
