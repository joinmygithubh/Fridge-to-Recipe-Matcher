/* eslint-disable no-unused-vars */

/**
 * Centralized error handler producing structured JSON responses.
 *   - Mongoose validation errors -> 400
 *   - Duplicate key (E11000)     -> 409
 *   - JWT errors                 -> 401
 *   - Everything else            -> 500
 */
function errorHandler(err, req, res, next) {
  // Mongoose validation
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }

  // Mongoose cast error (bad ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for "${err.path}".` });
  }

  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `That ${field} is already in use.` });
  }

  // JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error('[error]', err);
  }

  return res.status(status).json({
    error: err.message || 'Something went wrong on our end.',
  });
}

module.exports = errorHandler;
