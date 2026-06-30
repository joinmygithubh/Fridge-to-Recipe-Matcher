const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Connect to MongoDB Atlas using the MONGODB_URI environment variable.
 * We rely exclusively on Atlas (a mongodb+srv:// cloud URI) — never local MongoDB.
 * Retries up to 5 times, 5 seconds apart, with clear console logging.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      '[db] MONGODB_URI is not set. Add your MongoDB Atlas connection string to your .env file.'
    );
    process.exit(1);
  }

  mongoose.set('strictQuery', true);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      console.log(`[db] Connecting to MongoDB Atlas (attempt ${attempt}/${MAX_RETRIES})...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`[db] Connected to MongoDB Atlas: ${conn.connection.host}`);

      mongoose.connection.on('disconnected', () => {
        console.warn('[db] MongoDB connection lost.');
      });
      mongoose.connection.on('error', (err) => {
        console.error('[db] MongoDB connection error:', err.message);
      });

      return conn;
    } catch (err) {
      console.error(`[db] Connection attempt ${attempt} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`[db] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await wait(RETRY_DELAY_MS);
      } else {
        console.error('[db] All connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
}

module.exports = connectDB;
